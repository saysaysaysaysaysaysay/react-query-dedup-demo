import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from './api/user-service';
import { userKeys, userQueries } from './api/user-queries';

type Variables = {
  id: string;
  name: string;
  simulateError?: boolean;
};

const failAfterDelay = async (): Promise<never> => {
  await new Promise((res) => setTimeout(res, 2000));
  throw new Error('Сервер вернул ошибку, изменения откачены');
};

export function useRenameUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name, simulateError }: Variables) =>
      simulateError ? failAfterDelay() : userService.updateUser({ id, name }),

    onMutate: async ({ id, name }) => {
      const userKey = userQueries.detail(id).queryKey;
      const listKey = userQueries.list().queryKey;

      await queryClient.cancelQueries({ queryKey: userKeys.all });

      const previousUser = queryClient.getQueryData(userKey);
      const previousList = queryClient.getQueryData(listKey);

      queryClient.setQueryData(userKey, (old) => old && { ...old, name });
      queryClient.setQueryData(listKey, (old) =>
        old?.map((user) => (user.id === id ? { ...user, name } : user)),
      );

      return { previousUser, previousList };
    },

    onError: (_error, { id }, snapshot) => {
      queryClient.setQueryData(userQueries.detail(id).queryKey, snapshot?.previousUser);
      queryClient.setQueryData(userQueries.list().queryKey, snapshot?.previousList);
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}
