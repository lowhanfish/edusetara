"use client";

import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResponseListInterface, ResponseInterface } from "../types";
import { swallAlert, showLoadingAlert } from "@/lib/show_swall";
import { ListOptionSchema } from "@/types/global";

export const useKelasOption = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchData<any[]>(
        `${url}/api/v1/admin/master/jurnal/kelas/option`
      ),
    queryKey: ["master-siswa-kelas-option"],
  });

  let result: ListOptionSchema = [];
  if (data && Array.isArray(data)) {
    result = data.map((item) => ({
      id: item.id,
      value: item.title || item.uraian || item.id || "",
    }));
  }

  return { options: result, isLoading };
};

export const useAgamaOption = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchData<any[]>(
        `${url}/api/v1/admin/master/ppdb/agama/option`
      ),
    queryKey: ["master-siswa-agama-option"],
  });

  let result: ListOptionSchema = [];
  if (data && Array.isArray(data)) {
    result = data.map((item) => ({
      id: item.id,
      value: item.title || item.uraian || item.id || "",
    }));
  }

  return { options: result, isLoading };
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
        `${url}/api/v1/admin/master/siswa/read?skip=${(skip - 1) * limit}&limit=${limit}&search=${encodeURIComponent(search)}`
      ),
    queryKey: ["master-siswa", skip, limit, search],
  });
  return { List, isLoading, isError, error, refetch };
};

export const useDeleteMaster = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchData(`${url}/api/v1/admin/master/siswa/delete/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-siswa"],
      });
      swallAlert("sukses dihapus", "success");
    },
    onError: (err: any) => {
      swallAlert(`gagal dihapus: ${err?.message || err}`, "error");
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
      fetchData(`${url}/api/v1/admin/master/siswa/create`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["master-siswa"],
      });
      swallAlert("sukses ditambahkan", "success");
    },
    onError: (err: any) => {
      swallAlert(`gagal ditambahkan : ${err?.message || err}`, "error");
    },
  });

  return createMutation;
};

export const useUpdateMaster = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ body, id }: { body: Partial<ResponseInterface>; id: string }) =>
      fetchData(`${url}/api/v1/admin/master/siswa/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-siswa"] });
      swallAlert("sukses diubah", "success");
    },
    onError: (err: any) => {
      swallAlert(`gagal diubah : ${err?.message || err}`, "error");
    },
  });

  return updateMutation;
};
