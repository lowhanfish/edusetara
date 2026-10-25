"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Modal, Select } from "../../../../_components/ui";

type GroupOption = {
  id: string;
  title: string;
  level: 1 | 2;
};

type AsnRecord = {
  id: string;
  nip: string;
  name: string;
  unit: string;
  position: string;
  groupId: string | null;
  created_at: string;
  created_by: string;
};

const INITIAL_CREATED_AT = "2026-09-17T08:00:00.000Z";
const INITIAL_CREATED_BY = "USR-SYSTEM-001";

const groups: GroupOption[] = [
  { id: "GRP-001", title: "Super Administrator", level: 1 },
  { id: "GRP-002", title: "Admin Dinas", level: 1 },
  { id: "GRP-003", title: "Operator Satuan Pendidikan", level: 2 },
  { id: "GRP-004", title: "Viewer Pimpinan", level: 1 },
];

const initialAsn: AsnRecord[] = [
  { id: "REG-001", nip: "19870412 201001 2 001", name: "Nur Aisyah, S.Pd.", unit: "Dinas Pendidikan dan Kebudayaan", position: "Analis Kebijakan", groupId: "GRP-002", created_at: INITIAL_CREATED_AT, created_by: INITIAL_CREATED_BY },
  { id: "REG-002", nip: "19821108 200604 1 004", name: "La Ode Rahmat, S.Pd.", unit: "SMP Negeri 1 Andoolo", position: "Kepala Sekolah", groupId: "GRP-004", created_at: INITIAL_CREATED_AT, created_by: INITIAL_CREATED_BY },
  { id: "REG-003", nip: "19900321 201503 2 006", name: "Wa Ode Sari, S.Pd.", unit: "SD Negeri 4 Palangga", position: "Guru Kelas", groupId: "GRP-003", created_at: INITIAL_CREATED_AT, created_by: INITIAL_CREATED_BY },
  { id: "REG-004", nip: "19850917 200902 1 003", name: "Muhammad Fajar, S.Kom.", unit: "Dinas Pendidikan dan Kebudayaan", position: "Pranata Komputer", groupId: "GRP-001", created_at: INITIAL_CREATED_AT, created_by: INITIAL_CREATED_BY },
  { id: "REG-005", nip: "19910614 201902 2 008", name: "Sri Wahyuni, S.Pd.", unit: "TK Negeri Pembina Tinanggea", position: "Guru PAUD", groupId: null, created_at: INITIAL_CREATED_AT, created_by: INITIAL_CREATED_BY },
  { id: "REG-006", nip: "19881203 201101 1 009", name: "Arman, S.Pd., M.Pd.", unit: "SMP Negeri 2 Ranomeeto", position: "Guru Mata Pelajaran", groupId: "GRP-003", created_at: INITIAL_CREATED_AT, created_by: INITIAL_CREATED_BY },
  { id: "REG-007", nip: "19920525 202012 2 012", name: "Dewi Lestari, S.Pd.", unit: "SD Negeri 2 Laeya", position: "Guru Kelas", groupId: null, created_at: INITIAL_CREATED_AT, created_by: INITIAL_CREATED_BY },
  { id: "REG-008", nip: "19840309 200801 1 005", name: "Hasanuddin, S.Pd.", unit: "Dinas Pendidikan dan Kebudayaan", position: "Pengawas Sekolah", groupId: "GRP-004", created_at: INITIAL_CREATED_AT, created_by: INITIAL_CREATED_BY },
];

const PAGE_SIZE = 5;

function getGroup(groupId: string | null) {
  return groups.find((group) => group.id === groupId) ?? null;
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function formatAuditDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Makassar",
  }).format(new Date(value));
}

export function RegistrationManagement() {
  const [records, setRecords] = useState<AsnRecord[]>(initialAsn);
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<AsnRecord | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [modalMode, setModalMode] = useState<"access" | "detail" | null>(null);
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesQuery = !normalized || [record.name, record.nip, record.unit, record.position]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
      const matchesGroup = groupFilter === "all"
        || (groupFilter === "unassigned" ? !record.groupId : record.groupId === groupFilter);
      return matchesQuery && matchesGroup;
    });
  }, [records, query, groupFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const rangeStart = filteredRecords.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredRecords.length);

  const assigned = records.filter((record) => record.groupId).length;
  const units = new Set(records.map((record) => record.unit)).size;

  const openAccess = (record: AsnRecord) => {
    setSelectedRecord(record);
    setSelectedGroupId(record.groupId ?? "");
    setModalMode("access");
  };

  const openDetail = (record: AsnRecord) => {
    setSelectedRecord(record);
    setModalMode("detail");
  };

  const saveAccess = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRecord || !selectedGroupId) return;
    setRecords((current) => current.map((record) =>
      record.id === selectedRecord.id ? { ...record, groupId: selectedGroupId } : record,
    ));
    const selectedGroup = getGroup(selectedGroupId);
    setNotice(`Akses ${selectedRecord.name} diatur sebagai “${selectedGroup?.title ?? "-"}”.`);
    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500" aria-label="Breadcrumb">
        <Link href="/admin" className="hover:text-[#1f1b4d]">Dashboard</Link><span>/</span>
        <span>Data Master</span><span>/</span><span>Auth</span><span>/</span>
        <span className="font-bold text-[#1f1b4d]">Registrasi</span>
      </nav>

      <div className="border-b border-slate-200/80 pb-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#7c5cff] text-xl shadow-sm">👤</span>
          <Badge variant="gold">Data Master · Auth</Badge>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#1f1b4d]">Registrasi Akses ASN</h1>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#6b6f8f]">
          Data ASN berasal dari SIMPEG. Modul ini hanya mengatur group dan cakupan akses; akun tidak dibuat ulang di aplikasi ini.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan registrasi ASN">
        {[
          { label: "Total ASN", value: records.length, icon: "🪪", tone: "bg-sky-50 text-sky-700" },
          { label: "Sudah Memiliki Group", value: assigned, icon: "✓", tone: "bg-emerald-50 text-emerald-700" },
          { label: "Belum Diatur", value: records.length - assigned, icon: "!", tone: "bg-rose-50 text-rose-700" },
          { label: "Satuan Pendidikan", value: units, icon: "🏫", tone: "bg-amber-50 text-amber-700" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <span className={`grid h-10 w-10 place-items-center rounded-xl text-lg font-black ${stat.tone}`}>{stat.icon}</span>
            <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p><p className="text-xl font-black text-[#1f1b4d]">{stat.value}</p></div>
          </div>
        ))}
      </section>

      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <span>✓ {notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Tutup pemberitahuan">✕</button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/70 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div><h2 className="text-sm font-extrabold text-[#1f1b4d]">Daftar ASN Terintegrasi</h2><p className="mt-0.5 text-[11px] text-slate-500">Data contoh digunakan untuk rancangan antarmuka integrasi SIMPEG.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Cari nama, NIP, atau satuan pendidikan..." className="h-9 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#7c5cff] sm:w-72" />
            <select value={groupFilter} onChange={(event) => { setGroupFilter(event.target.value); setPage(1); }} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none focus:border-[#7c5cff]">
              <option value="all">Semua Group</option><option value="unassigned">Belum Diatur</option>
              {groups.map((group) => <option key={group.id} value={group.id}>{group.title}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left">
            <thead className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <tr><th className="px-5 py-3">ASN</th><th className="px-4 py-3">NIP</th><th className="px-4 py-3">Satuan Pendidikan</th><th className="px-4 py-3">Role Group</th><th className="px-5 py-3 text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.map((record) => {
                const group = getGroup(record.groupId);
                return (
                  <tr key={record.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1f1b4d] text-xs font-black text-white">{initials(record.name)}</span><div><p className="text-sm font-bold text-[#1f1b4d]">{record.name}</p><p className="text-[10px] text-slate-500">{record.position}</p></div></div></td>
                    <td className="px-4 py-4"><code className="whitespace-nowrap rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{record.nip}</code></td>
                    <td className="px-4 py-4"><p className="max-w-56 text-xs font-semibold text-slate-700">{record.unit}</p></td>
                    <td className="px-4 py-4">{group ? <div><Badge variant={group.level === 1 ? "info" : "success"}>{group.title}</Badge><p className="mt-1 text-[9px] font-semibold text-slate-400">Level {group.level}</p></div> : <Badge variant="warning">Belum diatur</Badge>}</td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => openAccess(record)}>Atur Akses</Button><Button size="sm" variant="ghost" onClick={() => openDetail(record)}>Lihat</Button></div></td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && <tr><td colSpan={5} className="px-5 py-16 text-center text-xs text-slate-500">Data ASN tidak ditemukan.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[11px] text-slate-500">
            <span>Menampilkan {rangeStart}–{rangeEnd} dari {filteredRecords.length} hasil</span>
            <span className="mx-1.5 text-slate-300">·</span>
            <span>{records.length} total ASN</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[10px] font-semibold text-amber-700">Mode desain · belum terhubung SIMPEG/API</span>
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage === 1}
              className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-600 hover:border-slate-300 hover:text-[#1f1b4d] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ‹ Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`grid h-8 min-w-8 place-items-center rounded-lg border px-2 text-[11px] font-extrabold ${
                  currentPage === pageNumber
                    ? "border-[#1f1b4d] bg-[#1f1b4d] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#7c5cff]"
                }`}
                aria-label={`Halaman ${pageNumber}`}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage === totalPages}
              className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-600 hover:border-slate-300 hover:text-[#1f1b4d] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya ›
            </button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={modalMode === "access"}
        onClose={() => setModalMode(null)}
        title="Atur Level Akses ASN"
        description="NIP terpilih otomatis dari data SIMPEG dan tidak dapat diubah pada modul ini."
        maxWidth="md"
        footer={<><Button type="button" variant="ghost" onClick={() => setModalMode(null)}>Batal</Button><Button type="submit" form="access-form" variant="gold" disabled={!selectedGroupId}>Simpan Akses</Button></>}
      >
        {selectedRecord && (
          <form id="access-form" onSubmit={saveAccess} className="space-y-5">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#1f1b4d] text-xs font-black text-white">{initials(selectedRecord.name)}</span><div><p className="text-sm font-extrabold text-[#1f1b4d]">{selectedRecord.name}</p><p className="text-[11px] text-slate-500">{selectedRecord.unit}</p></div></div>
            <div className="grid gap-4 sm:grid-cols-2"><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">ID Registrasi</p><p className="mt-1 text-sm font-bold text-[#1f1b4d]">{selectedRecord.id}</p></div><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">NIP</p><p className="mt-1 text-sm font-bold text-[#1f1b4d]">{selectedRecord.nip}</p></div></div>
            <Select label="Role Group" value={selectedGroupId} onChange={(event) => setSelectedGroupId(event.target.value)} required helperText="Level akses mengikuti konfigurasi group yang dipilih."><option value="">— Pilih role group —</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.title} · Level {group.level}</option>)}</Select>
            {selectedGroupId && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"><strong>Cakupan:</strong> {getGroup(selectedGroupId)?.level === 1 ? "semua satuan pendidikan." : `hanya unit ${selectedRecord.unit}.`}</div>}
          </form>
        )}
      </Modal>

      <Modal isOpen={modalMode === "detail"} onClose={() => setModalMode(null)} title="Detail ASN" description="Informasi referensi akun yang diterima dari sumber data kepegawaian." maxWidth="md" footer={<Button type="button" variant="primary" onClick={() => setModalMode(null)}>Tutup</Button>}>
        {selectedRecord && <div className="space-y-5"><div className="flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#1f1b4d] text-sm font-black text-white">{initials(selectedRecord.name)}</span><div><h3 className="text-base font-extrabold text-[#1f1b4d]">{selectedRecord.name}</h3><p className="text-xs text-slate-500">{selectedRecord.position}</p></div></div><dl className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2"><div><dt className="text-[9px] font-bold uppercase tracking-wider text-slate-400">NIP</dt><dd className="mt-1 text-xs font-bold text-[#1f1b4d]">{selectedRecord.nip}</dd></div><div><dt className="text-[9px] font-bold uppercase tracking-wider text-slate-400">ID Registrasi</dt><dd className="mt-1 text-xs font-bold text-[#1f1b4d]">{selectedRecord.id}</dd></div><div className="sm:col-span-2"><dt className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Satuan Pendidikan</dt><dd className="mt-1 text-xs font-bold text-[#1f1b4d]">{selectedRecord.unit}</dd></div><div className="sm:col-span-2"><dt className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Role Group</dt><dd className="mt-1">{getGroup(selectedRecord.groupId) ? <Badge variant="info">{getGroup(selectedRecord.groupId)?.title}</Badge> : <Badge variant="warning">Belum diatur</Badge>}</dd></div><div><dt className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Dibuat pada</dt><dd className="mt-1 text-xs font-bold text-[#1f1b4d]">{formatAuditDate(selectedRecord.created_at)}</dd></div><div><dt className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Dibuat oleh</dt><dd className="mt-1 text-xs font-bold text-[#1f1b4d]">{selectedRecord.created_by}</dd></div></dl></div>}
      </Modal>
    </div>
  );
}
