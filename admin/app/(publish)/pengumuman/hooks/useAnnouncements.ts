"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { AnnouncementItem, BackendAnnouncementItem } from "../types";

export function usePublicAnnouncements() {
  const url = useUrlStore((state) => state.URL.APP);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () => {
        const res = await fetchData<{ total: number; data: BackendAnnouncementItem[] }>(
          `${url}/api/v1/publish/pengumuman?limit=50`
        );
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: AnnouncementItem[] = res.data.map((item, idx) => {
            const dateStr = item.tanggal || item.created_at || "2026-11-01";
            const dateObj = new Date(dateStr);
            const day = String(dateObj.getDate()).padStart(2, "0");
            const months = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
            const month = months[dateObj.getMonth()] || "NOV";
            const year = String(dateObj.getFullYear() || 2026);

            const fileFullUrl = item.file?.startsWith("/uploads")
              ? `${url}${item.file}`
              : (item.file || undefined);

            return {
              id: item.id || `announcement-${idx}`,
              number: item.nomor || `421.2/${100 + idx}/Dikbud/${month}/${year}`,
              day,
              month,
              year,
              category: item.kategori || "Akademik & ANBK",
              title: item.judul || "Pengumuman Resmi Dinas",
              summary: item.ringkasan || item.isi || item.judul || "",
              attachmentName: item.file ? item.file.split("/").pop() || "Lampiran_Dokumen.pdf" : "Dokumen_Resmi.pdf",
              attachmentSize: "1.2 MB",
              important: Boolean(item.is_important) || idx === 0,
              tone: idx % 2 === 0 ? "ruby" : "sapphire",
              targetAudience: item.target_audience || "Satuan Pendidikan se-Konawe Selatan",
              deadline: item.deadline || "Sesuai petunjuk teknis",
              signatory: "Kepala Dinas Pendidikan dan Kebudayaan",
              keyPoints: [item.isi || "Perhatikan rincian pengumuman dan tindak lanjuti sebelum batas waktu."],
              fileUrl: fileFullUrl,
            };
          });
          return mapped;
        }
      return [];
    },
    queryKey: ["public-announcements-list"],
  });

  return {
    announcements: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
