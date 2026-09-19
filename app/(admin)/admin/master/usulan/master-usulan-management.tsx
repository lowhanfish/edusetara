"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Input, Modal, Textarea } from "../../../_components/ui";

export type MasterUsulanKind = "triwulan" | "jenis-penerima" | "kelas-penerima";

type MasterRecord = {
  id: string;
  title: string;
  desc: string;
  created_at: string;
  created_by: string;
};

type ModuleConfig = {
  title: string;
  itemLabel: string;
  description: string;
  icon: string;
  prefix: string;
  titlePlaceholder: string;
  descPlaceholder: string;
  records: MasterRecord[];
};

const INITIAL_CREATED_AT = "2026-09-17T08:00:00.000Z";
const INITIAL_CREATED_BY = "USR-SYSTEM-001";
const CURRENT_USER_ID = "USR-ADMIN-001";
const PAGE_SIZE = 5;

function record(id: string, title: string, desc: string): MasterRecord {
  return { id, title, desc, created_at: INITIAL_CREATED_AT, created_by: INITIAL_CREATED_BY };
}

const moduleConfigs: Record<MasterUsulanKind, ModuleConfig> = {
  triwulan: {
    title: "Triwulan",
    itemLabel: "periodisasi",
    description: "Master tetap jadwal periodisasi pencairan atau penyaluran tunjangan guru setiap tiga bulan.",
    icon: "📅",
    prefix: "TRW",
    titlePlaceholder: "Contoh: Triwulan I",
    descPlaceholder: "Jelaskan bulan periode dan perkiraan waktu pencairannya.",
    records: [
      record("TRW-001", "Triwulan I", "Periode pembayaran bulan Januari, Februari, dan Maret. Pencairan biasanya dimulai sekitar bulan Maret."),
      record("TRW-002", "Triwulan II", "Periode pembayaran bulan April, Mei, dan Juni. Pencairan biasanya dimulai sekitar bulan Juni."),
      record("TRW-003", "Triwulan III", "Periode pembayaran bulan Juli, Agustus, dan September. Pencairan biasanya dimulai sekitar bulan September."),
      record("TRW-004", "Triwulan IV", "Periode pembayaran bulan Oktober, November, dan Desember. Pencairan biasanya dimulai sekitar bulan November."),
    ],
  },
  "jenis-penerima": {
    title: "Jenis Penerima",
    itemLabel: "jenis penerimaan",
    description: "Master jenis tunjangan atau tambahan penghasilan resmi bagi guru dari Kemendikdasmen maupun Kementerian Agama.",
    icon: "👥",
    prefix: "JPN",
    titlePlaceholder: "Contoh: Tunjangan Profesi Guru (TPG)",
    descPlaceholder: "Jelaskan definisi dan sasaran penerimaan secara singkat.",
    records: [
      record("JPN-001", "Tunjangan Profesi Guru (TPG)", "Tunjangan bagi guru bersertifikat pendidik sebagai penghargaan atas profesionalitasnya. Sasaran: guru ASN maupun Non-ASN yang telah lulus sertifikasi."),
      record("JPN-002", "Tunjangan Khusus Guru (TKG)", "Tunjangan bagi guru yang bertugas di daerah khusus, termasuk wilayah terpencil, tertinggal, terluar, atau perbatasan."),
      record("JPN-003", "Tambahan Penghasilan (TAMSIL)", "Tambahan penghasilan di luar gaji pokok bagi guru ASN yang belum memiliki sertifikat pendidik."),
      record("JPN-004", "Tamsil Khusus Pendidikan Agama / Bantuan Insentif Guru Agama", "Tambahan atau insentif bagi guru pendidikan agama Non-ASN yang belum bersertifikasi, termasuk Guru PAI atau guru madrasah di bawah Kementerian Agama."),
    ],
  },
  "kelas-penerima": {
    title: "Kelas Penerima",
    itemLabel: "kelas penerima",
    description: "Master jabatan fungsional atau profesi pendidik yang menjadi sasaran tunjangan dan tambahan penghasilan.",
    icon: "🏷️",
    prefix: "KPN",
    titlePlaceholder: "Contoh: Guru",
    descPlaceholder: "Jelaskan jabatan atau profesi sasaran penerima.",
    records: [
      record("KPN-001", "Guru", "Pendidik profesional yang tugas utamanya mendidik, mengajar, membimbing, dan mengevaluasi peserta didik di kelas."),
      record("KPN-002", "Kepala Sekolah", "Guru yang diberi tugas tambahan untuk memimpin, mengelola, dan mengawasi seluruh kegiatan di satuan pendidikan."),
      record("KPN-003", "Pengawas", "Guru ASN dalam jabatan fungsional yang melakukan pengawasan akademik dan manajerial pada satuan pendidikan binaannya."),
    ],
  },
};

function formatAuditDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Makassar",
  }).format(new Date(value));
}

function nextId(records: MasterRecord[], prefix: string) {
  const highest = records.reduce(
    (value, item) => Math.max(value, Number(item.id.replace(`${prefix}-`, "")) || 0),
    0,
  );
  return `${prefix}-${String(highest + 1).padStart(3, "0")}`;
}

export function MasterUsulanManagement({ kind }: { kind: MasterUsulanKind }) {
  const config = moduleConfigs[kind];
  const [records, setRecords] = useState<MasterRecord[]>(config.records);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return records;
    return records.filter((item) => [item.id, item.title, item.desc]
      .join(" ")
      .toLowerCase()
      .includes(normalized));
  }, [query, records]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleRecords = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const rangeStart = filteredRecords.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredRecords.length);

  const openAdd = () => {
    setEditingId(null);
    setTitle("");
    setDesc("");
    setError("");
    setIsModalOpen(true);
  };

  const openEdit = (item: MasterRecord) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDesc(item.desc);
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanDesc = desc.trim();
    if (!cleanTitle || !cleanDesc) return;

    const duplicate = records.some((item) =>
      item.id !== editingId && item.title.trim().toLowerCase() === cleanTitle.toLowerCase(),
    );
    if (duplicate) {
      setError(`Nama ${config.itemLabel} sudah digunakan.`);
      return;
    }

    if (editingId) {
      setRecords((current) => current.map((item) =>
        item.id === editingId ? { ...item, title: cleanTitle, desc: cleanDesc } : item,
      ));
      setNotice(`${config.title} “${cleanTitle}” berhasil diperbarui pada simulasi tampilan.`);
    } else {
      setRecords((current) => [
        ...current,
        {
          id: nextId(current, config.prefix),
          title: cleanTitle,
          desc: cleanDesc,
          created_at: new Date().toISOString(),
          created_by: CURRENT_USER_ID,
        },
      ]);
      setNotice(`${config.title} “${cleanTitle}” berhasil ditambahkan pada simulasi tampilan.`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (item: MasterRecord) => {
    if (!window.confirm(`Hapus ${config.itemLabel} “${item.title}”?`)) return;
    setRecords((current) => current.filter((recordItem) => recordItem.id !== item.id));
    setNotice(`${config.title} “${item.title}” dihapus dari simulasi tampilan.`);
  };

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500" aria-label="Breadcrumb">
        <Link href="/admin" className="hover:text-[#052552]">Dashboard</Link><span>/</span>
        <span>Data Master</span><span>/</span><span>Master Usulan</span><span>/</span>
        <span className="font-bold text-[#052552]">{config.title}</span>
      </nav>

      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ffc400] text-xl shadow-sm">{config.icon}</span>
            <Badge variant="gold">Data Master · Usulan</Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#052552]">{config.title}</h1>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#58708d]">{config.description}</p>
        </div>
        <Button type="button" variant="gold" onClick={openAdd}>＋ Tambah {config.title}</Button>
      </div>

      <section className="grid gap-3 sm:grid-cols-3" aria-label={`Ringkasan ${config.title}`}>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Data</p><p className="mt-1 text-2xl font-black text-[#052552]">{records.length}</p></div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jenis Master</p><p className="mt-1 text-sm font-extrabold text-[#052552]">Master Tetap</p></div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pengelolaan</p><p className="mt-1 text-sm font-extrabold text-[#052552]">Tambah · Edit · Hapus</p></div>
      </section>

      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <span>✓ {notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Tutup pemberitahuan">✕</button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-sm font-extrabold text-[#052552]">Daftar {config.title}</h2><p className="mt-0.5 text-[11px] text-slate-500">Data acuan yang digunakan pada proses usulan tunjangan guru.</p></div>
          <input
            type="search"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }}
            placeholder={`Cari ${config.itemLabel}...`}
            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#ffc400] sm:w-72"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <tr><th className="px-5 py-3">Nama</th><th className="px-4 py-3">Penjelasan</th><th className="px-4 py-3">Dibuat</th><th className="px-5 py-3 text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRecords.map((item) => (
                <tr key={item.id} className="align-top hover:bg-slate-50/70">
                  <td className="px-5 py-4"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff7d6] text-base">{config.icon}</span><div><p className="text-sm font-bold text-[#052552]">{item.title}</p><p className="mt-0.5 text-[10px] font-semibold text-slate-400">{item.id}</p></div></div></td>
                  <td className="max-w-xl px-4 py-4"><p className="text-xs leading-relaxed text-slate-600">{item.desc}</p></td>
                  <td className="whitespace-nowrap px-4 py-4"><p className="text-[11px] font-semibold text-slate-600">{formatAuditDate(item.created_at)}</p><p className="mt-1 text-[9px] text-slate-400">{item.created_by}</p></td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2"><Button type="button" size="sm" variant="outline" onClick={() => openEdit(item)}>Edit</Button><Button type="button" size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(item)}>Hapus</Button></div></td>
                </tr>
              ))}
              {filteredRecords.length === 0 && <tr><td colSpan={4} className="px-5 py-16 text-center text-xs text-slate-500">Data {config.itemLabel} tidak ditemukan.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-slate-500">Menampilkan {rangeStart}–{rangeEnd} dari {filteredRecords.length} data</p>
          <div className="flex items-center gap-2">
            <span className="mr-1 text-[10px] font-semibold text-amber-700">Mode desain · belum terhubung API</span>
            <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">‹</button>
            <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-[#052552] px-2 text-[11px] font-extrabold text-white">{currentPage}/{totalPages}</span>
            <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">›</button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${editingId ? "Edit" : "Tambah"} ${config.title}`}
        description="ID dan metadata pembuatan diisi otomatis oleh backend."
        maxWidth="md"
        footer={<><Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button><Button type="submit" form="master-usulan-form" variant="gold">{editingId ? "Simpan Perubahan" : `Tambah ${config.title}`}</Button></>}
      >
        <form id="master-usulan-form" onSubmit={handleSubmit} className="space-y-5">
          {editingId && <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ID Data</p><p className="mt-1 text-sm font-extrabold text-[#052552]">{editingId}</p></div>}
          <Input label={`Nama ${config.title}`} value={title} onChange={(event) => { setTitle(event.target.value); setError(""); }} placeholder={config.titlePlaceholder} error={error} required autoFocus />
          <Textarea label="Penjelasan Singkat" value={desc} onChange={(event) => setDesc(event.target.value)} placeholder={config.descPlaceholder} helperText="Gunakan penjelasan ringkas dan mudah dipahami oleh operator." rows={5} required />
        </form>
      </Modal>
    </div>
  );
}
