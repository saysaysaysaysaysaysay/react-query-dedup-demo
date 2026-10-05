import { useQuery } from '@tanstack/react-query';
import { userQueries } from './api/user-queries';

export function useUser(userId: string | undefined) {
  return useQuery(userQueries.detail(userId));
}
