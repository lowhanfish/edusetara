"use client";

import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ResponseListInterface,
  ResponseInterface,
  MenuTreeResponse,
} from "../types";
import { swallAlert, showLoadingAlert } from "@/lib/show_swall";
import { ListOptionSchema } from "@/types/global";

export const useResponseOption = (search: string = "") => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () =>
      fetchData<any[]>(
        `${url}/api/v1/admin/master/auth/menu/option?search=${encodeURIComponent(search)}`
      ),
    queryKey: ["master-auth-menu-option", search],
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

export const useMenuTree = () => {
  const url = useUrlStore((state) => state.URL.APP);
  return useQuery({
    queryFn: () =>
      fetchData<MenuTreeResponse>(`${url}/api/v1/admin/master/auth/menu/tree`),
    queryKey: ["master-auth-menu-tree"],
  });
};

export const useResponseListMaster = (
  skip: number,
  limit: number,
  search: string = ""
) => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data: List, isLoading, isError, error, refetch } = useQuery({
    queryFn: () =>
      fetchData<ResponseListInterface>(
        `${url}/api/v1/admin/master/auth/menu/read?skip=${(skip - 1) * limit}&limit=${limit}&search=${encodeURIComponent(search)}`
      ),
    queryKey: ["master-auth-menu", skip, limit, search],
  });
  return { List, isLoading, isError, error, refetch };
};

export const useDeleteMaster = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchData(`${url}/api/v1/admin/master/auth/menu/delete/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-auth-menu"],
      });
      queryClient.invalidateQueries({
        queryKey: ["master-auth-menu-tree"],
      });
      queryClient.invalidateQueries({
        queryKey: ["master-auth-menu-option"],
      });
      swallAlert("Menu berhasil dihapus", "success");
    },
    onError: (err: any) => {
      swallAlert(`Gagal menghapus: ${err?.message || err}`, "error");
    },
  });

  if (deleteMutation.isPending) {
    showLoadingAlert();
  }
  return deleteMutation;
};

export const useCreateMaster = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (body: Partial<ResponseInterface>) =>
      fetchData(`${url}/api/v1/admin/master/auth/menu/create`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-auth-menu"],
      });
      queryClient.invalidateQueries({
        queryKey: ["master-auth-menu-tree"],
      });
      queryClient.invalidateQueries({
        queryKey: ["master-auth-menu-option"],
      });
      swallAlert("Menu berhasil ditambahkan", "success");
    },
    onError: (err: any) => {
      swallAlert(`Gagal menambahkan: ${err?.message || err}`, "error");
    },
  });

  if (createMutation.isPending) {
    showLoadingAlert();
  }
  return createMutation;
};

export const useUpdateMaster = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<ResponseInterface> }) =>
      fetchData(`${url}/api/v1/admin/master/auth/menu/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-auth-menu"],
      });
      queryClient.invalidateQueries({
        queryKey: ["master-auth-menu-tree"],
      });
      queryClient.invalidateQueries({
        queryKey: ["master-auth-menu-option"],
      });
      swallAlert("Menu berhasil diperbarui", "success");
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
