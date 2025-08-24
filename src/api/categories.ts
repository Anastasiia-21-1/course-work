import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory
} from '../hooks/useTRPC';

export function useGetCategories() {
  return useCategories();
}

export function useCreateCategoryMutation() {
  return useCreateCategory();
}

export function useUpdateCategoryMutation() {
  return useUpdateCategory();
}

export function useDeleteCategoryMutation() {
  return useDeleteCategory();
}
