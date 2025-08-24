import {
    useLosts,
    useLost,
    useCreateLost,
    useUpdateLost,
    useDeleteLost, usePagedLosts
} from '@/hooks/useTRPC';

export function useGetLosts(params?: { userId?: string; includeUser?: boolean }) {
  return useLosts(params);
}

export function useGetLostsPaged(input?: {
  page?: number;
  limit?: number;
  q?: string;
  userId?: string;
  cityId?: number;
  categoryId?: number;
  sortBy?: 'id' | 'title' | 'time' | 'location';
  sortOrder?: 'asc' | 'desc';
}) {
  return usePagedLosts(input);
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
