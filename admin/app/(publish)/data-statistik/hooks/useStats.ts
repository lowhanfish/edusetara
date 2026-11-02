"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { StatisticIndicator } from "../types";

export function usePublicStats() {
  const url = useUrlStore((state) => state.URL.APP);

  return useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: StatisticIndicator[] }>(
          `${url}/api/v1/publish/statistik?limit=50`
        );
        if (res && Array.isArray(res.data)) {
          return res.data;
        }
      } catch (e) {
        console.warn("[usePublicStats] Error:", e);
      }
      return [];
    },
    queryKey: ["public-stats-list"],
  });
}
