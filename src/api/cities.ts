import {
  useCities,
  useCreateCity,
  useUpdateCity,
  useDeleteCity
} from '@/hooks/useTRPC';

export function useGetCities() {
  return useCities();
}

export function useCreateCityMutation() {
  return useCreateCity();
}

export function useUpdateCityMutation() {
  return useUpdateCity();
}

export function useDeleteCityMutation() {
  return useDeleteCity();
}
