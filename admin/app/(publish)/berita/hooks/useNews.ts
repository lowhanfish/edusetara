"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { NewsArticle, BackendNewsItem } from "../types";

export function usePublicNews() {
  const url = useUrlStore((state) => state.URL.APP);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () => {
        const res = await fetchData<{ total: number; data: BackendNewsItem[] }>(
          `${url}/api/v1/publish/berita?limit=50`
        );
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: NewsArticle[] = res.data.map((item) => ({
            id: item.id,
            slug: item.slug || item.id,
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
            image: item.foto?.startsWith("/uploads") ? `${url}${item.foto}` : (item.foto || "/img/pendidikan-jenjang.jpg"),
            imageCaption: item.judul || "Dokumentasi kegiatan pendidikan",
            tags: ["Pendidikan", "Konawe Selatan"],
            featured: Boolean(item.featured),
          }));
          return mapped;
        }
      return [];
    },
    queryKey: ["public-news-list"],
  });

  return {
    articles: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
