export type StaleTimeValue = number | 'static';

export type DemoConfig = {
  staleTime: StaleTimeValue;
  gcTime: number;
  refetchOnWindowFocus: boolean;
};

export const DEFAULT_DEMO_CONFIG: DemoConfig = {
  staleTime: 0,
  gcTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
};

export const STALE_TIME_OPTIONS: StaleTimeValue[] = [0, 5_000, 15_000, Infinity, 'static'];
export const GC_TIME_OPTIONS = [0, 5_000, 15_000, 5 * 60 * 1000];

export const formatMs = (ms: StaleTimeValue) => {
  if (ms === 'static') return 'static';
  if (ms === Infinity) return '∞';
  if (ms === 0) return '0';
  if (ms < 60_000) return `${ms / 1000} с`;
  return `${ms / 60_000} мин`;
};

export const formatMsAsCode = (ms: StaleTimeValue) => {
  if (ms === 'static') return `'static'`;
  if (ms === Infinity) return 'Infinity';
  if (ms === 0) return '0';
  if (ms % 60_000 === 0) return `${ms / 60_000} * 60 * 1000`;
  return `${ms / 1000}_000`;
};

export const formatSeconds = (ms: number) => `${(Math.max(ms, 0) / 1000).toFixed(1)} с`;
