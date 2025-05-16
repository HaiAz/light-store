import { useMutation, useQueryClient } from '@tanstack/react-query';

import { usersQueryKey } from '@/hooks/api';
import { apiClient } from '@/lib/request';
import { User, UserEditForm, UserForm } from '@/schemas/user';

function useUserMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userForm: UserForm | UserEditForm) => {
      return apiClient.post<User>('/api/users', userForm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ usersQueryKey ] });
    },
  });

  return mutation;
}

export { useUserMutation };
