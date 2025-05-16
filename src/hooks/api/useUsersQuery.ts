import { useQuery } from '@tanstack/react-query';

import { getQueries } from '@/lib/common';
import { apiClient } from '@/lib/request';
import { UserWithoutPassword } from '@/schemas/user';
import { ResponseWithPagination } from '@/types/common';

const usersQueryKey = 'users';

function useUsersQuery(queries: { page: number; limit: number }) {
  return useQuery({
    queryKey: [ usersQueryKey, queries ],
    queryFn: async () => {
      return apiClient.get<ResponseWithPagination<UserWithoutPassword[]>>(`/api/users${getQueries(queries)}`);
    },
  });
}

export { useUsersQuery, usersQueryKey };
