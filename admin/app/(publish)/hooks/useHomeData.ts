"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { HomeBanner, HomeNewsItem } from "../types";

export function useHomeBanners() {
  const url = useUrlStore((state) => state.URL.APP);

  return useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: any[] }>(
          `${url}/api/v1/publish/banner?limit=5`
        );
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: HomeBanner[] = res.data.map((item, idx) => ({
            id: item.id || `banner-${idx}`,
            title: item.title || "Pendidikan Berkualitas",
            subtitle: item.subtitle || "untuk Generasi Konawe Selatan yang Lebih Maju",
            badgeText: item.badge_text || "Portal Resmi Dikbud Konsel",
            primaryButtonLabel: item.primary_button_label || "Jelajahi Layanan",
            primaryButtonLink: item.primary_button_link || "#layanan",
            image: item.image?.startsWith("/uploads") ? `${url}${item.image}` : (item.image || "/img/hero-konsel.png"),
            order: Number(item.order_num) || idx + 1,
            status: item.status || "Aktif",
          }));
          return mapped;
        }
      } catch (e) {
        console.warn("[useHomeBanners] Fallback:", e);
      }
      return [];
    },
    queryKey: ["home-banners-publish"],
  });
}

export function useHomeNews() {
  const url = useUrlStore((state) => state.URL.APP);

  return useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: any[] }>(
          `${url}/api/v1/publish/berita?limit=4`
        );
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: HomeNewsItem[] = res.data.map((item) => ({
            id: item.id,
            title: item.judul || item.title || "Warta Resmi Dikbud",
            slug: item.slug || item.id,
            category: item.kategori || "Pendidikan",
            excerpt: item.deskripsi || item.judul || "",
            date: item.created_at ? String(item.created_at).slice(0, 10) : "Terbaru",
            image: item.foto?.startsWith("/uploads") ? `${url}${item.foto}` : (item.foto || "/img/pendidikan-jenjang.jpg"),
          }));
          return mapped;
        }
      } catch (e) {
        console.warn("[useHomeNews] Fallback:", e);
      }
      return [];
    },
    queryKey: ["home-news-publish"],
  });
}

export function useHomeAnnouncements() {
  const url = useUrlStore((state) => state.URL.APP);

  return useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: any[] }>(
          `${url}/api/v1/publish/pengumuman?limit=5`
        );
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const months = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
          const mapped = res.data.map((item, idx) => {
            const dateStr = item.tanggal || item.created_at || "2026-11-01";
            const dateObj = new Date(dateStr);
            const date = String(dateObj.getDate()).padStart(2, "0");
            const month = months[dateObj.getMonth()] || "NOV";
            return {
              id: item.id || `announcement-${idx}`,
              slug: item.slug || item.id,
              date,
              month,
              title: item.judul || "Pengumuman Resmi Dinas",
              category: item.kategori || "Akademik & ANBK",
              attachmentName: item.file ? item.file.split("/").pop() : undefined,
              file: item.file?.startsWith("/uploads") ? `${url}${item.file}` : item.file,
              isImportant: Boolean(item.is_important),
            };
          });
          return mapped;
        }
      } catch (e) {
        console.warn("[useHomeAnnouncements] Fallback:", e);
      }
      return [];
    },
    queryKey: ["home-announcements-publish"],
  });
}

export function useHomeStats() {
  const url = useUrlStore((state) => state.URL.APP);

  return useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: any[] }>(
          `${url}/api/v1/publish/statistik?limit=6`
        );
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const tones = ["ruby", "sapphire", "emerald", "amber"];
          const icons = ["🏫", "👥", "👨‍🏫", "📚", "🏛️", "📊"];
          const mapped = res.data.map((item, idx) => ({
            id: item.id || `stat-${idx}`,
            label: item.indikator || item.indicator || "Indikator Pendidikan",
            value: `${item.nilai || item.value || "0"}${item.satuan || item.unit ? ` ${item.satuan || item.unit}` : ""}`,
            sub: item.keterangan || (item.tahun ? `Tahun ${item.tahun}` : "Terkini"),
            tone: tones[idx % tones.length],
            icon: icons[idx % icons.length],
          }));
          return mapped;
        }
      } catch (e) {
        console.warn("[useHomeStats] Fallback:", e);
      }
      return [];
    },
    queryKey: ["home-stats-publish"],
  });
}

export function useHomeCulture() {
  const url = useUrlStore((state) => state.URL.APP);

  return useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: any[] }>(
          `${url}/api/v1/publish/kebudayaan?limit=4`
        );
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          return res.data.map((item) => ({
            id: item.id,
            nama: item.nama || item.name || "Warisan Budaya",
            kategori: item.kategori || item.type || "Cagar Budaya",
            lokasi: item.lokasi || item.location || "Konawe Selatan",
            deskripsi: item.deskripsi || item.description || "",
            foto: item.foto?.startsWith("/uploads") ? `${url}${item.foto}` : (item.foto || "/img/hero-konsel.png"),
          }));
        }
      } catch (e) {
        console.warn("[useHomeCulture] Fallback:", e);
      }
      return [];
    },
    queryKey: ["home-culture-publish"],
  });
}
