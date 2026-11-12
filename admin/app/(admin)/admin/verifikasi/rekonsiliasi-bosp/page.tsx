"use client";


import { SkeletonTableRows } from "@/app/(admin)/_components/ui/skeleton";

import React, { useEffect, useState } from "react";
import { Button, Card, Input, PageHeader, Pagination } from "@/app/(admin)/_components/ui";
import { useAuthStore } from "@/store/useAuthStore";
import { ResponseInterface } from "../../usulan/rekonsiliasi-bosp/types";
import DetailUsulanRekonsiliasiBospModal from "../../usulan/rekonsiliasi-bosp/components/DetailUsulanRekonsiliasiBospModal";
import { useUsulanForVerification } from "./hooks/crud";

export default function VerifikasiRekonsiliasiBospPage() {
  const role = useAuthStore((state) => state.user?.role);
  const authLoading = useAuthStore((state) => state.isLoading);
  const canVerify = role === "admin" || role === "superadmin";
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState<ResponseInterface | null>(null);
  const proposals = useUsulanForVerification(page, pageSize, debouncedSearch, canVerify);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  if (authLoading) return <p className="p-6 text-sm">Memuat akses pengguna...</p>;
  if (!canVerify) return <Card className="p-6"><p role="alert" className="text-sm text-rose-700">Halaman verifikasi rekonsiliasi BOSP hanya dapat diakses oleh admin.</p></Card>;

  return (
    <div className="space-y-6">
      <PageHeader title="Verifikasi Rekonsiliasi Dana BOSP"
        description="Periksa lampiran usulan kepala sekolah dan tetapkan Cek Benar serta Cek Lengkap untuk setiap dokumen." />
      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Input className="max-w-sm" aria-label="Cari usulan verifikasi" placeholder="Cari sekolah, tahun, atau status..."
            value={search} onChange={(event) => setSearch(event.target.value)} />
          <Button variant="outline" disabled={proposals.isFetching} onClick={() => proposals.refetch()}>Muat Ulang</Button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[#e2d9c8]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#fbf9f4] text-[#7d7152]"><tr>
              <th className="p-3">No</th><th className="p-3">Satuan Pendidikan</th><th className="p-3">Tahun</th>
              <th className="p-3">Semester</th><th className="p-3">Pengusul</th><th className="p-3">Pemeriksaan</th>
            </tr></thead>
            <tbody className="divide-y divide-[#ece5d8]">
              {proposals.isLoading ? <SkeletonTableRows cols={6} />
                : proposals.isError ? <tr><td colSpan={6} role="alert" className="p-10 text-center text-rose-600">{proposals.error?.message || "Gagal memuat usulan. Silakan muat ulang."}</td></tr>
                : !proposals.data?.data.length ? <tr><td colSpan={6} className="p-10 text-center text-[#7d7152]">Belum ada usulan rekonsiliasi untuk diperiksa.</td></tr>
                : proposals.data.data.map((record, index) => <tr key={record.id} className="hover:bg-amber-50/50">
                  <td className="p-3">{(page - 1) * pageSize + index + 1}</td>
                  <td className="p-3 font-semibold">{record.sekolah || record.unit_kerja || "—"}</td>
                  <td className="p-3">{record.tahun || "—"}</td><td className="p-3">{record.tahap || "—"}</td>
                  <td className="p-3">{record.created_by || "—"}</td>
                  <td className="p-3"><Button size="sm" variant="gold" onClick={() => setSelectedRecord(record)}>Periksa Dokumen</Button></td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={proposals.data?.total || 0} pageSize={pageSize} onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />
      </Card>
      {selectedRecord && <DetailUsulanRekonsiliasiBospModal key={selectedRecord.id} isOpen verification
        onClose={() => setSelectedRecord(null)} record={selectedRecord} />}
    </div>
  );
}
