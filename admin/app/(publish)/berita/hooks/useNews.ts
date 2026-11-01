"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { NewsArticle, BackendNewsItem } from "../types";
import { newsArticles as fallbackNews } from "../_data/news-data";

export function usePublicNews() {
  const url = useUrlStore((state) => state.URL.APP);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: BackendNewsItem[] }>(
          `${url}/api/v1/admin/berita/read?limit=50`
        );
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: NewsArticle[] = res.data.map((item) => ({
            id: item.id,
            slug: item.slug || `berita-${item.id}`,
            title: item.judul || item.title || "Warta Resmi Dikbud",
            excerpt: item.deskripsi || item.judul || "",
            content: {
              lead: item.deskripsi || item.judul || "",
              paragraphs: item.isi ? [item.isi] : ["Belum ada isi naskah..."],
            },
            category: (item.kategori as NewsArticle["category"]) || "Pendidikan",
            date: item.created_at ? String(item.created_at).slice(0, 10) : "Terbaru",
            publishedAt: item.created_at ? String(item.created_at).slice(0, 10) : "2026-11-01",
            author: item.author || "Tim Humas Dikbud",
            authorRole: "Redaksi Warta Konsel",
            readTime: "3 menit baca",
            image: item.foto || "/img/pendidikan-jenjang.jpg",
            imageCaption: item.judul || "Dokumentasi kegiatan pendidikan",
            tags: ["Pendidikan", "Konawe Selatan"],
            featured: Boolean(item.featured),
          }));
          return mapped;
        }
      } catch (e) {
        console.warn("[usePublicNews] Fallback to local news dataset:", e);
      }
      return fallbackNews;
    },
    queryKey: ["public-news-list"],
  });

  return {
    articles: data || fallbackNews,
    isLoading,
    isError,
    error,
    refetch,
  };
}
