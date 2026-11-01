"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { ProfileSection, ContactMessagePayload } from "../types";
import { swallAlert, showLoadingAlert } from "@/lib/show_swall";

export function usePublicProfiles() {
  const url = useUrlStore((state) => state.URL.APP);

  return useQuery({
    queryFn: async () => {
      try {
        const res = await fetchData<{ total: number; data: ProfileSection[] }>(
          `${url}/api/v1/admin/profil/read?limit=50`
        );
        if (res && Array.isArray(res.data)) {
          return res.data;
        }
      } catch (e) {
        console.warn("[usePublicProfiles] Error:", e);
      }
      return [];
    },
    queryKey: ["public-profiles-list"],
  });
}

export function useSubmitContact() {
  const url = useUrlStore((state) => state.URL.APP);

  const mutation = useMutation({
    mutationFn: (body: ContactMessagePayload) =>
      fetchData(`${url}/api/v1/admin/kontak/create`, {
        method: "POST",
        body: JSON.stringify({ ...body, status: "Baru" }),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      swallAlert("Pesan / Pengaduan berhasil dikirim ke Dinas!", "success");
    },
    onError: (err: any) => {
      swallAlert(`Gagal mengirim pesan: ${err?.message || err}`, "error");
    },
  });

  if (mutation.isPending) {
    showLoadingAlert("Mengirimkan pesan...");
  }

  return mutation;
}
