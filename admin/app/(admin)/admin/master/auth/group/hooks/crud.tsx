"use client";

import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ResponseListInterface,
  ResponseInterface,
  GroupPermissionsResponse,
  PermissionRule,
} from "../types";
import { swallAlert, showLoadingAlert } from "@/lib/show_swall";
import { ListOptionSchema } from "@/types/global";

export const useResponseOption = (search: string = "") => {
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
  search: string = ""
) => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data: List, isLoading, isError, error, refetch } = useQuery({
    queryFn: () =>
      fetchData<ResponseListInterface>(
        `${url}/api/v1/admin/master/auth/group/read?skip=${(skip - 1) * limit}&limit=${limit}&search=${encodeURIComponent(search)}`
      ),
    queryKey: ["master-auth-group", skip, limit, search],
  });
  return { List, isLoading, isError, error, refetch };
};

export const useDeleteMaster = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchData(`${url}/api/v1/admin/master/auth/group/delete/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-auth-group"],
      });
      swallAlert("Role group berhasil dihapus", "success");
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
      fetchData(`${url}/api/v1/admin/master/auth/group/create`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-auth-group"],
      });
      swallAlert("Role group berhasil ditambahkan", "success");
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
      fetchData(`${url}/api/v1/admin/master/auth/group/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-auth-group"],
      });
      swallAlert("Role group berhasil diperbarui", "success");
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

// Permissions Matrix Hooks
export const useGroupPermissions = (groupId: string | null) => {
  const url = useUrlStore((state) => state.URL.APP);
  return useQuery({
    queryKey: ["group-permissions", groupId],
    queryFn: () =>
      fetchData<GroupPermissionsResponse>(
        `${url}/api/v1/admin/master/auth/group/${groupId}/permissions`
      ),
    enabled: Boolean(groupId),
  });
};

export const useUpdateGroupPermissions = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      permissions,
    }: {
      groupId: string;
      permissions: PermissionRule[];
    }) =>
      fetchData(`${url}/api/v1/admin/master/auth/group/${groupId}/permissions`, {
        method: "POST",
        body: JSON.stringify({ permissions }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["group-permissions", variables.groupId],
      });
      swallAlert("Hak akses menu berhasil disimpan", "success");
    },
    onError: (err: any) => {
      swallAlert(`Gagal menyimpan hak akses: ${err?.message || err}`, "error");
    },
  });
};
