import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, type User } from './api/user-service';
import { userKeys, userQueries } from './api/user-queries';

type Options = {
  onSuccess?: (user: User) => void;
};

export function useCreateUser({ onSuccess }: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: (user) => {
      queryClient.setQueryData(userQueries.detail(user.id).queryKey, user);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      onSuccess?.(user);
    },
  });
}
