"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { CultureItem } from "../types";

export function usePublicCulture() {
  const url = useUrlStore((state) => state.URL.APP);

  return useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: CultureItem[] }>(
          `${url}/api/v1/admin/kebudayaan/read?limit=50`
        );
        if (res && Array.isArray(res.data)) {
          return res.data;
        }
      } catch (e) {
        console.warn("[usePublicCulture] Error:", e);
      }
      return [];
    },
    queryKey: ["public-culture-list"],
  });
}
