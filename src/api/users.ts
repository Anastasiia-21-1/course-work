import {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser
} from '../hooks/useTRPC';

export function useGetUsers() {
  return useUsers();
}

export function useGetUserById(id: string) {
  return useUser(id);
}

export function useCreateUserMutation() {
  return useCreateUser();
}

export function useUpdateUserMutation() {
  return useUpdateUser();
}

export function useDeleteUserMutation() {
  return useDeleteUser();
}
