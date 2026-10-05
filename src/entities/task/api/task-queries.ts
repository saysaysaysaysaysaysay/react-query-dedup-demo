import { queryOptions, skipToken } from '@tanstack/react-query';
import { taskService } from './task-service';

export const taskKeys = {
  all: ['tasks'] as const,
  detail: (id: string | undefined) => [...taskKeys.all, 'detail', id] as const,
};

export const taskQueries = {
  detail: (id: string | undefined) =>
    queryOptions({
      queryKey: taskKeys.detail(id),
      queryFn: id ? () => taskService.getTask(id) : skipToken,
      refetchInterval: (query) => (query.state.data?.status === 'done' ? false : 1000),
    }),
};
