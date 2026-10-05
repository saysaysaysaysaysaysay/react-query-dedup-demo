import { useMutation, useQuery } from '@tanstack/react-query';
import { taskService } from './api/task-service';
import { taskQueries } from './api/task-queries';

export function useTask(taskId: string | undefined) {
  return useQuery(taskQueries.detail(taskId));
}

export function useStartTask() {
  return useMutation({ mutationFn: taskService.startTask });
}
