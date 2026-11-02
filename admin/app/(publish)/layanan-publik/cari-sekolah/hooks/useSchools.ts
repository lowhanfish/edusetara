"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import type { SchoolItem } from "../components/school-directory";

type MasterSchool = {
  id: string; npsn: string | null; nama_sekolah: string; bentuk_pendidikan: string;
  status_sekolah: string; kecamatan: string | null; desa_kelurahan: string | null; alamat_jalan: string | null;
};
export function usePublicSchools() {
  const url = useUrlStore((state) => state.URL.APP);
  return useQuery({
    queryKey: ["public-schools", url],
    queryFn: async (): Promise<SchoolItem[]> => {
      const records: MasterSchool[] = [];
      let total = 0;
      do {
        const res = await fetchData<{ total: number; data: MasterSchool[] }>(
          `${url}/api/v1/publish/sekolah?skip=${records.length}&limit=500`,
        );
        total = res.total;
        if (!Array.isArray(res.data) || (!res.data.length && records.length < total)) {
          throw new Error("Data direktori sekolah tidak lengkap");
        }
        records.push(...res.data);
      } while (records.length < total);
      return records.map((item) => ({
        id: item.id, npsn: item.npsn || "", name: item.nama_sekolah.replace(/[\u200b\u200c]/g, "").trim(),
        address: item.alamat_jalan || "", village: item.desa_kelurahan || "",
        district: item.kecamatan || "", level: item.bentuk_pendidikan || "",
        status: item.status_sekolah || "",
        url: item.npsn ? `https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/${encodeURIComponent(item.npsn)}` : "",
      }));
    },
  });
}
