import {
  useLosts,
  useLost,
  useCreateLost,
  useUpdateLost,
  useDeleteLost
} from '../hooks/useTRPC';

export function useGetLosts(params?: { userId?: string; includeUser?: boolean }) {
  return useLosts(params);
}

export function useGetLostsByUser(userId: string) {
  return useLosts({ userId, includeUser: true });
}

export function useGetLostById(id: string) {
  return useLost(id);
}

export function useInsertLost() {
  return useCreateLost();
}

export function useCreateLostMutation() {
  return useCreateLost();
}

export function useUpdateLostMutation() {
  return useUpdateLost();
}

export function useDeleteLostMutation() {
  return useDeleteLost();
}
