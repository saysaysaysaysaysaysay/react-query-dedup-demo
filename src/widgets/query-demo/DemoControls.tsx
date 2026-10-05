import type { CSSProperties, ReactNode } from 'react';
import {
  type DemoConfig,
  type StaleTimeValue,
  GC_TIME_OPTIONS,
  STALE_TIME_OPTIONS,
  formatMs,
  formatMsAsCode,
} from './config';

const button: CSSProperties = {
  padding: '6px 12px',
  border: '1px solid #d0d7de',
  borderRadius: 6,
  background: '#f6f8fa',
  color: '#1f2328',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: 14,
};

const activeButton: CSSProperties = {
  ...button,
  background: '#1f6feb',
  borderColor: '#1f6feb',
  color: '#fff',
};

const Segmented = <T extends StaleTimeValue>({
  label,
  options,
  value,
  onChange,
}: {
  label: ReactNode;
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 13, color: '#57606a', marginBottom: 4 }}>{label}</div>
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {options.map((option) => (
        <button
          key={option}
          style={option === value ? activeButton : button}
          onClick={() => onChange(option)}
        >
          {formatMs(option)}
        </button>
      ))}
    </div>
  </div>
);

type Props = {
  config: DemoConfig;
  onConfigChange: (next: DemoConfig) => void;
  showHeader: boolean;
  showProfile: boolean;
  onToggleHeader: () => void;
  onToggleProfile: () => void;
  onInvalidate: () => void;
};

export const DemoControls = ({
  config,
  onConfigChange,
  showHeader,
  showProfile,
  onToggleHeader,
  onToggleProfile,
  onInvalidate,
}: Props) => (
  <section>
    <Segmented
      label={<code>staleTime</code>}
      options={STALE_TIME_OPTIONS}
      value={config.staleTime}
      onChange={(staleTime) => onConfigChange({ ...config, staleTime })}
    />
    <Segmented
      label={<code>gcTime</code>}
      options={GC_TIME_OPTIONS}
      value={config.gcTime}
      onChange={(gcTime) => onConfigChange({ ...config, gcTime })}
    />
    <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 14, marginBottom: 16 }}>
      <input
        type="checkbox"
        checked={config.refetchOnWindowFocus}
        onChange={(e) => onConfigChange({ ...config, refetchOnWindowFocus: e.target.checked })}
      />
      <code>refetchOnWindowFocus</code>
    </label>

    <pre
      style={{
        background: '#0d1117',
        color: '#e6edf3',
        padding: 12,
        borderRadius: 8,
        fontSize: 13,
        lineHeight: 1.5,
        overflowX: 'auto',
        margin: '0 0 16px',
      }}
    >
      {`useQuery({
  queryKey: ['users', 'detail', '1'],
  queryFn: fetchUser,
  staleTime: ${formatMsAsCode(config.staleTime)},
  gcTime: ${formatMsAsCode(config.gcTime)},
})`}
    </pre>

    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button style={showHeader ? activeButton : button} onClick={onToggleHeader}>
        Header {showHeader ? 'смонтирован' : 'размонтирован'}
      </button>
      <button style={showProfile ? activeButton : button} onClick={onToggleProfile}>
        Profile {showProfile ? 'смонтирован' : 'размонтирован'}
      </button>
      <button style={button} onClick={onInvalidate}>
        invalidateQueries
      </button>
    </div>
  </section>
);
