"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { PublicSchool } from "../types";
import schoolsJson from "../schools.json";

export function usePublicSchools(search: string = "", jenjang: string = "") {
  const url = useUrlStore((state) => state.URL.APP);

  return useQuery({
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams({
          limit: "100",
          search,
          ...(jenjang ? { jenjang } : {}),
        });
        const res = await fetchData<{ total: number; data: any[] }>(
          `${url}/api/v1/admin/master/sekolah/read?${queryParams.toString()}`
        );
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: PublicSchool[] = res.data.map((item) => ({
            id: item.id,
            name: item.nama_sekolah || item.nama || item.title || "Satuan Pendidikan",
            npsn: item.npsn || "-",
            level: item.jenjang || "SD",
            status: item.status_sekolah || item.status || "NEGERI",
            district: item.kecamatan || "Konawe Selatan",
            address: item.alamat || "-",
            principal: item.kepala_sekolah || "-",
            accreditation: item.akreditasi || "B",
            studentsCount: item.jumlah_siswa || 0,
            teachersCount: item.jumlah_guru || 0,
          }));
          return mapped;
        }
      } catch (e) {
        console.warn("[usePublicSchools] Fallback to local schools.json:", e);
      }
      return ((schoolsJson.schools as unknown) as PublicSchool[]) || [];
    },
    queryKey: ["public-schools", search, jenjang],
  });
}
