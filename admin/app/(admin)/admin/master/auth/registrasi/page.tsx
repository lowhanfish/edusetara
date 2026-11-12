"use client";

import { SkeletonTableRows } from "@/app/(admin)/_components/ui/skeleton";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Modal, Select } from "../../../../_components/ui";
import { AsnRecord } from "./types";
import {
  useResponseListMaster,
  useGroupOption,
  useUpdateMaster,
} from "./hooks/crud";

const PAGE_SIZE = 5;

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatAuditDate(value: string | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Makassar",
  }).format(new Date(value));
}

export default function MasterAuthRegistrasiPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");

  // TanStack Query Hooks for live database
  const { List, isLoading } = useResponseListMaster(
    page,
    PAGE_SIZE,
    query,
    groupFilter,
  );
  const { List: groupOptions } = useGroupOption();
  const updateMutation = useUpdateMaster();

  const [selectedRecord, setSelectedRecord] = useState<AsnRecord | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [modalMode, setModalMode] = useState<"access" | "detail" | null>(null);
  const [notice, setNotice] = useState("");

  const records = useMemo(() => List?.data || [], [List]);
  const totalCount = List?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const rangeStart = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalCount);

  // Quick stats
  const assigned = records.filter((record) => record.group_id).length;
  const units = new Set(records.map((record) => record.satuan_pendidikan)).size;

  const openAccess = (record: AsnRecord) => {
    setSelectedRecord(record);
    setSelectedGroupId(record.group_id ?? "");
    setModalMode("access");
  };

  const openDetail = (record: AsnRecord) => {
    setSelectedRecord(record);
    setModalMode("detail");
  };

  const saveAccess = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRecord) return;

    updateMutation.mutate(
      {
        id: selectedRecord.id,
        body: {
          group_id: selectedGroupId || null,
        },
      },
      {
        onSuccess: () => {
          const selectedGroup = groupOptions.find((g) => g.id === selectedGroupId);
          setNotice(
            `Akses ${selectedRecord.nama_lengkap} berhasil diatur sebagai “${
              selectedGroup?.value ?? "Tidak Ada Role"
            }”.`,
          );
          setModalMode(null);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500" aria-label="Breadcrumb">
        <Link href="/admin" className="hover:text-[#2d2410]">Dashboard</Link>
        <span>/</span>
        <span>Data Master</span>
        <span>/</span>
        <span>Auth</span>
        <span>/</span>
        <span className="font-bold text-[#2d2410]">Registrasi ASN</span>
      </nav>

      <div className="border-b border-slate-200/80 pb-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f5b82e] text-xl shadow-sm">👤</span>
          <Badge variant="gold">Data Master · Auth</Badge>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#2d2410]">Registrasi Akses ASN</h1>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#7d7152]">
          Data ASN berasal dari SIMPEG. Modul ini mengatur penetapan role group dan hak akses sistem per pegawai.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan registrasi ASN">
        {[
          { label: "Total ASN", value: totalCount, icon: "🪪", tone: "bg-sky-50 text-sky-700" },
          { label: "Sudah Memiliki Group", value: assigned, icon: "✓", tone: "bg-emerald-50 text-emerald-700" },
          { label: "Belum Diatur", value: totalCount - assigned, icon: "!", tone: "bg-rose-50 text-rose-700" },
          { label: "Satuan Pendidikan", value: units, icon: "🏫", tone: "bg-amber-50 text-amber-700" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <span className={`grid h-10 w-10 place-items-center rounded-xl text-lg font-black ${stat.tone}`}>{stat.icon}</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
              <p className="text-xl font-black text-[#2d2410]">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <span>✓ {notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Tutup pemberitahuan">✕</button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/70 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#2d2410]">Daftar ASN Terintegrasi</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">Pilih atur akses untuk menetapkan role group kepada pegawai.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Cari nama, NIP, atau satuan pendidikan..."
              className="h-9 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#f5b82e] sm:w-72"
            />
            <select
              aria-label="Filter berdasarkan Role Group"
              value={groupFilter}
              onChange={(event) => {
                setGroupFilter(event.target.value);
                setPage(1);
              }}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none focus:border-[#f5b82e]"
            >
              <option value="all">Semua Group</option>
              <option value="unassigned">Belum Diatur</option>
              {groupOptions.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left">
            <thead className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">ASN</th>
                <th className="px-4 py-3">NIP</th>
                <th className="px-4 py-3">Satuan Pendidikan</th>
                <th className="px-4 py-3">Role Group</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <SkeletonTableRows cols={5} />
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-xs text-slate-500">
                    Data ASN tidak ditemukan.
                  </td>
                </tr>
              ) : (
                records.map((record) => {
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#2d2410] text-xs font-black text-white">
                            {initials(record.nama_lengkap)}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-[#2d2410]">{record.nama_lengkap}</p>
                            <p className="text-[10px] text-slate-500">{record.jabatan || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <code className="whitespace-nowrap rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                          {record.nip || "-"}
                        </code>
                      </td>
                      <td className="px-4 py-4">
                        <p className="max-w-56 text-xs font-semibold text-slate-700">
                          {record.satuan_pendidikan || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        {record.group_title ? (
                          <div>
                            <Badge variant={record.group_level === 1 ? "info" : "success"}>
                              {record.group_title}
                            </Badge>
                            <p className="mt-1 text-[9px] font-semibold text-slate-400">
                              Level {record.group_level}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="warning">Belum diatur</Badge>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openAccess(record)}>
                            Atur Akses
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openDetail(record)}>
                            Lihat
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[11px] text-slate-500">
            <span>Menampilkan {rangeStart}–{rangeEnd} dari {totalCount} hasil</span>
            <span className="mx-1.5 text-slate-300">·</span>
            <span>{totalCount} total ASN</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page === 1}
              className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-600 hover:border-slate-300 hover:text-[#2d2410] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ‹ Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`grid h-8 min-w-8 place-items-center rounded-lg border px-2 text-[11px] font-extrabold ${
                  page === pageNumber
                    ? "border-[#2d2410] bg-[#2d2410] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#f5b82e]"
                }`}
                aria-label={`Halaman ${pageNumber}`}
                aria-current={page === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={page === totalPages}
              className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-600 hover:border-slate-300 hover:text-[#2d2410] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya ›
            </button>
          </div>
        </div>
      </section>

      {/* Modal Atur Level Akses */}
      <Modal
        isOpen={modalMode === "access"}
        onClose={() => setModalMode(null)}
        title="Atur Level Akses ASN"
        description="Pilih group untuk menentukan kewenangan menu pengguna pada aplikasi admin."
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setModalMode(null)}>
              Batal
            </Button>
            <Button
              type="submit"
              form="asn-access-form"
              variant="gold"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Akses"}
            </Button>
          </>
        }
      >
        {selectedRecord && (
          <form id="asn-access-form" onSubmit={saveAccess} className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs">
              <p className="font-extrabold text-[#2d2410]">{selectedRecord.nama_lengkap}</p>
              <p className="mt-0.5 text-slate-500">NIP: {selectedRecord.nip || "-"}</p>
              <p className="mt-0.5 text-slate-500">
                {selectedRecord.satuan_pendidikan || "-"} · {selectedRecord.jabatan || "-"}
              </p>
            </div>

            <Select
              label="Pilih Role Group"
              value={selectedGroupId}
              onChange={(event) => setSelectedGroupId(event.target.value)}
              helperText="Menentukan izin Create, Read, Update, Delete dan cakupan data."
            >
              <option value="">-- Belum Diatur (Nonaktifkan Akses) --</option>
              {groupOptions.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.value}
                </option>
              ))}
            </Select>
          </form>
        )}
      </Modal>

      {/* Modal Detail ASN */}
      <Modal
        isOpen={modalMode === "detail"}
        onClose={() => setModalMode(null)}
        title="Detail Akses ASN"
        description="Ringkasan data ASN dan status akses sistem."
        footer={
          <Button type="button" variant="ghost" onClick={() => setModalMode(null)}>
            Tutup
          </Button>
        }
      >
        {selectedRecord && (
          <div className="space-y-3 text-xs">
            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Nama</p>
                <p className="text-sm font-extrabold text-[#2d2410]">{selectedRecord.nama_lengkap}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">NIP</p>
                  <p className="font-mono text-slate-600">{selectedRecord.nip || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Jabatan</p>
                  <p className="text-slate-600">{selectedRecord.jabatan || "-"}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Satuan Pendidikan</p>
                <p className="text-slate-600">{selectedRecord.satuan_pendidikan || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Status Role Group</p>
                <p className="text-slate-600">
                  {selectedRecord.group_title ? (
                    <span className="font-semibold text-emerald-700">
                      {selectedRecord.group_title} (Level {selectedRecord.group_level})
                    </span>
                  ) : (
                    <span className="text-amber-600 italic">Belum ditentukan</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Waktu Terdaftar</p>
                <p className="font-mono text-slate-500">{formatAuditDate(selectedRecord.created_at)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
