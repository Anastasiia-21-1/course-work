import {useCreateFind, useDeleteFind, useFind, useFinds, usePagedFinds, useUpdateFind} from '@/hooks/useTRPC';

export function useGetFinds(params?: { userId?: string; includeUser?: boolean }) {
  return useFinds(params);
}

export function useGetFindsPaged(input?: {
  page?: number;
  limit?: number;
  q?: string;
  userId?: string;
  cityId?: number;
  categoryId?: number;
  sortBy?: 'id' | 'title' | 'time' | 'location';
  sortOrder?: 'asc' | 'desc';
}) {
  return usePagedFinds(input);
}

export function useGetFindsByUser(userId: string) {
  return useFinds({ userId, includeUser: true });
}

export function useGetFindById(id: string) {
  return useFind(id);
}

export function useInsertFind() {
  return useCreateFind();
}

export function useCreateFindMutation() {
  return useCreateFind();
}

export function useUpdateFindMutation() {
  return useUpdateFind();
}

export function useDeleteFindMutation() {
  return useDeleteFind();
}
