"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AutoComplete,
  Badge,
  Button,
  Card,
  DateInput,
  FileInput,
  Input,
  Modal,
  PageHeader,
  Pagination,
  Select,
  SkeletonCard,
  SkeletonTable,
  SkeletonText,
} from "../../_components/ui";

interface SampleSchool {
  id: string;
  npsn: string;
  name: string;
  district: string;
}

const SAMPLE_SCHOOLS: SampleSchool[] = [
  { id: "1", npsn: "40402101", name: "SDN 2 BUKE", district: "Kec. Buke" },
  { id: "2", npsn: "40402102", name: "SDN 1 BAULA", district: "Kec. Baula" },
  { id: "3", npsn: "40402103", name: "SDN 5 PALANGGA SELATAN", district: "Kec. Palangga Selatan" },
  { id: "4", npsn: "40402104", name: "SDN 3 LAEYA", district: "Kec. Laeya" },
  { id: "5", npsn: "40402105", name: "SD-SMPN SATAP 16 KONSEL", district: "Kec. Kolono" },
  { id: "6", npsn: "40402106", name: "SMPN 1 KONAWE SELATAN", district: "Kec. Andoolo" },
  { id: "7", npsn: "40402107", name: "SMPN 2 ANDOOLO", district: "Kec. Andoolo" },
];

/**
 * Komponen Kotak Kode dengan Kontras Tinggi (Font Terang di atas Latar Gelap)
 * Dilengkapi tombol salin kode ke clipboard.
 */
function CodeBox({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/20 bg-[#0d1117] shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#161b22]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          {filename && (
            <span className="text-[11px] font-mono text-[#a5d6ff] font-semibold pl-1.5">
              {filename}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-[#f0f6fc] border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
        >
          {copied ? "✓ Tersalin!" : "📋 Salin Kode"}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-[#f0f6fc] overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DokumentasiKomponenPage() {
  // Accordion State: menyimpan id komponen yang sedang terbuka (dropdown)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    pagination: true, // Default hanya paginasi yang terbuka
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    setOpenSections({
      architecture: true,
      pagination: true,
      autocomplete: true,
      input: true,
      datefile: true,
      modal: true,
      badgebutton: true,
      skeleton: true,
      table: true,
    });
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  // Demo State: Modal
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Demo State: Pagination
  const [demoPage, setDemoPage] = useState(1);
  const [demoPageSize, setDemoPageSize] = useState(5);
  const [demoTotal] = useState(48);

  // Demo State: AutoComplete
  const [selectedSchool, setSelectedSchool] = useState<SampleSchool | null>(SAMPLE_SCHOOLS[0]);

  // Demo State: Input & Select
  const [demoInput, setDemoInput] = useState("Dinas Pendidikan Konawe Selatan");
  const [demoSelect, setDemoSelect] = useState("SD");
  const [demoHasError, setDemoHasError] = useState(false);

  // Demo State: DateInput & FileInput
  const [demoDate, setDemoDate] = useState("2026-10-31");
  const [demoFileName, setDemoFileName] = useState("lampiran_kbm_tematik.jpg");

  // Demo State: Skeleton Loading
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const triggerSkeletonReload = () => {
    setIsLoadingDemo(true);
    setTimeout(() => setIsLoadingDemo(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#7d7152] font-medium">
        <Link href="/admin" className="hover:text-[#2d2410] transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-[#2d2410] font-semibold">Dokumentasi UI</span>
      </nav>

      {/* 2. PageHeader */}
      <PageHeader
        title="Katalog & Dokumentasi Komponen UI"
        description="Pustaka komponen reusable terstandarisasi untuk modul admin EduSetara. Klik nama komponen untuk membuka panduan dan live preview interaktif."
        badge={<Badge variant="gold">Design System V2</Badge>}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              ▼ Buka Semua
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              ▲ Tutup Semua
            </Button>
          </div>
        }
      />

      {/* Daftar Komponen dalam Sistem Dropdown / Accordion */}
      <div className="space-y-5 sm:space-y-6">
        {/* ========================================================
            ITEM 1: Standar Struktur Modul Admin (Clean Architecture)
           ======================================================== */}
        <Card className="border border-white/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection("architecture")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-lg shadow-2xs font-bold">
                📁
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#2d2410]">
                    Standar Struktur Modul Admin (Pola e-office2026)
                  </h3>
                  <Badge variant="gold">Rekomendasi</Badge>
                </div>
                <p className="text-xs text-[#7d7152] mt-0.5 line-clamp-1">
                  Arsitektur berkas terpisah (types.ts, components/FormModal, page.tsx) agar kode rapi dan modular.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-xs font-semibold text-[#7d7152] hidden sm:inline">
                {openSections["architecture"] ? "Tutup" : "Buka"}
              </span>
              <span
                className={`w-7 h-7 rounded-xl bg-white/60 border border-white/70 flex items-center justify-center text-xs font-bold text-[#2d2410] transition-transform duration-200 ${
                  openSections["architecture"] ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </button>

          {openSections["architecture"] && (
            <div className="p-5 sm:p-6 border-t border-[#2d2410]/15 space-y-4 bg-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <h4 className="font-bold text-[#2d2410] text-sm">
                    Pohon Berkas Modular Per Modul:
                  </h4>
                  <CodeBox
                    filename="Struktur Berkas"
                    code={`app/(admin)/admin/{nama-modul}/
├── types.ts              # Schema & Interface data TypeScript
├── data.ts               # Data dummy awal (opsional)
├── components/
│   ├── FormModal.tsx     # Modal Formulir Tambah/Edit
│   └── DetailModal.tsx   # Modal Pratinjau / Cetak
└── page.tsx              # Orchestrator ramping (<250 baris)`}
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white/60 border border-white/70 space-y-2.5">
                  <h4 className="font-bold text-[#2d2410] text-sm">
                    Prinsip Desain & Komponen:
                  </h4>
                  <ul className="space-y-2 text-[#7d7152] list-disc list-inside leading-relaxed text-xs">
                    <li>
                      <strong className="text-[#2d2410]">Tabel Native Semantik:</strong>{" "}
                      Gunakan tag HTML <code>table</code>, <code>thead</code>, <code>tbody</code>,{" "}
                      <code>tr</code>, <code>th</code>, <code>td</code> dengan persentase lebar kolom tegas (<code>w-[5%]</code>, <code>w-[20%]</code>).
                    </li>
                    <li>
                      <strong className="text-[#2d2410]">Satu Kartu Kaca Terpadu:</strong>{" "}
                      Gabungkan toolbar filter dan tabel ke dalam satu wadah <code>&lt;Card&gt;</code> dengan garis pemisah <code>border-b border-[#2d2410]/15</code>.
                    </li>
                    <li>
                      <strong className="text-[#2d2410]">Paginasi Mandiri:</strong>{" "}
                      Paginasi memotong data secara dinamis dan menyediakan pemilih baris per halaman.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ========================================================
            ITEM 2: Komponen Pagination
           ======================================================== */}
        <Card className="border border-white/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection("pagination")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-lg shadow-2xs font-bold">
                🔢
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#2d2410]">
                    Pagination (Paginasi Terpadu & Limit Baris)
                  </h3>
                  <Badge variant="neutral"><code>pagination.tsx</code></Badge>
                </div>
                <p className="text-xs text-[#7d7152] mt-0.5 line-clamp-1">
                  Navigasi halaman dinamis, batas data per halaman (page size), ellipsis cerdas, dan info ringkasan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-xs font-semibold text-[#7d7152] hidden sm:inline">
                {openSections["pagination"] ? "Tutup" : "Buka"}
              </span>
              <span
                className={`w-7 h-7 rounded-xl bg-white/60 border border-white/70 flex items-center justify-center text-xs font-bold text-[#2d2410] transition-transform duration-200 ${
                  openSections["pagination"] ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </button>

          {openSections["pagination"] && (
            <div className="p-5 sm:p-6 border-t border-[#2d2410]/15 space-y-4 bg-white/20">
              <div className="p-4 rounded-2xl bg-white/40 border border-white/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a89b7b] block mb-3">
                  ⚡ Live Preview Interaktif:
                </span>
                <Pagination
                  page={demoPage}
                  onPageChange={setDemoPage}
                  pageSize={demoPageSize}
                  onPageSizeChange={setDemoPageSize}
                  total={demoTotal}
                  pageSizeOptions={[5, 10, 20, 50]}
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#2d2410]">
                  Contoh Penggunaan Komponen:
                </span>
                <CodeBox
                  filename="ContohPagination.tsx"
                  code={`import { useState, useMemo } from "react";
import { Pagination } from "@/components/ui";

export default function MyTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalData = 48;

  // Potong data sesuai halaman aktif
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allData.slice(start, start + pageSize);
  }, [allData, page, pageSize]);

  return (
    <div>
      {/* Tabel Data */}
      <table>...</table>

      {/* Paginasi di Bagian Bawah */}
      <Pagination
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        total={totalData}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </div>
  );
}`}
                />
              </div>
            </div>
          )}
        </Card>

        {/* ========================================================
            ITEM 3: Komponen AutoComplete
           ======================================================== */}
        <Card className="border border-white/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection("autocomplete")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-lg shadow-2xs font-bold">
                🔍
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#2d2410]">
                    AutoComplete (Search-as-you-type Combobox)
                  </h3>
                  <Badge variant="neutral"><code>autocomplete.tsx</code></Badge>
                </div>
                <p className="text-xs text-[#7d7152] mt-0.5 line-clamp-1">
                  Pencarian data relasi (sekolah, guru, NIP) dengan navigasi keyboard panah, highlight opsi, dan tombol reset.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-xs font-semibold text-[#7d7152] hidden sm:inline">
                {openSections["autocomplete"] ? "Tutup" : "Buka"}
              </span>
              <span
                className={`w-7 h-7 rounded-xl bg-white/60 border border-white/70 flex items-center justify-center text-xs font-bold text-[#2d2410] transition-transform duration-200 ${
                  openSections["autocomplete"] ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </button>

          {openSections["autocomplete"] && (
            <div className="p-5 sm:p-6 border-t border-[#2d2410]/15 space-y-4 bg-white/20">
              <div className="p-4 rounded-2xl bg-white/40 border border-white/80 max-w-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a89b7b] block mb-3">
                  ⚡ Live Preview Interaktif:
                </span>
                <AutoComplete<SampleSchool>
                  label="Pilih Satuan Pendidikan (Sekolah)"
                  placeholder="Ketik nama sekolah atau NPSN..."
                  options={SAMPLE_SCHOOLS}
                  getOptionLabel={(s) => `${s.name} (${s.npsn})`}
                  getOptionDescription={(s) => s.district}
                  value={selectedSchool}
                  onChange={setSelectedSchool}
                />

                {selectedSchool && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-400/15 border border-amber-300/40 text-xs text-[#2d2410]">
                    <strong>Sekolah Terpilih:</strong> {selectedSchool.name} • NPSN:{" "}
                    {selectedSchool.npsn} • {selectedSchool.district}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#2d2410]">
                  Contoh Penggunaan Komponen:
                </span>
                <CodeBox
                  filename="ContohAutoComplete.tsx"
                  code={`import { useState } from "react";
import { AutoComplete } from "@/components/ui";

interface School {
  id: string;
  name: string;
  npsn: string;
  district: string;
}

export default function MyForm() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  return (
    <AutoComplete<School>
      label="Pilih Satuan Pendidikan"
      placeholder="Ketik nama sekolah..."
      options={schoolsList}
      getOptionLabel={(s) => \`\${s.name} (\${s.npsn})\`}
      getOptionDescription={(s) => s.district}
      value={selectedSchool}
      onChange={setSelectedSchool}
    />
  );
}`}
                />
              </div>
            </div>
          )}
        </Card>

        {/* ========================================================
            ITEM 4: Form Input & Select
           ======================================================== */}
        <Card className="border border-white/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection("input")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-lg shadow-2xs font-bold">
                ✍️
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#2d2410]">
                    Form Input & Select (Label, Validation & Error State)
                  </h3>
                  <Badge variant="neutral"><code>input.tsx & select.tsx</code></Badge>
                </div>
                <p className="text-xs text-[#7d7152] mt-0.5 line-clamp-1">
                  Kontrol input dan dropdown terintegrasi dengan label bawaan, status error, dan helper text.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-xs font-semibold text-[#7d7152] hidden sm:inline">
                {openSections["input"] ? "Tutup" : "Buka"}
              </span>
              <span
                className={`w-7 h-7 rounded-xl bg-white/60 border border-white/70 flex items-center justify-center text-xs font-bold text-[#2d2410] transition-transform duration-200 ${
                  openSections["input"] ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </button>

          {openSections["input"] && (
            <div className="p-5 sm:p-6 border-t border-[#2d2410]/15 space-y-4 bg-white/20">
              <div className="p-4 rounded-2xl bg-white/40 border border-white/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#a89b7b]">
                    ⚡ Live Preview Form:
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDemoHasError(!demoHasError)}
                  >
                    {demoHasError ? "Matikan Status Error" : "Simulasikan Status Error"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nama Instansi Pendidikan"
                    required
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    placeholder="Masukkan nama instansi..."
                    error={demoHasError ? "Nama instansi tidak boleh kosong!" : undefined}
                    helperText="Nama resmi satuan pendidikan yang tercatat pada Dapodik."
                  />

                  <Select
                    label="Jenjang Pendidikan"
                    required
                    value={demoSelect}
                    onChange={(e) => setDemoSelect(e.target.value)}
                    error={demoHasError ? "Silakan pilih jenjang pendidikan!" : undefined}
                    options={[
                      { value: "PAUD", label: "PAUD / TK" },
                      { value: "SD", label: "Sekolah Dasar (SD)" },
                      { value: "SMP", label: "Sekolah Menengah Pertama (SMP)" },
                      { value: "PKBM", label: "Pusat Kegiatan Belajar Masyarakat (PKBM)" },
                    ]}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#2d2410]">
                  Contoh Penggunaan Komponen:
                </span>
                <CodeBox
                  filename="ContohInputSelect.tsx"
                  code={`import { Input, Select } from "@/components/ui";

<Input
  label="Nama Lengkap Guru"
  required
  value={form.nama}
  onChange={(e) => setForm({ ...form, nama: e.target.value })}
  placeholder="Contoh: Ibu Sri Wahyuni, S.Pd"
  error={errors.nama}
/>

<Select
  label="Status Kepegawaian"
  required
  value={form.status}
  onChange={(e) => setForm({ ...form, status: e.target.value })}
  options={[
    { value: "PNS", label: "Pegawai Negeri Sipil (PNS)" },
    { value: "PPPK", label: "PPPK" },
    { value: "HONORER", label: "Guru Honorer Daerah" },
  ]}
/>`}
                />
              </div>
            </div>
          )}
        </Card>

        {/* ========================================================
            ITEM 5: DateInput & FileInput (Pilih Tanggal & Upload Berkas)
           ======================================================== */}
        <Card className="border border-white/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection("datefile")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-lg shadow-2xs font-bold">
                📅
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#2d2410]">
                    DateInput & FileInput (Pemilihan Tanggal & Upload Berkas)
                  </h3>
                  <Badge variant="neutral"><code>date-input.tsx & file-input.tsx</code></Badge>
                </div>
                <p className="text-xs text-[#7d7152] mt-0.5 line-clamp-1">
                  Input tanggal ber-ikon kalender dengan pintasan &quot;Hari Ini&quot;, serta dropzone upload berkas drag-and-drop.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-xs font-semibold text-[#7d7152] hidden sm:inline">
                {openSections["datefile"] ? "Tutup" : "Buka"}
              </span>
              <span
                className={`w-7 h-7 rounded-xl bg-white/60 border border-white/70 flex items-center justify-center text-xs font-bold text-[#2d2410] transition-transform duration-200 ${
                  openSections["datefile"] ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </button>

          {openSections["datefile"] && (
            <div className="p-5 sm:p-6 border-t border-[#2d2410]/15 space-y-4 bg-white/20">
              <div className="p-4 rounded-2xl bg-white/40 border border-white/80 space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a89b7b] block">
                  ⚡ Live Preview Interaktif:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DateInput
                    label="Tanggal Pelaksanaan KBM / Agenda"
                    required
                    value={demoDate}
                    onChange={setDemoDate}
                    helperText="Pilih tanggal dari kalender atau klik pintasan 'Hari Ini'."
                  />

                  <FileInput
                    label="Berkas Dokumentasi Foto / SK"
                    required
                    value={demoFileName}
                    accept="image/*,.pdf"
                    onChange={(name) => setDemoFileName(name)}
                    helperText="Mendukung seret & lepas (drag-and-drop) berkas gambar JPG/PNG atau PDF."
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-400/15 border border-amber-300/40 text-xs text-[#2d2410] flex items-center justify-between">
                  <span>
                    <strong>Nilai Terpilih:</strong> Tanggal: <code>{demoDate || "(kosong)"}</code> | Berkas: <code>{demoFileName || "(kosong)"}</code>
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#2d2410]">
                  Contoh Penggunaan Komponen:
                </span>
                <CodeBox
                  filename="ContohDateFileInput.tsx"
                  code={`import { DateInput, FileInput } from "@/components/ui";

// 1. Input Pemilihan Tanggal
<DateInput
  label="Tanggal Pelaksanaan"
  required
  value={form.tgl}
  onChange={(val) => setForm({ ...form, tgl: val })}
  showTodayShortcut={true}
/>

// 2. Input Upload Berkas / Foto
<FileInput
  label="Dokumentasi Foto KBM"
  accept="image/*,.pdf"
  value={form.file}
  onChange={(fileName, file) => {
    setForm({ ...form, file: fileName });
  }}
/>`}
                />
              </div>
            </div>
          )}
        </Card>

        {/* ========================================================
            ITEM 5: Dialog Modal Terpadu (Modal)
           ======================================================== */}
        <Card className="border border-white/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection("modal")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-lg shadow-2xs font-bold">
                🪟
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#2d2410]">
                    Dialog Modal Terpadu (Modal)
                  </h3>
                  <Badge variant="gold">UI Dialog</Badge>
                </div>
                <p className="text-xs text-[#7d7152] mt-0.5 line-clamp-1">
                  Komponen modal dialog dengan backdrop blur, penutupan dengan tombol Escape, scroll content otomatis, dan footer aksi.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-xs font-semibold text-[#7d7152] hidden sm:inline">
                {openSections["modal"] ? "Tutup" : "Buka"}
              </span>
              <span
                className={`w-7 h-7 rounded-xl bg-white/60 border border-white/70 flex items-center justify-center text-xs font-bold text-[#2d2410] transition-transform duration-200 ${
                  openSections["modal"] ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </button>

          {openSections["modal"] && (
            <div className="p-5 sm:p-6 border-t border-[#2d2410]/15 space-y-4 bg-white/20">
              {/* Live Preview Button */}
              <div className="p-4 rounded-2xl bg-white/40 border border-white/80 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a89b7b] block">
                  ⚡ Live Interactive Demo:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="gold"
                    onClick={() => setDemoModalOpen(true)}
                    icon="🪟"
                  >
                    Buka Contoh Dialog Modal
                  </Button>
                  <span className="text-xs text-[#7d7152]">
                    Klik tombol di atas untuk menguji tampilan pop-up dialog modal standar.
                  </span>
                </div>
              </div>

              {/* Modal Component Demo */}
              <Modal
                isOpen={demoModalOpen}
                onClose={() => setDemoModalOpen(false)}
                title="Formulir Contoh Dialog Modal EduSetara"
                description="Ini adalah contoh dialog modal terpadu yang digunakan untuk formulir Tambah/Edit data maupun pratinjau lembar detail."
                maxWidth="lg"
                footer={
                  <>
                    <Button variant="outline" type="button" onClick={() => setDemoModalOpen(false)}>
                      Tutup
                    </Button>
                    <Button variant="gold" type="button" onClick={() => setDemoModalOpen(false)}>
                      Simpan Contoh
                    </Button>
                  </>
                }
              >
                <div className="space-y-4 text-xs">
                  <p className="text-[#2d2410] leading-relaxed">
                    Modal ini memiliki latar belakang frosted glass dengan efek backdrop blur, mendukung tombol <strong>Escape</strong> pada keyboard untuk menutup, serta secara otomatis mengunci scroll dokumen saat terbuka.
                  </p>
                  <Input
                    label="Nama Bidang / Data Contoh"
                    placeholder="Masukkan nama data..."
                    defaultValue="Program Pembinaan Pendidikan Karakter"
                  />
                  <DateInput
                    label="Tanggal Contoh"
                    value="2026-10-31"
                    onChange={() => {}}
                  />
                </div>
              </Modal>

              {/* Code Box */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#2d2410]">
                  Contoh Penggunaan Komponen:
                </span>
                <CodeBox
                  filename="ContohModal.tsx"
                  code={`import { useState } from "react";
import { Modal, Button, Input } from "@/components/ui";

export function FormModal({ isOpen, onClose, onSubmit }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Data Satuan"
      description="Lengkapi isian data berikut secara teliti."
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button variant="gold" type="submit" form="modal-form">Simpan</Button>
        </>
      }
    >
      <form id="modal-form" onSubmit={onSubmit} className="space-y-4">
        <Input label="Nama Satuan" required ... />
      </form>
    </Modal>
  );
}`}
                />
              </div>
            </div>
          )}
        </Card>

        {/* ========================================================
            ITEM 6: Tombol Aksi & Lencana Status (Button & Badge)
           ======================================================== */}
        <Card className="border border-white/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection("badgebutton")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-lg shadow-2xs font-bold">
                🏷️
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#2d2410]">
                    Tombol Aksi & Lencana Status (Button & Badge)
                  </h3>
                  <Badge variant="gold">Visual System</Badge>
                </div>
                <p className="text-xs text-[#7d7152] mt-0.5 line-clamp-1">
                  Katalog ragam varian tombol aksi utama, sekunder, ghost, serta lencana status tematik amber/gold.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-xs font-semibold text-[#7d7152] hidden sm:inline">
                {openSections["badgebutton"] ? "Tutup" : "Buka"}
              </span>
              <span
                className={`w-7 h-7 rounded-xl bg-white/60 border border-white/70 flex items-center justify-center text-xs font-bold text-[#2d2410] transition-transform duration-200 ${
                  openSections["badgebutton"] ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </button>

          {openSections["badgebutton"] && (
            <div className="p-5 sm:p-6 border-t border-[#2d2410]/15 space-y-4 bg-white/20">
              {/* Live Preview Button Variants */}
              <div className="p-4 rounded-2xl bg-white/40 border border-white/80 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a89b7b] block">
                  ⚡ Ragam Varian Tombol (Button):
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="gold">Primary Gold</Button>
                  <Button variant="gold" icon="➕">Dengan Icon</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="danger">Danger Button</Button>
                  <Button variant="gold" size="sm">Small (sm)</Button>
                  <Button variant="gold" size="lg">Large (lg)</Button>
                </div>
              </div>

              {/* Live Preview Badge Variants */}
              <div className="p-4 rounded-2xl bg-white/40 border border-white/80 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a89b7b] block">
                  ⚡ Ragam Varian Lencana Status (Badge):
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="gold">Gold Active</Badge>
                  <Badge variant="success">Sukses / Terealisasi</Badge>
                  <Badge variant="warning">Dalam Proses</Badge>
                  <Badge variant="danger">Perlu Tindak Lanjut</Badge>
                  <Badge variant="info">Informasi Binaan</Badge>
                  <Badge variant="neutral">Status Netral</Badge>
                  <Badge variant="gold" size="sm">Small Badge</Badge>
                  <Badge variant="gold" size="lg">Large Badge</Badge>
                </div>
              </div>

              {/* Code Box */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#2d2410]">
                  Contoh Penggunaan Komponen:
                </span>
                <CodeBox
                  filename="ContohButtonBadge.tsx"
                  code={`import { Button, Badge } from "@/components/ui";

// 1. Ragam Tombol
<Button variant="gold" onClick={handleSave}>Simpan Data</Button>
<Button variant="outline" onClick={handleCancel}>Batal</Button>
<Button variant="ghost" size="sm" onClick={handleEdit}>Edit</Button>
<Button variant="danger" size="sm" onClick={handleDelete}>Hapus</Button>

// 2. Lencana Status
<Badge variant="gold">Jurnal V2</Badge>
<Badge variant="success">Terealisasi</Badge>
<Badge variant="warning">Dalam Proses</Badge>
<Badge variant="danger">Ditolak</Badge>`}
                />
              </div>
            </div>
          )}
        </Card>

        {/* ========================================================
            ITEM 7: Skeleton Loading Shimmer
           ======================================================== */}
        <Card className="border border-white/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection("skeleton")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-lg shadow-2xs font-bold">
                ⏳
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#2d2410]">
                    Skeleton Loading (Shimmer Efek Kaca)
                  </h3>
                  <Badge variant="neutral"><code>skeleton.tsx</code></Badge>
                </div>
                <p className="text-xs text-[#7d7152] mt-0.5 line-clamp-1">
                  Animasi transisi halus saat proses fetching data dari backend API (SkeletonTable & SkeletonCard).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-xs font-semibold text-[#7d7152] hidden sm:inline">
                {openSections["skeleton"] ? "Tutup" : "Buka"}
              </span>
              <span
                className={`w-7 h-7 rounded-xl bg-white/60 border border-white/70 flex items-center justify-center text-xs font-bold text-[#2d2410] transition-transform duration-200 ${
                  openSections["skeleton"] ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </button>

          {openSections["skeleton"] && (
            <div className="p-5 sm:p-6 border-t border-[#2d2410]/15 space-y-4 bg-white/20">
              <div className="p-4 rounded-2xl bg-white/40 border border-white/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#a89b7b]">
                    ⚡ Live Preview Shimmer:
                  </span>
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={triggerSkeletonReload}
                    disabled={isLoadingDemo}
                  >
                    {isLoadingDemo ? "Memuat..." : "Uji Efek Loading (2 Detik)"}
                  </Button>
                </div>

                {isLoadingDemo ? (
                  <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonTable rows={3} cols={5} />
                    <div className="p-4 rounded-2xl bg-white/40 border border-white/60">
                      <SkeletonText lines={2} />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-white/60 border border-white/80 text-xs text-center text-[#7d7152]">
                    Klik tombol <strong>"Uji Efek Loading"</strong> di atas untuk melihat animasi Shimmer Skeleton.
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#2d2410]">
                  Contoh Penggunaan Komponen:
                </span>
                <CodeBox
                  filename="ContohSkeleton.tsx"
                  code={`import { SkeletonTable, SkeletonCard } from "@/components/ui";

export default function MyPage() {
  const { data, isLoading } = useFetchData();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonTable rows={5} cols={6} />
      </div>
    );
  }

  return <Table data={data} />;
}`}
                />
              </div>
            </div>
          )}
        </Card>

        {/* ========================================================
            ITEM 6: Pola Tabel HTML Murni Semantik
           ======================================================== */}
        <Card className="border border-white/80 shadow-xs overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => toggleSection("table")}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-white/70 border border-white/80 text-[#2d2410] flex items-center justify-center text-lg shadow-2xs font-bold">
                📊
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[#2d2410]">
                    Pola Penulisan Tabel Semantik (HTML Native)
                  </h3>
                  <Badge variant="gold">Best Practice</Badge>
                </div>
                <p className="text-xs text-[#7d7152] mt-0.5 line-clamp-1">
                  Format tabel semantik tanpa abstraksi berlebihan: table, thead, tbody, tr, th, td dengan persentase lebar terukur.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-xs font-semibold text-[#7d7152] hidden sm:inline">
                {openSections["table"] ? "Tutup" : "Buka"}
              </span>
              <span
                className={`w-7 h-7 rounded-xl bg-white/60 border border-white/70 flex items-center justify-center text-xs font-bold text-[#2d2410] transition-transform duration-200 ${
                  openSections["table"] ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </button>

          {openSections["table"] && (
            <div className="p-5 sm:p-6 border-t border-[#2d2410]/15 space-y-4 bg-white/20">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#2d2410]">
                  Sintaks Standar Tabel Admin EduSetara:
                </span>
                <CodeBox
                  filename="PolaTabelAdmin.tsx"
                  code={`<Card className="border border-white/80 shadow-xs">
  {/* 1. Bar Toolbar Filter di Wadah yang Sama */}
  <div className="p-4 sm:p-5 border-b border-[#2d2410]/15 bg-white/30 flex ...">
    <Input placeholder="Cari data..." ... />
  </div>

  {/* 2. Tabel Semantik HTML */}
  <div className="w-full overflow-x-auto">
    <table className="w-full text-left text-sm border-collapse">
      <thead className="border-b border-[#2d2410]/10 bg-white/35 text-xs font-semibold text-[#7d7152]">
        <tr>
          <th className="w-[5%] px-4 py-3 text-center">No</th>
          <th className="w-[30%] px-4 py-3">Nama Satuan Sekolah</th>
          <th className="w-[20%] px-4 py-3">Kecamatan</th>
          <th className="w-[15%] px-4 py-3 text-center">Status</th>
          <th className="w-[10%] px-4 py-3 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/60 bg-transparent">
        {paginatedData.map((row, idx) => (
          <tr key={row.id} className="hover:bg-white/50 transition-colors">
            <td className="px-4 py-3.5 text-center text-xs">{(page - 1) * pageSize + idx + 1}</td>
            <td className="px-4 py-3.5 text-xs font-bold text-[#2d2410]">{row.name}</td>
            <td className="px-4 py-3.5 text-xs text-[#7d7152]">{row.district}</td>
            <td className="px-4 py-3.5 text-center"><Badge variant="success">Aktif</Badge></td>
            <td className="px-4 py-3.5 text-right">
              {/* Tombol Aksi */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* 3. Footer Paginasi */}
  <div className="px-6 py-4 bg-white/20 border-t border-white/60">
    <Pagination page={page} onPageChange={setPage} total={total} ... />
  </div>
</Card>`}
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
