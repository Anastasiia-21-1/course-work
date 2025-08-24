"use client";
import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type SortBy = "id" | "title" | "time" | "location";
export type SortOrder = "asc" | "desc";

export interface PagedListParams {
  page: number;
  limit: number;
  q?: string;
  cityId?: number;
  categoryId?: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export interface SetParamsOptions {
  resetPage?: boolean;
  replace?: boolean;
}

const DEFAULTS: PagedListParams = {
  page: 1,
  limit: 12,
  sortBy: "id",
  sortOrder: "desc",
};

function parseNumber(value: string | null, fallback?: number): number | undefined {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseEnum<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  if (value && (allowed as readonly string[]).includes(value)) return value as T;
  return fallback;
}

export function usePagedListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const params: PagedListParams = useMemo(() => {
    const page = parseInt(searchParams.get("page") || String(DEFAULTS.page), 10) || DEFAULTS.page;
    const limit = parseInt(searchParams.get("limit") || String(DEFAULTS.limit), 10) || DEFAULTS.limit;
    const q = searchParams.get("q") || undefined;
    const cityId = searchParams.get("cityId") ? Number(searchParams.get("cityId")) : undefined;
    const categoryId = searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined;
    const sortBy = parseEnum<SortBy>(searchParams.get("sortBy"), ["id", "title", "time", "location"], DEFAULTS.sortBy);
    const sortOrder = parseEnum<SortOrder>(searchParams.get("sortOrder"), ["asc", "desc"], DEFAULTS.sortOrder);

    return { page, limit, q, cityId, categoryId, sortBy, sortOrder };
  }, [searchParams]);

  function setParams(next: Partial<PagedListParams>, options?: SetParamsOptions) {
    const { resetPage = true, replace = true } = options ?? {};

    const sp = new URLSearchParams();
    const merged: PagedListParams = { ...DEFAULTS, ...params, ...next };

    const entries: [keyof PagedListParams, any][] = [
      ["page", merged.page],
      ["limit", merged.limit],
      ["q", merged.q],
      ["cityId", merged.cityId],
      ["categoryId", merged.categoryId],
      ["sortBy", merged.sortBy],
      ["sortOrder", merged.sortOrder],
    ];

    for (const [k, v] of entries) {
      if (v === undefined || v === null || v === "") continue;
      sp.set(String(k), String(v));
    }

    if (resetPage) sp.set("page", "1");

    const url = `${pathname}?${sp.toString()}`;

    startTransition(() => {
      if (replace) router.replace(url);
      else router.push(url);
    });
  }

  return { params, setParams, isPending } as const;
}
