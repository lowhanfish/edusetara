"use client";

import { AdminPageSkeleton } from "@/app/(admin)/_components/admin-page-skeleton";

import { SkeletonTableRows } from "@/app/(admin)/_components/ui/skeleton";

import React, { useEffect, useState } from "react";
import { Button, Card, Input, PageHeader, Pagination } from "@/app/(admin)/_components/ui";
import { useAuthStore } from "@/store/useAuthStore";
import { ResponseInterface } from "../../usulan/tunjangan-guru/types";
import { useTriwulanOption, useJenisPenerimaOption } from "../../usulan/tunjangan-guru/hooks/crud";
import FormVerifikasiTunjanganGuruModal from "./components/FormVerifikasiTunjanganGuruModal";
import { useUsulanForVerification } from "./hooks/crud";

export default function VerifikasiTunjanganGuruPage() {
  const role = useAuthStore((state) => state.user?.role);
  const authLoading = useAuthStore((state) => state.isLoading);
  const canVerify = role === "admin" || role === "superadmin";
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState<ResponseInterface | null>(null);
  const proposals = useUsulanForVerification(page, pageSize, debouncedSearch, canVerify);
  const triwulan = useTriwulanOption();
  const jenis = useJenisPenerimaOption();
  const label = (options: { id: string; value: string }[], value: string | null) => options.find((item) => item.id === value || item.value === value)?.value || value || "—";
  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [search]);
  if (authLoading) return <AdminPageSkeleton />;
  if (!canVerify) return <Card className="p-6"><p role="alert" className="text-sm text-rose-700">Halaman verifikasi tunjangan guru hanya dapat diakses oleh admin.</p></Card>;
  return (
    <div className="space-y-6">
      <PageHeader title="Verifikasi Usulan Tunjangan Guru" description="Periksa usulan pengguna, tetapkan status, dan berikan catatan hasil pemeriksaan." />
      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Input className="max-w-sm" aria-label="Cari usulan verifikasi" placeholder="Cari satuan pendidikan atau NIP..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <Button variant="outline" disabled={proposals.isFetching} onClick={() => proposals.refetch()}>Muat Ulang</Button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[#e2d9c8]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#fbf9f4] text-[#7d7152]"><tr>
              <th className="p-3">No</th><th className="p-3">Satuan Pendidikan / NIP</th><th className="p-3">Triwulan</th>
              <th className="p-3">Jenis Tunjangan</th><th className="p-3">Hasil Verifikasi</th><th className="p-3">Pemeriksaan</th>
            </tr></thead>
            <tbody className="divide-y divide-[#ece5d8]">
              {proposals.isLoading ? <SkeletonTableRows cols={6} />
                : proposals.isError ? <tr><td colSpan={6} role="alert" className="p-10 text-center text-rose-600">{proposals.error?.message || "Gagal memuat usulan. Silakan muat ulang."}</td></tr>
                : !proposals.data?.data.length ? <tr><td colSpan={6} className="p-10 text-center text-[#7d7152]">Belum ada usulan tunjangan guru untuk diperiksa.</td></tr>
                : proposals.data.data.map((record, index) => <tr key={record.id} className="hover:bg-amber-50/50">
                  <td className="p-3">{(page - 1) * pageSize + index + 1}</td>
                  <td className="p-3"><p className="font-semibold">{record.unit_kerja || "—"}</p><p className="mt-1 text-[#7d7152]">{record.nip || record.created_by || "—"}</p></td>
                  <td className="p-3">{label(triwulan.options, record.triwulan_id)}</td>
                  <td className="p-3">{label(jenis.options, record.jenis_id)}</td>
                  <td className="p-3 min-w-44"><p className="font-semibold">{record.status_verifikasi || "Menunggu"}</p><p className="mt-1 text-[#7d7152] whitespace-pre-wrap">{record.catatan || "Belum ada catatan"}</p></td>
                  <td className="p-3"><Button size="sm" variant="gold" onClick={() => setSelectedRecord(record)}>Periksa Usulan</Button></td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={proposals.data?.total || 0} pageSize={pageSize} onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
      </Card>
      {selectedRecord && <FormVerifikasiTunjanganGuruModal key={selectedRecord.id} record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  );
}
