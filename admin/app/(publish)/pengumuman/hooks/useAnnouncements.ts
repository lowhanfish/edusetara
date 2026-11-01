"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { AnnouncementItem, BackendAnnouncementItem } from "../types";
import { announcementsData as fallbackAnnouncements } from "../_data/announcements-data";

export function usePublicAnnouncements() {
  const url = useUrlStore((state) => state.URL.APP);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: BackendAnnouncementItem[] }>(
          `${url}/api/v1/admin/pengumuman/read?limit=50`
        );
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: AnnouncementItem[] = res.data.map((item, idx) => {
            const dateStr = item.tanggal || item.created_at || "2026-11-01";
            const dateObj = new Date(dateStr);
            const day = String(dateObj.getDate()).padStart(2, "0");
            const months = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
            const month = months[dateObj.getMonth()] || "NOV";
            const year = String(dateObj.getFullYear() || 2026);

            return {
              id: item.id || `announcement-${idx}`,
              number: `421.2/${100 + idx}/Dikbud/${month}/${year}`,
              day,
              month,
              year,
              category: "Akademik & ANBK",
              title: item.judul || "Pengumuman Resmi Dinas",
              summary: item.isi || item.judul || "",
              attachmentName: item.file ? item.file.split("/").pop() || "Lampiran_Dokumen.pdf" : "Dokumen_Resmi.pdf",
              attachmentSize: "1.0 MB",
              important: idx === 0,
              tone: idx % 2 === 0 ? "ruby" : "sapphire",
              targetAudience: "Satuan Pendidikan se-Konawe Selatan",
              deadline: "Sesuai petunjuk teknis",
              signatory: "Kepala Dinas Pendidikan dan Kebudayaan",
              keyPoints: [item.isi || "Perhatikan rincian pengumuman dan tindak lanjuti sebelum batas waktu."],
            };
          });
          return mapped;
        }
      } catch (e) {
        console.warn("[usePublicAnnouncements] Fallback to local announcements:", e);
      }
      return fallbackAnnouncements;
    },
    queryKey: ["public-announcements-list"],
  });

  return {
    announcements: data || fallbackAnnouncements,
    isLoading,
    isError,
    error,
    refetch,
  };
}
