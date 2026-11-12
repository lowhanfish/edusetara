"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import type { SekolahRecord } from "../master/sekolah/types";
import type { Asset, AssetDetail, AssetList, Choice } from "./types";

export function useInventory(filters: { page: number; schoolId: string; subUnitId: string; search: string; kib: string; year: string; condition: string }) {
  const base = useUrlStore((s) => s.URL.APP);
  const params = new URLSearchParams({ skip: String((filters.page - 1) * 10), limit: "10" });
  if (filters.schoolId) params.set("sekolah_id", filters.schoolId);
  if (filters.subUnitId) params.set("sub_unit_id", filters.subUnitId);
  if (filters.search) params.set("search", filters.search);
  if (filters.kib) params.set("kib", filters.kib);
  if (filters.year) params.set("tahun_perolehan", filters.year);
  if (filters.condition) params.set("kondisi_kode", filters.condition);
  return useQuery({ queryKey: ["inventaris-aset", "list", filters], queryFn: () => fetchData<AssetList>(`${base}/api/v1/admin/inventaris-aset?${params}`) });
}
export function useInventorySchool(id: string) {
  const base = useUrlStore((s) => s.URL.APP);
  return useQuery({ queryKey: ["master-sekolah", "detail", id], queryFn: () => fetchData<SekolahRecord>(`${base}/api/v1/admin/master/sekolah/${encodeURIComponent(id)}`), enabled: Boolean(id) });
}
export function useInventoryDetail(id: string) {
  const base = useUrlStore((s) => s.URL.APP);
  return useQuery({ queryKey: ["inventaris-aset", "detail", id], queryFn: () => fetchData<AssetDetail>(`${base}/api/v1/admin/inventaris-aset/${id}`), enabled: Boolean(id) });
}
export function useInventoryOptions() {
  const base = useUrlStore((s) => s.URL.APP);
  const conditions = useQuery({ queryKey: ["master-aset", "kondisi-barang", "option"], queryFn: () => fetchData<Choice[]>(`${base}/api/v1/admin/master/master_aset/kondisi-barang/option`) });
  const sources = useQuery({ queryKey: ["inventaris-sumber-dana"], queryFn: () => fetchData<{ id: string; uraian: string }[]>(`${base}/api/v1/admin/master/sarpras/sumber-dana/option`) });
  return { conditions, sources };
}
export function useCreateInventory() {
  const base = useUrlStore((s) => s.URL.APP);
  const cache = useQueryClient();
  return useMutation({ mutationFn: (body: Record<string, unknown>) => fetchData<Asset>(`${base}/api/v1/admin/inventaris-aset`, { method: "POST", body }), onSuccess: () => cache.invalidateQueries({ queryKey: ["inventaris-aset"] }) });
}
export function useCorrectInventory(id: string) {
  const base = useUrlStore((s) => s.URL.APP);
  const cache = useQueryClient();
  return useMutation({ mutationFn: (body: Record<string, unknown>) => fetchData<AssetDetail>(`${base}/api/v1/admin/inventaris-aset/${id}`, { method: "PUT", body }), onSuccess: () => cache.invalidateQueries({ queryKey: ["inventaris-aset"] }) });
}
export function usePlaceInventory(id: string) {
  const base = useUrlStore((s) => s.URL.APP);
  const cache = useQueryClient();
  return useMutation({ mutationFn: (upbId: string | null) => fetchData<AssetDetail>(`${base}/api/v1/admin/inventaris-aset/${id}/penempatan`, { method: "PUT", body: { upb_id: upbId } }), onSuccess: () => cache.invalidateQueries({ queryKey: ["inventaris-aset"] }) });
}
export function useUpdateCondition(id: string) {
  const base = useUrlStore((s) => s.URL.APP);
  const cache = useQueryClient();
  return useMutation({ mutationFn: (body: FormData) => fetchData<AssetDetail>(`${base}/api/v1/admin/inventaris-aset/${id}/kondisi`, { method: "POST", body }), onSuccess: () => cache.invalidateQueries({ queryKey: ["inventaris-aset"] }) });
}

export function useInventorySubUnits() {
  const base = useUrlStore((s) => s.URL.APP);
  return useQuery({
    queryKey: ["master-aset", "unit-sekolah", "inventaris-sub-units"],
    queryFn: () => fetchData<Choice[]>(`${base}/api/v1/admin/inventaris-aset/pilihan-sub-unit`),
  });
}
export function useInventoryYears() {
  const base = useUrlStore((s) => s.URL.APP);
  return useQuery({
    queryKey: ["inventaris-aset", "pilihan-tahun"],
    queryFn: () => fetchData<Choice[]>(`${base}/api/v1/admin/inventaris-aset/pilihan-tahun`),
  });
}
