import { queryOptions, skipToken } from '@tanstack/react-query';
import { userService } from './user-service';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string | undefined) => [...userKeys.details(), id] as const,
};

export const userQueries = {
  list: () =>
    queryOptions({
      queryKey: userKeys.lists(),
      queryFn: userService.findUsers,
    }),

  detail: (id: string | undefined) =>
    queryOptions({
      queryKey: userKeys.detail(id),
      queryFn: id ? () => userService.findUser({ id }) : skipToken,
    }),
};
