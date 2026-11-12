"use client";

import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DesaKelurahanOption,
  KecamatanOption,
  SekolahListResponse,
  SekolahRecord,
  SekolahUpdatePayload,
} from "../types";
import { swallAlert, showLoadingAlert } from "@/lib/show_swall";

export const useResponseListSekolah = ({
  page = 1,
  pageSize = 10,
  search = "",
  jenjang = "",
  statusSekolah = "",
  kecamatan = "",
  kecamatanId = null,
}: {
  page: number;
  pageSize: number;
  search?: string;
  jenjang?: string;
  statusSekolah?: string;
  kecamatan?: string;
  kecamatanId?: number | null;
}) => {
  const url = useUrlStore((state) => state.URL.APP);

  const queryParams = new URLSearchParams();
  queryParams.set("skip", String((page - 1) * pageSize));
  queryParams.set("limit", String(pageSize));
  if (search) queryParams.set("search", search);
  if (jenjang && jenjang !== "Semua") queryParams.set("jenjang", jenjang);
  if (statusSekolah && statusSekolah !== "Semua") queryParams.set("status_sekolah", statusSekolah);
  if (kecamatanId) {
    queryParams.set("kecamatan_id", String(kecamatanId));
  } else if (kecamatan && kecamatan !== "Semua") {
    queryParams.set("kecamatan", kecamatan);
  }

  const { data: List, isLoading, isError, error, refetch } = useQuery({
    queryFn: () =>
      fetchData<SekolahListResponse>(
        `${url}/api/v1/admin/master/sekolah?${queryParams.toString()}`
      ),
    queryKey: [
      "master-sekolah",
      page,
      pageSize,
      search,
      jenjang,
      statusSekolah,
      kecamatan,
      kecamatanId,
    ],
  });

  return { List, isLoading, isError, error, refetch };
};

export const useUpdateSekolah = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: SekolahUpdatePayload }) =>
      fetchData<SekolahRecord>(`${url}/api/v1/admin/master/sekolah/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-sekolah"] });
      queryClient.invalidateQueries({ queryKey: ["master-aset", "unit-sekolah"] });
      swallAlert("Profil sekolah berhasil diperbarui", "success");
    },
    onError: (err: any) => {
      swallAlert(`Gagal memperbarui data: ${err?.message || err}`, "error");
    },
  });

  if (updateMutation.isPending) {
    showLoadingAlert();
  }

  return updateMutation;
};

export const useSyncSekolah = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: () =>
      fetchData<{ success: boolean; message: string }>(
        `${url}/api/v1/admin/master/sekolah/sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["master-sekolah"] });
      swallAlert(data?.message || "Sinkronisasi dari SIMPEG berhasil", "success");
    },
    onError: (err: any) => {
      swallAlert(`Gagal sinkronisasi SIMPEG: ${err?.message || err}`, "error");
    },
  });

  if (syncMutation.isPending) {
    showLoadingAlert();
  }

  return syncMutation;
};

export const useKecamatanList = () => {
  const url = useUrlStore((state) => state.URL.APP);

  const { data: kecamatanList = [], isLoading, isError } = useQuery<KecamatanOption[]>({
    queryKey: ["master-wilayah-kecamatan"],
    queryFn: () => fetchData<KecamatanOption[]>(`${url}/api/v1/admin/master/wilayah/kecamatan`),
    staleTime: 1000 * 60 * 30,
  });

  return { kecamatanList, isLoading, isError };
};

export const useDesaKelurahanList = (kecamatanId?: number | null) => {
  const url = useUrlStore((state) => state.URL.APP);

  const { data: desaList = [], isLoading, isError } = useQuery<DesaKelurahanOption[]>({
    queryKey: ["master-wilayah-desa", kecamatanId],
    queryFn: () => {
      const endpoint = kecamatanId
        ? `${url}/api/v1/admin/master/wilayah/desa-kelurahan?kecamatan_id=${kecamatanId}`
        : `${url}/api/v1/admin/master/wilayah/desa-kelurahan`;
      return fetchData<DesaKelurahanOption[]>(endpoint);
    },
    enabled: Boolean(kecamatanId),
    staleTime: 1000 * 60 * 30,
  });

  return { desaList, isLoading, isError };
};
