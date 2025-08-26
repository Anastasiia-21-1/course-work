'use client';
import { Suspense } from 'react';
import { useGetFindsPaged } from '@/api/finds';
import { useCategories, useCities } from '@/hooks/useTRPC';
import { Loading } from '@/components/layout/Loading';
import { FindCard } from '@/components/find/FindCard';
import { AppContainer } from '@/components/layout/AppContainer';
import { ItemsContainer } from '@/components/layout/ItemsContainer';
import { usePagedListParams } from '@/hooks/useQueryParams';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export default function FindPage() {
  return (
    <Suspense fallback={<Loading />}>
      <FindPageInner />
    </Suspense>
  );
}

function FindPageInner() {
  const { params, setParams, isPending } = usePagedListParams();
  const { page, limit, q, cityId, categoryId, sortBy, sortOrder } = params;

  const { data: cities } = useCities();
  const { data: categories } = useCategories();

  const { data, isLoading, error } = useGetFindsPaged(params);

  function updateParams(next: Partial<typeof params>, resetPage = true) {
    setParams(next, { resetPage, replace: true });
  }

  const [search, setSearch] = useState(q ?? '');
  useEffect(() => {
    setSearch(q ?? '');
  }, [q]);
  const debouncedSearch = useDebounce(search, 1_000);
  useEffect(() => {
    const current = q ?? '';
    if (debouncedSearch !== current) {
      updateParams({ q: debouncedSearch || undefined }, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <AppContainer title="Всі знахідки">
        <div>Error: {error?.message}</div>
      </AppContainer>
    );
  }

  return (
    <AppContainer title="Всі знахідки">
      <div className="mb-4 flex flex-wrap items-end gap-2">
        <input
          type="text"
          placeholder="Пошук..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={cityId ?? ''}
          onChange={(e) =>
            updateParams({ cityId: e.target.value ? Number(e.target.value) : undefined })
          }
          className="border rounded px-3 py-2"
        >
          <option value="">Місто: всі</option>
          {cities?.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={categoryId ?? ''}
          onChange={(e) =>
            updateParams({ categoryId: e.target.value ? Number(e.target.value) : undefined })
          }
          className="border rounded px-3 py-2"
        >
          <option value="">Категорія: всі</option>
          {categories?.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => updateParams({ sortBy: e.target.value as any })}
          className="border rounded px-3 py-2"
        >
          <option value="id">Сортувати за: ID</option>
          <option value="title">Назва</option>
          <option value="time">Час</option>
          <option value="location">Локація</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => updateParams({ sortOrder: e.target.value as any }, false)}
          className="border rounded px-3 py-2"
        >
          <option value="desc">Зменшення</option>
          <option value="asc">Зростання</option>
        </select>
        <select
          value={limit}
          onChange={(e) => updateParams({ limit: Number(e.target.value) })}
          className="border rounded px-3 py-2"
        >
          {[6, 12, 24, 48].map((n) => (
            <option key={n} value={n}>
              {n} на стор.
            </option>
          ))}
        </select>
        {isPending && <span className="text-sm text-gray-500">Оновлення...</span>}
      </div>

      <ItemsContainer>
        {data?.items?.map((el: any) => {
          return <FindCard key={el.id} {...el} />;
        })}
      </ItemsContainer>

      <div className="mt-6 flex items-center justify-between">
        <button
          className="border rounded px-4 py-2 disabled:opacity-50"
          onClick={() => updateParams({ page: Math.max(1, page - 1) }, false)}
          disabled={!data?.hasPrev}
        >
          Назад
        </button>
        <div className="text-sm text-gray-600">
          Сторінка {data?.page} з {data?.totalPages} • Всього: {data?.total}
        </div>
        <button
          className="border rounded px-4 py-2 disabled:opacity-50"
          onClick={() => updateParams({ page: page + 1 }, false)}
          disabled={!data?.hasNext}
        >
          Далі
        </button>
      </div>
    </AppContainer>
  );
}
