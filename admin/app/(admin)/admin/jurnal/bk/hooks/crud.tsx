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
        `${url}/api/v1/admin/jurnal/bk/option?search=${encodeURIComponent(search)}`
      ),
    queryKey: ["jurnal-bk-option", search],
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
        `${url}/api/v1/admin/jurnal/bk/read?skip=${(skip - 1) * limit}&limit=${limit}&search=${encodeURIComponent(search)}`
      ),
    queryKey: ["jurnal-bk", skip, limit, search],
  });
  return { List, isLoading, isError, error, refetch };
};

export const useDeleteMaster = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchData(`${url}/api/v1/admin/jurnal/bk/delete/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jurnal-bk"],
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
    mutationFn: (body: any) => {
      const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
      return fetchData(`${url}/api/v1/admin/jurnal/bk/create`, {
        method: "POST",
        body: isFormData ? body : JSON.stringify(body),
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jurnal-bk"],
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
    mutationFn: ({ body, id }: { body: any; id: string }) => {
      const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
      return fetchData(`${url}/api/v1/admin/jurnal/bk/update/${id}`, {
        method: "PUT",
        body: isFormData ? body : JSON.stringify(body),
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jurnal-bk"] });
      swallAlert("sukses diubah", "success");
    },
    onError: (err: any) => {
      swallAlert(`gagal diubah : ${err?.message || err}`, "error");
    },
  });

  return updateMutation;
};

export const useSiswaOption = (search: string = "") => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () =>
      fetchData<any[]>(
        `${url}/api/v1/admin/master/siswa/option?search=${encodeURIComponent(search)}`
      ),
    queryKey: ["master-siswa-option", search],
  });

  let result: ListOptionSchema = [];
  if (data && Array.isArray(data)) {
    result = data.map((item: any) => ({
      id: String(item.id || item.value || ""),
      value: String(
        item.title ||
        item.judul ||
        item.nama ||
        item.name ||
        item.uraian ||
        item.sekolah ||
        item.nama_kombel ||
        item.id ||
        ""
      ),
    }));
  }

  return {
    options: result,
    isLoading,
    isError,
    error,
  };
};

export const useKelasOption = (search: string = "") => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () =>
      fetchData<any[]>(
        `${url}/api/v1/admin/master/jurnal/kelas/option?search=${encodeURIComponent(search)}`
      ),
    queryKey: ["master-kelas-option", search],
  });

  let result: ListOptionSchema = [];
  if (data && Array.isArray(data)) {
    result = data.map((item: any) => ({
      id: String(item.id || item.value || ""),
      value: String(
        item.title ||
        item.judul ||
        item.nama ||
        item.name ||
        item.uraian ||
        item.sekolah ||
        item.nama_kombel ||
        item.id ||
        ""
      ),
    }));
  }

  return {
    options: result,
    isLoading,
    isError,
    error,
  };
};

export const useJenisLayananOption = (search: string = "") => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () =>
      fetchData<any[]>(
        `${url}/api/v1/admin/master/bk-jenis-layanan/option?search=${encodeURIComponent(search)}`
      ),
    queryKey: ["master-bk-jenis-layanan-option", search],
  });

  let result: ListOptionSchema = [];
  if (data && Array.isArray(data)) {
    result = data.map((item: any) => ({
      id: String(item.id || item.value || ""),
      value: String(
        item.title ||
        item.judul ||
        item.nama ||
        item.name ||
        item.uraian ||
        item.sekolah ||
        item.nama_kombel ||
        item.id ||
        ""
      ),
    }));
  }

  return {
    options: result,
    isLoading,
    isError,
    error,
  };
};

export const useKegiatanLayananOption = (search: string = "") => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () =>
      fetchData<any[]>(
        `${url}/api/v1/admin/master/bk-kegiatan-layanan/option?search=${encodeURIComponent(search)}`
      ),
    queryKey: ["master-bk-kegiatan-layanan-option", search],
  });

  let result: ListOptionSchema = [];
  if (data && Array.isArray(data)) {
    result = data.map((item: any) => ({
      id: String(item.id || item.value || ""),
      value: String(
        item.title ||
        item.judul ||
        item.nama ||
        item.name ||
        item.uraian ||
        item.sekolah ||
        item.nama_kombel ||
        item.id ||
        ""
      ),
    }));
  }

  return {
    options: result,
    isLoading,
    isError,
    error,
  };
};
