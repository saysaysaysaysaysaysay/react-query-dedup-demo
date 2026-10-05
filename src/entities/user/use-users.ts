import { useQuery } from '@tanstack/react-query';
import { userQueries } from './api/user-queries';

export function useUsers() {
  return useQuery(userQueries.list());
}
