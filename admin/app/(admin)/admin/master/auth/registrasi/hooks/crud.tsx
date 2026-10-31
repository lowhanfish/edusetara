"use client";

import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResponseListInterface } from "../types";
import { swallAlert, showLoadingAlert } from "@/lib/show_swall";
import { ListOptionSchema } from "@/types/global";

export const useGroupOption = (search: string = "") => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () =>
      fetchData<any[]>(
        `${url}/api/v1/admin/master/auth/group/option?search=${encodeURIComponent(search)}`
      ),
    queryKey: ["master-auth-group-option", search],
  });

  let result: ListOptionSchema = [];
  if (data) {
    result = data.map((item: any) => ({
      id: item.id,
      value: item.value || item.title,
    }));
  }

  return {
    List: result,
    isLoading,
    isError,
    error,
  };
};

export const useResponseListMaster = (
  skip: number,
  limit: number,
  search: string = "",
  groupId: string = ""
) => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data: List, isLoading, isError, error, refetch } = useQuery({
    queryFn: () =>
      fetchData<ResponseListInterface>(
        `${url}/api/v1/admin/master/auth/registrasi/read?skip=${(skip - 1) * limit}&limit=${limit}&search=${encodeURIComponent(search)}&group_id=${encodeURIComponent(groupId)}`
      ),
    queryKey: ["master-auth-registrasi", skip, limit, search, groupId],
  });
  return { List, isLoading, isError, error, refetch };
};

export const useUpdateMaster = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { group_id: string | null } }) =>
      fetchData(`${url}/api/v1/admin/master/auth/registrasi/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-auth-registrasi"],
      });
      queryClient.invalidateQueries({
        queryKey: ["master-auth-group"],
      });
      swallAlert("Role akses ASN berhasil diperbarui", "success");
    },
    onError: (err: any) => {
      swallAlert(`Gagal memperbarui: ${err?.message || err}`, "error");
    },
  });

  if (updateMutation.isPending) {
    showLoadingAlert();
  }
  return updateMutation;
};
