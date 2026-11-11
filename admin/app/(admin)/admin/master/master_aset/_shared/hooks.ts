"use client";

import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { swallAlert, showLoadingAlert } from "@/lib/show_swall";
import type { ListOptionSchema } from "@/types/global";
import type { MasterAsetListResponse, MasterAsetRecord } from "./types";

const endpoint = (url: string, slug: string) =>
  `${url}/api/v1/admin/master/master_aset/${slug}`;

const queryKey = (slug: string) => ["master-aset", slug] as const;

const JSON_HEADERS = { "Content-Type": "application/json" };

export const useMasterAsetList = (
  slug: string,
  page: number,
  limit: number,
  search: string,
  filters: Record<string, string>
) => {
  const url = useUrlStore((state) => state.URL.APP);
  const params = new URLSearchParams({
    skip: String((page - 1) * limit),
    limit: String(limit),
    search,
  });
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: () =>
      fetchData<MasterAsetListResponse>(`${endpoint(url, slug)}/read?${params.toString()}`),
    queryKey: [...queryKey(slug), page, limit, search, filters],
  });

  return { List: data, isLoading, isError, error, refetch };
};

/** Pilihan untuk dropdown. `id` adalah kode bisnis master tersebut, `value` labelnya. */
export const useMasterAsetOption = (slug: string, search: string = "") => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data, isLoading, isError } = useQuery({
    queryFn: () =>
      fetchData<ListOptionSchema>(
        `${endpoint(url, slug)}/option?search=${encodeURIComponent(search)}`
      ),
    queryKey: [...queryKey(slug), "option", search],
  });

  return { List: (data ?? []) as ListOptionSchema, isLoading, isError };
};

/** Pencarian ke endpoint lain (mis. Master Sekolah) untuk field "lookup". */
export const useLookupSearch = (path: string, search: string, enabled: boolean) => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data, isLoading, isError } = useQuery({
    queryFn: () =>
      fetchData<Record<string, unknown>[]>(`${url}${path}?search=${encodeURIComponent(search)}`),
    queryKey: ["master-aset-lookup", path, search],
    enabled,
  });

  return { items: Array.isArray(data) ? data : [], isLoading, isError };
};

export const useDeleteMasterAset = (slug: string) => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      fetchData(`${endpoint(url, slug)}/delete/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(slug) });
      swallAlert("sukses dihapus", "success");
    },
    onError: (err: unknown) => {
      swallAlert(`gagal dihapus: ${err instanceof Error ? err.message : String(err)}`, "error");
    },
  });

  if (mutation.isPending) {
    showLoadingAlert();
  }
  return mutation;
};

export const useCreateMasterAset = (slug: string) => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<MasterAsetRecord>) =>
      fetchData(`${endpoint(url, slug)}/create`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(slug) });
      swallAlert("sukses ditambahkan", "success");
    },
    onError: (err: unknown) => {
      swallAlert(`gagal ditambahkan : ${err instanceof Error ? err.message : String(err)}`, "error");
    },
  });
};

export const useUpdateMasterAset = (slug: string) => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, id }: { body: Partial<MasterAsetRecord>; id: string }) =>
      fetchData(`${endpoint(url, slug)}/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: JSON_HEADERS,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(slug) });
      swallAlert("sukses diubah", "success");
    },
    onError: (err: unknown) => {
      swallAlert(`gagal diubah : ${err instanceof Error ? err.message : String(err)}`, "error");
    },
  });
};
