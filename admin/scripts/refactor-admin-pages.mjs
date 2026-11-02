import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { modules } from "./admin-modules-data.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const adminRoot = path.resolve(__dirname, "..");

function generateTypes(mod) {
  const fields = mod.fields
    .map((f) => {
      const tsType = f.type === "number" ? "number" : "string";
      const opt = f.required ? "" : "?";
      return `  ${f.name}${opt}: ${tsType} | null;`;
    })
    .join("\n");

  return `export interface CreateInterface {
${fields}
}

export interface ResponseInterface extends CreateInterface {
  id: string;
  unit_kerja?: string | null;
  nip?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ResponseListInterface {
  skip: number;
  limit: number;
  total: number;
  data: ResponseInterface[];
}

export type ${mod.entity}Record = ResponseInterface;
`;
}

function generateHooks(mod) {
  const masterFields = mod.fields.filter((f) => f.type === "select" && f.masterEndpoint);
  const uniqueMasterHooks = Array.from(new Map(masterFields.map((f) => [f.hookName, f])).values());

  const extraOptionHooks = uniqueMasterHooks
    .map((f) => {
      const sep = f.masterEndpoint.includes("?") ? "&" : "?";
      return `export const use${f.hookName}Option = (search: string = "") => {
  const url = useUrlStore((state) => state.URL.APP);
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () =>
      fetchData<any[]>(
        \`\${url}${f.masterEndpoint}${sep}search=\${encodeURIComponent(search)}\`
      ),
    queryKey: ["${f.masterQueryKey}", search],
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
};`;
    })
    .join("\n\n");

  return `"use client";

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
        \`\${url}${mod.endpoint}/option?search=\${encodeURIComponent(search)}\`
      ),
    queryKey: ["${mod.queryKey}-option", search],
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
        \`\${url}${mod.endpoint}/read?skip=\${(skip - 1) * limit}&limit=\${limit}&search=\${encodeURIComponent(search)}\`
      ),
    queryKey: ["${mod.queryKey}", skip, limit, search],
  });
  return { List, isLoading, isError, error, refetch };
};

export const useDeleteMaster = () => {
  const url = useUrlStore((state) => state.URL.APP);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchData(\`\${url}${mod.endpoint}/delete/\${id}\`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["${mod.queryKey}"],
      });
      swallAlert("sukses dihapus", "success");
    },
    onError: (err: any) => {
      swallAlert(\`gagal dihapus: \${err?.message || err}\`, "error");
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
      return fetchData(\`\${url}${mod.endpoint}/create\`, {
        method: "POST",
        body: isFormData ? body : JSON.stringify(body),
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["${mod.queryKey}"],
      });
      swallAlert("sukses ditambahkan", "success");
    },
    onError: (err: any) => {
      swallAlert(\`gagal ditambahkan : \${err?.message || err}\`, "error");
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
      return fetchData(\`\${url}${mod.endpoint}/update/\${id}\`, {
        method: "PUT",
        body: isFormData ? body : JSON.stringify(body),
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["${mod.queryKey}"] });
      swallAlert("sukses diubah", "success");
    },
    onError: (err: any) => {
      swallAlert(\`gagal diubah : \${err?.message || err}\`, "error");
    },
  });

  return updateMutation;
};

${extraOptionHooks}
`;
}

function generateFormModal(mod) {
  const masterFields = mod.fields.filter((f) => f.type === "select" && f.masterEndpoint);
  const uniqueMasterHooks = Array.from(new Map(masterFields.map((f) => [f.hookName, f])).values());

  const hookImports =
    uniqueMasterHooks.length > 0
      ? `import { ${uniqueMasterHooks.map((f) => `use${f.hookName}Option`).join(", ")} } from "../hooks/crud";`
      : "";

  const hookCalls = uniqueMasterHooks
    .map(
      (f) =>
        `  const { options: ${f.hookName.toLowerCase()}Options, isLoading: ${f.hookName.toLowerCase()}Loading } = use${f.hookName}Option();`
    )
    .join("\n");

  const formFields = mod.fields
    .map((f) => {
      const requiredMark = f.required ? ` <span className="text-rose-500">*</span>` : "";

      if (f.type === "textarea") {
        return `        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            ${f.label}${requiredMark}
          </label>
          <Textarea
            ${f.required ? "required" : ""}
            rows={3}
            value={(formData as any).${f.name} || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                ${f.name}: e.target.value,
              })
            }
            placeholder="${f.placeholder || ""}"
          />
        </div>`;
      } else if (f.type === "file") {
        return `        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            ${f.label}${requiredMark}
          </label>
          <FileInput
            value={(formData as any).${f.name} || ""}
            onChange={(fileName) =>
              setFormData({
                ...formData,
                ${f.name}: fileName,
              })
            }
            helperText="${f.placeholder || "Unggah dokumen pendukung"}"
          />
        </div>`;
      } else if (f.type === "number") {
        return `        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            ${f.label}${requiredMark}
          </label>
          <Input
            type="number"
            ${f.required ? "required" : ""}
            value={(formData as any).${f.name} ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                ${f.name}: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            placeholder="${f.placeholder || ""}"
          />
        </div>`;
      } else if (f.type === "date") {
        return `        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            ${f.label}${requiredMark}
          </label>
          <Input
            type="date"
            ${f.required ? "required" : ""}
            value={(formData as any).${f.name} || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                ${f.name}: e.target.value,
              })
            }
          />
        </div>`;
      } else if (f.type === "select") {
        if (f.masterEndpoint) {
          const isIdField = f.name.endsWith("_id") || f.name === "id";
          return `        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            ${f.label}${requiredMark}
          </label>
          <Select
            ${f.required ? "required" : ""}
            value={(() => {
              const cur = (formData as any).${f.name};
              if (!cur) return "";
              const match = ${f.hookName.toLowerCase()}Options.find((o) => o.id === cur || o.value === cur);
              return match ? String(${isIdField ? "match.id" : "match.value || match.id"}) : String(cur);
            })()}
            onChange={(e) =>
              setFormData({
                ...formData,
                ${f.name}: e.target.value,
              })
            }
            options={[
              { value: "", label: ${f.hookName.toLowerCase()}Loading ? "Memuat opsi data master..." : "-- ${f.placeholder || `Pilih ${f.label}`} --" },
              ...${f.hookName.toLowerCase()}Options.map((opt) => ({
                value: String(${isIdField ? "opt.id" : "opt.value || opt.id"}),
                label: opt.value,
              })),
            ]}
          />
        </div>`;
        } else if (f.options) {
          const optStr = JSON.stringify(f.options);
          return `        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            ${f.label}${requiredMark}
          </label>
          <Select
            ${f.required ? "required" : ""}
            value={(formData as any).${f.name} ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                ${f.name}: e.target.value,
              })
            }
            options={[
              { value: "", label: "-- ${f.placeholder || `Pilih ${f.label}`} --" },
              ...${optStr}
            ]}
          />
        </div>`;
        }
      }

      return `        <div>
          <label className="block text-xs font-semibold text-[#2d2410] mb-1">
            ${f.label}${requiredMark}
          </label>
          <Input
            ${f.required ? "required" : ""}
            value={(formData as any).${f.name} || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                ${f.name}: e.target.value,
              })
            }
            placeholder="${f.placeholder || ""}"
          />
        </div>`;
    })
    .join("\n\n");

  return `import React from "react";
import { Button, Input, Modal, Textarea, FileInput, Select } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";
${hookImports}

interface Form${mod.entity}ModalProps {
  isOpen: boolean;
  onClose: () => void;
  formMode: "add" | "edit";
  formData: Partial<ResponseInterface>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResponseInterface>>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function Form${mod.entity}Modal({
  isOpen,
  onClose,
  formMode,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}: Form${mod.entity}ModalProps) {
${hookCalls}

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        formMode === "add"
          ? "+ Tambah ${mod.title}"
          : "✎ Edit ${mod.title}"
      }
      description="${mod.description}"
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button variant="gold" type="submit" form="form-${mod.queryKey}" disabled={isLoading}>
            {isLoading
              ? "Menyimpan..."
              : formMode === "add"
              ? "Simpan ${mod.title}"
              : "Perbarui ${mod.title}"}
          </Button>
        </>
      }
    >
      <form id="form-${mod.queryKey}" onSubmit={onSubmit} className="space-y-4">
${formFields}
      </form>
    </Modal>
  );
}
`;
}

function generateDetailModal(mod) {
  const detailRows = mod.fields
    .map((f) => {
      if (f.type === "file") {
        return `          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">${f.label}</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {(record as any).${f.name} ? (
                <a
                  href={String((record as any).${f.name})}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 underline hover:text-amber-900 inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  📄 Lihat / Unduh Berkas
                </a>
              ) : (
                "-"
              )}
            </span>
          </div>`;
      }
      return `          <div className="py-2 border-b border-[#e2d9c8]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <span className="text-[#7d7152] font-semibold sm:w-1/3">${f.label}</span>
            <span className="text-[#2d2410] sm:w-2/3 font-medium break-words">
              {String((record as any).${f.name} ?? "-")}
            </span>
          </div>`;
    })
    .join("\n");

  return `import React from "react";
import { Button, Modal } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "../types";

interface Detail${mod.entity}ModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ResponseInterface | null;
}

export default function Detail${mod.entity}Modal({
  isOpen,
  onClose,
  record,
}: Detail${mod.entity}ModalProps) {
  return (
    <Modal
      isOpen={isOpen && Boolean(record)}
      onClose={onClose}
      title="Lembar Data ${mod.title}"
      description="Sesuai dokumen spesifikasi Arsitektur Sistem EduSetara"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#7d7152]">
            Pencatat: {record?.created_by || "Administrator"}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
            <Button variant="gold" onClick={() => window.print()}>
              🖨 Cetak Berkas
            </Button>
          </div>
        </div>
      }
    >
      {record && (
        <div className="space-y-4 text-xs text-[#2d2410]">
          <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-1">
${detailRows}
          </div>

          <div className="p-3 rounded-xl bg-white/30 border border-white/50 text-[11px] text-[#7d7152] flex items-center justify-between">
            <span>
              Waktu Pencatatan:{" "}
              <strong className="text-[#2d2410]">
                {record.created_at
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(record.created_at))
                  : "-"}
              </strong>
            </span>
            <span className="text-[10px] text-amber-800 font-mono bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 truncate max-w-[140px]">
              ID: {record.id}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
`;
}

function generatePage(mod) {
  const initialFormEntries = mod.fields
    .map((f) => {
      const defaultVal = f.type === "number" ? "null" : '""';
      return `    ${f.name}: ${defaultVal},`;
    })
    .join("\n");

  const editFormEntries = mod.fields
    .map((f) => {
      return `      ${f.name}: (record as any).${f.name} ?? "",`;
    })
    .join("\n");

  const tableHeaders = mod.tableCols
    .map((c) => `                <th className="py-3 px-4">${c.label}</th>`)
    .join("\n");

  const tableCells = mod.tableCols
    .map((c) => {
      if (c.key === "created_at") {
        return `                    <td className="py-3 px-4 text-[#7d7152]">
                      {item.created_at ? String(item.created_at).slice(0, 10) : "-"}
                    </td>`;
      }
      return `                    <td className="py-3 px-4 text-[#2d2410] font-medium max-w-xs truncate">
                      {String((item as any).${c.key} ?? "-")}
                    </td>`;
    })
    .join("\n");

  const totalCols = mod.tableCols.length + 2;

  return `"use client";

import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Button,
  Card,
  Input,
  PageHeader,
  Pagination,
} from "@/app/(admin)/_components/ui";

import { ResponseInterface, ${mod.entity}Record } from "./types";
import Form${mod.entity}Modal from "./components/Form${mod.entity}Modal";
import Detail${mod.entity}Modal from "./components/Detail${mod.entity}Modal";
import {
  useResponseListMaster,
  useDeleteMaster,
  useCreateMaster,
  useUpdateMaster,
} from "./hooks/crud";
import { listindex } from "@/utilities/pagination";

export default function ${mod.entity}Page() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { List, isLoading, isError, error, refetch } = useResponseListMaster(
    page,
    pageSize,
    debouncedSearch
  );
  const deleteMutation = useDeleteMaster();
  const createMutation = useCreateMaster();
  const updateMutation = useUpdateMaster();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<${mod.entity}Record | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  const initialForm: Partial<ResponseInterface> = {
${initialFormEntries}
  };

  const [formData, setFormData] = useState<Partial<ResponseInterface>>(initialForm);

  const emptyForm = () => {
    setFormData(initialForm);
  };

  const rawList: ${mod.entity}Record[] = useMemo(() => {
    if (!List?.data || !Array.isArray(List.data)) return [];
    return List.data;
  }, [List]);

  const totalItems = List?.total ?? rawList.length;

  const handleOpenAdd = () => {
    setFormMode("add");
    emptyForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (record: ${mod.entity}Record) => {
    setFormMode("edit");
    setFormData({
      id: record.id,
${editFormEntries}
    });
    setIsFormOpen(true);
  };

  const handleOpenDetail = (record: ${mod.entity}Record) => {
    setSelectedRecord(record);
    setIsDetailOpen(true);
  };

  const handleDelete = (record: ${mod.entity}Record) => {
    const displayName =
      (record as any).judul ||
      (record as any).title ||
      (record as any).nama ||
      (record as any).sekolah ||
      (record as any).nama_kombel ||
      (record as any).kegiatan ||
      (record as any).uraian ||
      (record as any).isi ||
      "data ini";

    Swal.fire({
      title: "Hapus ${mod.title}?",
      text: \`Apakah Anda yakin ingin menghapus "\${displayName}"?\`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c2410c",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus Data",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(record.id);
      }
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    const hasFile = Object.values(formData).some(
      (v) => typeof File !== "undefined" && v instanceof File
    );

    let payload: any;
    if (hasFile) {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          fd.append(k, v instanceof File ? v : String(v));
        }
      });
      payload = fd;
    } else {
      payload = { ...formData };
    }

    if (formMode === "add") {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
          emptyForm();
        },
      });
    } else {
      if (!formData.id) return;
      updateMutation.mutate(
        { body: payload, id: formData.id },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            emptyForm();
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="${mod.title}"
        description="${mod.description}"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="hidden sm:inline-flex"
            >
              🔄 Refresh
            </Button>
            <Button variant="gold" size="sm" onClick={handleOpenAdd}>
              + Tambah ${mod.title}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Total Data</p>
              <h4 className="text-2xl font-bold text-[#2d2410] mt-1">{totalItems}</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5">Operasional Terdaftar</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              ${mod.icon}
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Kategori</p>
              <h4 className="text-lg font-bold text-amber-700 mt-1 truncate max-w-[140px]">{${JSON.stringify(mod.category)}}</h4>
              <p className="text-[11px] text-[#7d7152] mt-0.5">EduSetara</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              📁
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Status API</p>
              <h4 className="text-sm font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Terhubung
              </h4>
              <p className="text-[10px] text-[#7d7152] mt-0.5 font-mono truncate max-w-[140px]">${mod.endpoint}</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              ⚡
            </span>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl bg-white/70 border-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7d7152] font-medium">Otoritas Akses</p>
              <h4 className="text-sm font-semibold text-[#2d2410] mt-1">Operator & Admin</h4>
              <p className="text-[11px] text-[#7d7152] mt-0.5">Role ASN & Dinas</p>
            </div>
            <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-200/50">
              🔐
            </span>
          </div>
        </Card>
      </div>

      <Card className="p-6 rounded-3xl bg-white/80 border-white/80 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7d7152]">
              🔍
            </span>
            <Input
              type="text"
              placeholder="Cari ${mod.title}..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7d7152]">Baris per hal:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="text-xs bg-white border border-[#e2d9c8] rounded-xl px-2 py-1.5 text-[#2d2410] outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#e2d9c8]/80">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#e2d9c8] bg-[#fbf9f4]/80 text-[#7d7152] font-semibold">
                <th className="py-3 px-4 w-12 text-center">No</th>
${tableHeaders}
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ece5d8]">
              {isLoading ? (
                <tr>
                  <td colSpan={${totalCols}} className="py-12 text-center text-[#7d7152]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      <span>Memuat data dari server...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={${totalCols}} className="py-12 text-center text-rose-700">
                    <p className="font-semibold">Gagal memuat data ${mod.title}</p>
                    <p className="text-[11px] mt-1 text-[#7d7152]">
                      {error?.message || "Terjadi kesalahan koneksi ke server."}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => refetch()}
                    >
                      Coba Lagi
                    </Button>
                  </td>
                </tr>
              ) : rawList.length === 0 ? (
                <tr>
                  <td colSpan={${totalCols}} className="py-12 text-center text-[#7d7152]">
                    <span className="text-3xl block mb-2">${mod.icon}</span>
                    <p className="font-semibold text-sm text-[#2d2410]">
                      Belum ada data ${mod.title}
                    </p>
                    <p className="text-[11px] mt-0.5">
                      Klik tombol "+ Tambah ${mod.title}" untuk membuat data pertama.
                    </p>
                  </td>
                </tr>
              ) : (
                rawList.map((item, index) => {
                  const no = listindex(pageSize, page, index);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/50 transition-colors duration-150"
                    >
                      <td className="py-3 px-4 text-center text-[#7d7152] font-mono">
                        {no}
                      </td>
${tableCells}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            title="Detail"
                            className="p-1.5 rounded-lg border border-[#e2d9c8] hover:bg-amber-100/60 text-[#7d7152] transition-colors"
                          >
                            👁️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit"
                            className="p-1.5 rounded-lg border border-[#e2d9c8] hover:bg-amber-100/60 text-[#7d7152] transition-colors"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            title="Hapus"
                            className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-2">
          <Pagination
            currentPage={page}
            totalCount={totalItems}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </Card>

      <Form${mod.entity}Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        formMode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmitForm}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <Detail${mod.entity}Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
`;
}

function processAll() {
  console.log(`Starting refactoring for ${modules.length} operational modules...`);

  for (const mod of modules) {
    if (mod.skipRefactor) {
      console.log(`⏩ [${mod.category}] ${mod.title} -> Skipped (Preserved Custom Work)`);
      continue;
    }

    const targetDir = path.join(adminRoot, mod.dir);
    const hooksDir = path.join(targetDir, "hooks");
    const componentsDir = path.join(targetDir, "components");

    fs.mkdirSync(hooksDir, { recursive: true });
    fs.mkdirSync(componentsDir, { recursive: true });

    // 1. types.ts
    const typesContent = generateTypes(mod);
    fs.writeFileSync(path.join(targetDir, "types.ts"), typesContent, "utf8");

    // 2. hooks/crud.tsx
    const hooksContent = generateHooks(mod);
    fs.writeFileSync(path.join(hooksDir, "crud.tsx"), hooksContent, "utf8");

    // 3. components/Form<Entity>Modal.tsx
    const formModalContent = generateFormModal(mod);
    fs.writeFileSync(path.join(componentsDir, `Form${mod.entity}Modal.tsx`), formModalContent, "utf8");

    // 4. components/Detail<Entity>Modal.tsx
    const detailModalContent = generateDetailModal(mod);
    fs.writeFileSync(path.join(componentsDir, `Detail${mod.entity}Modal.tsx`), detailModalContent, "utf8");

    // 5. page.tsx
    const pageContent = generatePage(mod);
    fs.writeFileSync(path.join(targetDir, "page.tsx"), pageContent, "utf8");

    console.log(`✅ [${mod.category}] ${mod.title} -> ${mod.dir}`);
  }

  console.log(`🎉 Finished refactoring all operational modules!`);
}

processAll();
