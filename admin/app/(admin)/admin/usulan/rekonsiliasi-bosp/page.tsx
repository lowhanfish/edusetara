"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ActionIconButton from "./components/ActionIconButton";
import { Button, Card, Input, PageHeader, Pagination } from "@/app/(admin)/_components/ui";
import { ResponseInterface } from "./types";
import FormUsulanRekonsiliasiBospModal from "./components/FormUsulanRekonsiliasiBospModal";
import DetailUsulanRekonsiliasiBospModal from "./components/DetailUsulanRekonsiliasiBospModal";
import { useResponseListMaster, useDeleteMaster, useCreateMaster, useUpdateMaster } from "./hooks/crud";

const emptyForm: Partial<ResponseInterface> = { sekolah: "", tahun: "", tahap: "" };

export default function UsulanRekonsiliasiBospPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Partial<ResponseInterface>>(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ResponseInterface | null>(null);
  const { List, isLoading, isError, error, refetch } = useResponseListMaster(page, pageSize, debouncedSearch);
  const createMutation = useCreateMaster();
  const updateMutation = useUpdateMaster();
  const deleteMutation = useDeleteMaster();

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const openForm = (record?: ResponseInterface) => {
    setFormMode(record ? "edit" : "add");
    setFormData(record ? { id: record.id, sekolah: record.sekolah, tahun: record.tahun, tahap: record.tahap } : emptyForm);
    setIsFormOpen(true);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const body = { sekolah: formData.sekolah?.trim(), tahun: formData.tahun, tahap: formData.tahap };
    if (!body.sekolah || !body.tahun || !body.tahap) return;
    if (formMode === "add") {
      createMutation.mutate(body, { onSuccess: (record) => {
        setIsFormOpen(false);
        setSelectedRecord(record);
      } });
    } else if (formData.id) {
      updateMutation.mutate({ id: formData.id, body }, { onSuccess: () => setIsFormOpen(false) });
    }
  };

  const remove = async (record: ResponseInterface) => {
    const result = await Swal.fire({ title: "Hapus usulan rekonsiliasi?",
      text: `${record.sekolah} — ${record.tahun}. Seluruh rincian dokumen dalam usulan ini juga akan dihapus.`,
      icon: "warning", showCancelButton: true, confirmButtonText: "Hapus Usulan", cancelButtonText: "Batal" });
    if (result.isConfirmed) deleteMutation.mutate(record.id);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Usulan Rekonsiliasi Dana BOSP"
        description="Kelola usulan per sekolah, tahun, dan semester. Buka Rincian Dokumen untuk melengkapi berkas SPJ."
        action={<ActionIconButton action="add" label="Tambah Usulan" onClick={() => openForm()} />} />
      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Input className="max-w-sm" aria-label="Cari usulan" placeholder="Cari sekolah, tahun, atau status..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>Muat Ulang</Button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[#e2d9c8]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#fbf9f4] text-[#7d7152]"><tr>
              <th className="p-3">No</th><th className="p-3">Satuan Pendidikan</th><th className="p-3">Tahun</th>
              <th className="p-3">Semester</th><th className="p-3">Pencatat</th><th className="p-3">Aksi</th>
            </tr></thead>
            <tbody className="divide-y divide-[#ece5d8]">
              {isLoading ? <tr><td colSpan={6} className="p-10 text-center">Memuat usulan...</td></tr>
                : isError ? <tr><td colSpan={6} className="p-10 text-center text-rose-600">{error?.message || "Gagal memuat usulan. Silakan muat ulang."}</td></tr>
                : !List?.data.length ? <tr><td colSpan={6} className="p-10 text-center text-[#7d7152]">Belum ada usulan rekonsiliasi.</td></tr>
                : List.data.map((record, index) => <tr key={record.id} className="hover:bg-amber-50/50">
                  <td className="p-3">{(page - 1) * pageSize + index + 1}</td>
                  <td className="p-3 font-semibold">{record.sekolah || record.unit_kerja || "—"}</td>
                  <td className="p-3">{record.tahun || "—"}</td><td className="p-3">{record.tahap || "—"}</td>
                  <td className="p-3">{record.created_by || "—"}</td>
                  <td className="p-3"><div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="gold" onClick={() => setSelectedRecord(record)}>Rincian Dokumen</Button>
                    <ActionIconButton action="edit" label={`Edit Usulan: ${record.sekolah}`} onClick={() => openForm(record)} />
                    <ActionIconButton action="delete" label={`Hapus Usulan: ${record.sekolah}`} disabled={deleteMutation.isPending} onClick={() => void remove(record)} />
                  </div></td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={List?.total || 0} pageSize={pageSize} onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
      </Card>
      <FormUsulanRekonsiliasiBospModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} formMode={formMode}
        formData={formData} setFormData={setFormData} onSubmit={submit} isLoading={createMutation.isPending || updateMutation.isPending} />
      {selectedRecord && <DetailUsulanRekonsiliasiBospModal key={selectedRecord.id} isOpen onClose={() => setSelectedRecord(null)} record={selectedRecord} />}
    </div>
  );
}
