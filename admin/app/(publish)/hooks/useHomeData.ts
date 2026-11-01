"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { HomeBanner, HomeNewsItem, HomeAnnouncementItem } from "../types";

export function useHomeBanners() {
  const url = useUrlStore((state) => state.URL.APP);

  return useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: any[] }>(
          `${url}/api/v1/admin/banner/read?limit=5`
        );
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: HomeBanner[] = res.data.map((item) => ({
            id: item.id,
            title: item.title || "Pendidikan Berkualitas",
            subtitle: item.subtitle || "untuk Generasi Konawe Selatan yang Lebih Maju",
            badgeText: item.badge_text || "Portal Resmi Dikbud Konsel",
            primaryButtonLabel: item.primary_button_label || "Jelajahi Layanan",
            primaryButtonLink: item.primary_button_link || "#layanan",
            image: item.image || "/img/hero-konsel.png",
          }));
          return mapped;
        }
      } catch (e) {
        console.warn("[useHomeBanners] Fallback:", e);
      }
      return [];
    },
    queryKey: ["home-banners"],
  });
}
