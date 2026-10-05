import { useEffect, useRef, useState } from 'react';
import { useQueryClient, type Query } from '@tanstack/react-query';
import { type StaleTimeValue, formatMs, formatSeconds } from './config';

type LogKind = 'fetch' | 'success' | 'invalidate' | 'inactive' | 'gc';
type LogEntry = { id: number; at: number; kind: LogKind; text: string };

const LOG_COLORS: Record<LogKind, string> = {
  fetch: '#1f6feb',
  success: '#1a7f37',
  invalidate: '#9a6700',
  inactive: '#57606a',
  gc: '#cf222e',
};

const LOG_LABELS: Record<LogKind, string> = {
  fetch: 'NETWORK',
  success: 'DATA',
  invalidate: 'INVALIDATE',
  inactive: 'INACTIVE',
  gc: 'GC',
};

const useNow = (intervalMs: number) => {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return now;
};

const Badge = ({ color, children }: { color: string; children: string }) => (
  <span
    style={{
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      color: '#fff',
      background: color,
    }}
  >
    {children}
  </span>
);

const Bar = ({ fraction, color, label }: { fraction: number; color: string; label: string }) => (
  <div style={{ marginTop: 8 }}>
    <div style={{ fontSize: 13, color: '#57606a', marginBottom: 2 }}>{label}</div>
    <div style={{ height: 8, background: '#eaeef2', borderRadius: 4, overflow: 'hidden' }}>
      <div
        style={{
          width: `${Math.min(Math.max(fraction, 0), 1) * 100}%`,
          height: '100%',
          background: color,
          transition: 'width 0.2s linear',
        }}
      />
    </div>
  </div>
);

const QueryRow = ({
  query,
  now,
  staleTime,
  inactiveSince,
}: {
  query: Query;
  now: number;
  staleTime: StaleTimeValue;
  inactiveSince?: number;
}) => {
  const { data, dataUpdatedAt, fetchStatus, isInvalidated } = query.state;
  const observers = query.getObserversCount();
  const age = dataUpdatedAt ? now - dataUpdatedAt : 0;
  const isStatic = staleTime === 'static';
  const isStale = data === undefined || (!isStatic && (isInvalidated || age >= staleTime));
  const isFetching = fetchStatus === 'fetching';

  let freshLabel = 'данных ещё нет';
  if (data !== undefined) {
    if (isStatic) freshLabel = "fresh навсегда (staleTime: 'static'), инвалидация игнорируется";
    else if (isInvalidated) freshLabel = 'stale: инвалидирован вручную';
    else if (staleTime === Infinity) freshLabel = 'fresh навсегда (staleTime: Infinity)';
    else if (isStale) freshLabel = `stale: данным ${formatSeconds(age)}, staleTime ${formatMs(staleTime)}`;
    else freshLabel = `fresh, станет stale через ${formatSeconds(staleTime - age)}`;
  }

  const gcLeft = inactiveSince === undefined ? undefined : query.gcTime - (now - inactiveSince);

  return (
    <div style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: 12, marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <code style={{ fontWeight: 600 }}>{JSON.stringify(query.queryKey)}</code>
        {isFetching && <Badge color="#1f6feb">fetching</Badge>}
        <Badge color={isStale ? '#9a6700' : '#1a7f37'}>{isStale ? 'stale' : 'fresh'}</Badge>
        <Badge color={observers > 0 ? '#1f2328' : '#8c959f'}>
          {observers > 0 ? `active · подписчиков: ${observers}` : 'inactive'}
        </Badge>
      </div>

      <Bar
        fraction={isStale ? 1 : isStatic ? 0 : age / staleTime}
        color={isStale ? '#d4a72c' : '#2da44e'}
        label={freshLabel}
      />
      <Bar
        fraction={gcLeft === undefined ? 0 : 1 - gcLeft / query.gcTime}
        color="#cf222e"
        label={
          gcLeft === undefined
            ? 'есть подписчики, GC не запланирован'
            : `нет подписчиков, удалится из кеша через ${formatSeconds(gcLeft)}`
        }
      />
    </div>
  );
};

export const CacheInspector = ({ staleTime }: { staleTime: StaleTimeValue }) => {
  const queryCache = useQueryClient().getQueryCache();
  const now = useNow(200);
  const [startedAt] = useState(Date.now);
  const inactiveSince = useRef(new Map<string, number>());
  const logId = useRef(0);
  const [log, setLog] = useState<LogEntry[]>([]);

  useEffect(() => {
    const push = (kind: LogKind, text: string) =>
      setLog((prev) => [{ id: logId.current++, at: Date.now(), kind, text }, ...prev].slice(0, 40));

    return queryCache.subscribe((event) => {
      const key = JSON.stringify(event.query.queryKey);
      const hash = event.query.queryHash;

      switch (event.type) {
        case 'observerAdded':
          inactiveSince.current.delete(hash);
          break;
        case 'observerRemoved':
          if (event.query.getObserversCount() === 0) {
            inactiveSince.current.set(hash, Date.now());
            push('inactive', `${key}: подписчиков нет, GC через ${formatMs(event.query.gcTime)}`);
          }
          break;
        case 'removed':
          inactiveSince.current.delete(hash);
          push('gc', `${key}: удалён из кеша`);
          break;
        case 'updated':
          if (event.action.type === 'fetch') push('fetch', `${key}: запрос на сервер`);
          if (event.action.type === 'success') push('success', `${key}: данные получены`);
          if (event.action.type === 'invalidate') push('invalidate', `${key}: invalidateQueries`);
          break;
      }
    });
  }, [queryCache]);

  const queries = queryCache.getAll();
  const networkCount = log.filter((entry) => entry.kind === 'fetch').length;

  return (
    <section>
      <h3 style={{ margin: '0 0 12px' }}>Кеш QueryClient</h3>
      {queries.length === 0 && (
        <div style={{ color: '#57606a', fontSize: 14, marginBottom: 8 }}>Кеш пуст</div>
      )}
      {queries.map((query) => (
        <QueryRow
          key={query.queryHash}
          query={query}
          now={now}
          staleTime={staleTime}
          inactiveSince={inactiveSince.current.get(query.queryHash)}
        />
      ))}

      <h3 style={{ margin: '20px 0 8px' }}>
        События <span style={{ fontWeight: 400, color: '#57606a' }}>· запросов в сеть: {networkCount}</span>
      </h3>
      <div style={{ fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 13, lineHeight: 1.7 }}>
        {log.map((entry) => (
          <div key={entry.id}>
            <span style={{ color: '#8c959f' }}>+{((entry.at - startedAt) / 1000).toFixed(1)}с </span>
            <span style={{ color: LOG_COLORS[entry.kind], fontWeight: 600 }}>{LOG_LABELS[entry.kind]}</span>{' '}
            {entry.text}
          </div>
        ))}
      </div>
    </section>
  );
};
