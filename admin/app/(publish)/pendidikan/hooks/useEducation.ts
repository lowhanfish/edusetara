"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { EducationArticle } from "../types";

export function usePublicEducation() {
  const url = useUrlStore((state) => state.URL.APP);

  return useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: EducationArticle[] }>(
          `${url}/api/v1/publish/pendidikan?limit=50`
        );
        if (res && Array.isArray(res.data)) {
          return res.data.map((item) => ({
            ...item,
            file: item.file?.startsWith("/uploads")
              ? `${url}${item.file}`
              : item.file || "/img/pendidikan-jenjang.jpg",
          }));
        }
      } catch (e) {
        console.warn("[usePublicEducation] Error:", e);
      }
      return [];
    },
    queryKey: ["public-education-list"],
  });
}
