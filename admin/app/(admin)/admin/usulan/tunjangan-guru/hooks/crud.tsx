"use client";

import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ResponseListInterface, ResponseInterface } from "../types";
import { swallAlert, showLoadingAlert } from "@/lib/show_swall";
import { ListOptionSchema } from "@/types/global";

export const useResponseOption = (search: string = "") => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () =>
      fetchData<ResponseInterface[]>(
        `${url}/api/v1/admin/usulan/tunjangan-guru/option?search=${encodeURIComponent(search)}`
      ),
    queryKey: ["usulan-tunjangan-guru-option", search],
  });

  let result: ListOptionSchema = [];
  if (data) {
    result = (data as ResponseInterface[])?.map((item: any) => ({
      id: item.id,
      value:
        item.title ||
        item.judul ||
        item.nama ||
        item.name ||
        item.sekolah ||
        item.nama_kombel ||
        item.kegiatan ||
        item.indikator ||
        item.uraian ||
        "",
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
        `${url}/api/v1/admin/usulan/tunjangan-guru/read?skip=${(skip - 1) * limit}&limit=${limit}&search=${encodeURIComponent(search)}`
      ),
    queryKey: ["usulan-tunjangan-guru", skip, limit, search],
  });
  return { List, isLoading, isError, error, refetch };
};

export const useDeleteMaster = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchData(`${url}/api/v1/admin/usulan/tunjangan-guru/delete/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["usulan-tunjangan-guru"],
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
      fetchData(`${url}/api/v1/admin/usulan/tunjangan-guru/create`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["usulan-tunjangan-guru"],
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
      fetchData(`${url}/api/v1/admin/usulan/tunjangan-guru/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usulan-tunjangan-guru"] });
      swallAlert("sukses diubah", "success");
    },
    onError: (err: any) => {
      swallAlert(`gagal diubah : ${err?.message || err}`, "error");
    },
  });

  return updateMutation;
};
