"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { PublicService } from "../types";

export function usePublicServices() {
  const url = useUrlStore((state) => state.URL.APP);

  return useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: PublicService[] }>(
          `${url}/api/v1/admin/layanan/read?limit=50`
        );
        if (res && Array.isArray(res.data)) {
          return res.data;
        }
      } catch (e) {
        console.warn("[usePublicServices] Error fetching services:", e);
      }
      return [];
    },
    queryKey: ["public-services-list"],
  });
}
