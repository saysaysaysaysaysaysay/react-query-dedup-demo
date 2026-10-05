import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental';
import { App } from '@app/App';
import { DEFAULT_DEMO_CONFIG } from '@widgets/query-demo/config';

const queryClient = new QueryClient({
  defaultOptions: { queries: DEFAULT_DEMO_CONFIG },
});

broadcastQueryClient({
  queryClient,
  broadcastChannel: 'react-query-dedup-demo',
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
