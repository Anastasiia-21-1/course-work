import { trpc } from '@/lib/trpc';

export function useUsers() {
  return trpc.user.getAll.useQuery();
}

export function useUser(id: string) {
  return trpc.user.getById.useQuery({ id });
}

export function useCreateUser() {
  const utils = trpc.useUtils();
  return trpc.user.create.useMutation({
    onSuccess: () => {
      utils.user.getAll.invalidate();
    },
  });
}

export function useUpdateUser() {
  const utils = trpc.useUtils();
  return trpc.user.update.useMutation({
    onSuccess: () => {
      utils.user.getAll.invalidate();
    },
  });
}

export function useDeleteUser() {
  const utils = trpc.useUtils();
  return trpc.user.delete.useMutation({
    onSuccess: () => {
      utils.user.getAll.invalidate();
    },
  });
}

export function useLosts(params?: { userId?: string; includeUser?: boolean }) {
  if (params?.userId) {
    return trpc.lost.getByUserId.useQuery({ userId: params.userId });
  }
  return trpc.lost.getAll.useQuery();
}

export function usePagedLosts(input?: {
  page?: number;
  limit?: number;
  q?: string;
  userId?: string;
  cityId?: number;
  categoryId?: number;
  sortBy?: 'id' | 'title' | 'time' | 'location';
  sortOrder?: 'asc' | 'desc';
}) {
  return trpc.lost.getPaged.useQuery(input);
}

export function useLost(id: string) {
  return trpc.lost.getById.useQuery({ id });
}

export function useCreateLost() {
  const utils = trpc.useUtils();
  return trpc.lost.create.useMutation({
    onSuccess: () => {
      utils.lost.getAll.invalidate();
    },
  });
}

export function useUpdateLost() {
  const utils = trpc.useUtils();
  return trpc.lost.update.useMutation({
    onSuccess: () => {
      utils.lost.getAll.invalidate();
    },
  });
}

export function useDeleteLost() {
  const utils = trpc.useUtils();
  return trpc.lost.delete.useMutation({
    onSuccess: () => {
      utils.lost.getAll.invalidate();
    },
  });
}

export function useFinds(params?: { userId?: string; includeUser?: boolean }) {
  if (params?.userId) {
    return trpc.find.getByUserId.useQuery({ userId: params.userId });
  }
  return trpc.find.getAll.useQuery();
}

export function usePagedFinds(input?: {
  page?: number;
  limit?: number;
  q?: string;
  userId?: string;
  cityId?: number;
  categoryId?: number;
  sortBy?: 'id' | 'title' | 'time' | 'location';
  sortOrder?: 'asc' | 'desc';
}) {
  return trpc.find.getPaged.useQuery(input);
}

export function useFind(id: string) {
  return trpc.find.getById.useQuery({ id });
}

export function useCreateFind() {
  const utils = trpc.useUtils();
  return trpc.find.create.useMutation({
    onSuccess: () => {
      utils.find.getAll.invalidate();
    },
  });
}

export function useUpdateFind() {
  const utils = trpc.useUtils();
  return trpc.find.update.useMutation({
    onSuccess: () => {
      utils.find.getAll.invalidate();
    },
  });
}

export function useDeleteFind() {
  const utils = trpc.useUtils();
  return trpc.find.delete.useMutation({
    onSuccess: () => {
      utils.find.getAll.invalidate();
    },
  });
}

export function useCategories() {
  return trpc.category.getAll.useQuery();
}

export function useCreateCategory() {
  const utils = trpc.useUtils();
  return trpc.category.create.useMutation({
    onSuccess: () => {
      utils.category.getAll.invalidate();
    },
  });
}

export function useUpdateCategory() {
  const utils = trpc.useUtils();
  return trpc.category.update.useMutation({
    onSuccess: () => {
      utils.category.getAll.invalidate();
    },
  });
}

export function useDeleteCategory() {
  const utils = trpc.useUtils();
  return trpc.category.delete.useMutation({
    onSuccess: () => {
      utils.category.getAll.invalidate();
    },
  });
}

export function useCities() {
  return trpc.city.getAll.useQuery();
}

export function useCreateCity() {
  const utils = trpc.useUtils();
  return trpc.city.create.useMutation({
    onSuccess: () => {
      utils.city.getAll.invalidate();
    },
  });
}

export function useUpdateCity() {
  const utils = trpc.useUtils();
  return trpc.city.update.useMutation({
    onSuccess: () => {
      utils.city.getAll.invalidate();
    },
  });
}

export function useDeleteCity() {
  const utils = trpc.useUtils();
  return trpc.city.delete.useMutation({
    onSuccess: () => {
      utils.city.getAll.invalidate();
    },
  });
}
