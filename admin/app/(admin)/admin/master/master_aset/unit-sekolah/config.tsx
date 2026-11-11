import { Badge } from "@/app/(admin)/_components/ui";
import type { FieldDef, MasterAsetConfig, MasterAsetRecord } from "../_shared/types";

export const TINGKAT_UNIT: Record<string, string> = {
  unit: "Unit",
  sub_unit: "Sub Unit",
  upb: "UPB",
};

export const JENIS_UNIT = ["DINAS", "UPT", "SD", "SMP", "SATAP", "TK", "SMA", "SMK", "SKB", "LAINNYA"];

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

export const STATUS_PENCOCOKAN: Record<string, { label: string; variant: BadgeVariant }> = {
  belum: { label: "Belum dicocokkan", variant: "danger" },
  otomatis: { label: "Otomatis, perlu ditinjau", variant: "warning" },
  manual: { label: "Sudah diverifikasi", variant: "success" },
  bukan_sekolah: { label: "Bukan sekolah", variant: "neutral" },
};

const text = (value: unknown) => (value == null || value === "" ? "-" : String(value));

const sekolahLookup = (key: string, label: string, labelKey: string, helper: string): FieldDef => ({
  key,
  label,
  type: "lookup",
  span: 2,
  helper,
  placeholder: "Ketik nama sekolah atau NPSN...",
  lookup: {
    path: "/api/v1/admin/master/sekolah/option",
    labelKey,
    toChoice: (item) => ({
      value: String(item.id),
      label: `${text(item.nama)} (NPSN ${text(item.npsn)})`,
      description: `${text(item.jenjang)} · ${text(item.status)} · Kec. ${text(item.kecamatan)}`,
    }),
  },
});

const sekolahCell = (r: MasterAsetRecord) => {
  if (!r.sekolah_id) return <span className="text-[#9c8e6b]">-</span>;
  return (
    <div className="flex flex-col gap-0.5">
      <span>{text(r.sekolah_label)}</span>
      {r.sekolah_kedua_id ? <span>{text(r.sekolah_kedua_label)}</span> : null}
    </div>
  );
};

export const config: MasterAsetConfig = {
  slug: "unit-sekolah",
  title: "Master Unit & Sekolah (UPB)",
  singular: "Unit/Sekolah",
  description:
    "Unit, sub unit (UPT kecamatan), dan UPB (sekolah) Dinas Pendidikan menurut kunci SIMDA BMD, dengan nama lama dan nama baru serta padanannya di Master Sekolah. Padanan otomatis wajib ditinjau.",
  icon: "🏫",
  simdaSource: "Ref_Unit · Ref_Sub_Unit · Ref_UPB",
  searchPlaceholder: "Cari kode, nama baru, atau nama lama...",
  titleKey: "nama",
  columns: [
    {
      key: "kode",
      label: "Kode SIMDA",
      className: "w-36",
      render: (r) => <span className="font-mono font-semibold text-amber-800">{text(r.kode)}</span>,
    },
    {
      key: "tingkat",
      label: "Tingkat",
      className: "w-28",
      render: (r) => `${TINGKAT_UNIT[String(r.tingkat)] ?? "-"} · ${text(r.jenis)}`,
    },
    { key: "nama", label: "Nama Sekarang" },
    { key: "nama_lama", label: "Nama Lama" },
    { key: "sekolah_label", label: "Padanan Master Sekolah", render: sekolahCell },
    {
      key: "status_pencocokan",
      label: "Pencocokan",
      className: "w-44",
      render: (r) => {
        const status = STATUS_PENCOCOKAN[String(r.status_pencocokan)];
        return status ? <Badge variant={status.variant} size="sm">{status.label}</Badge> : "-";
      },
    },
  ],
  detailExtras: [
    { key: "nama_simda", label: "Nama di SIMDA" },
    { key: "nama_induk", label: "Induk" },
    { key: "tahun_perubahan", label: "Tahun Perubahan Nama" },
    { key: "unit_kerja_nama", label: "Unit Kerja SIMPEG" },
    { key: "catatan_pencocokan", label: "Catatan Pencocokan" },
  ],
  fields: [
    { key: "kd_bidang", label: "Kode Bidang", type: "number", required: true, lockOnEdit: true, min: 1, max: 99, placeholder: "8" },
    { key: "kd_unit", label: "Kode Unit", type: "number", required: true, lockOnEdit: true, min: 1, max: 999, placeholder: "1" },
    {
      key: "kd_sub",
      label: "Kode Sub Unit",
      type: "number",
      lockOnEdit: true,
      min: 1,
      max: 999,
      helper: "Kosongkan untuk baris tingkat unit.",
    },
    {
      key: "kd_upb",
      label: "Kode UPB",
      type: "number",
      lockOnEdit: true,
      min: 1,
      max: 9999,
      helper: "Kosongkan untuk baris unit atau sub unit.",
    },
    {
      key: "jenis",
      label: "Jenis",
      type: "select",
      required: true,
      options: JENIS_UNIT.map((j) => ({ value: j, label: j })),
    },
    {
      key: "tahun_perubahan",
      label: "Tahun Perubahan Nama",
      type: "number",
      min: 1990,
      max: 2100,
      helper: "Tahun nama sekarang mulai berlaku; nama lama berlaku sampai tahun sebelumnya.",
    },
    { key: "nama", label: "Nama Sekarang", type: "text", required: true, span: 2, placeholder: "SDN 1 TINANGGEA" },
    { key: "nama_lama", label: "Nama Lama", type: "text", span: 2, placeholder: "SDN RORAYA" },
    sekolahLookup(
      "sekolah_id",
      "Padanan di Master Sekolah",
      "sekolah_label",
      "Hanya untuk tingkat UPB. Unit kerja SIMPEG mengikuti sekolah yang dipilih."
    ),
    sekolahLookup(
      "sekolah_kedua_id",
      "Sekolah Kedua (khusus satu atap)",
      "sekolah_kedua_label",
      "Satu UPB SD-SMPN SATAP mewakili dua NPSN: SD dan SMP."
    ),
    {
      key: "status_pencocokan",
      label: "Status Pencocokan",
      type: "select",
      required: true,
      span: 2,
      options: Object.entries(STATUS_PENCOCOKAN).map(([value, s]) => ({ value, label: s.label })),
      helper: "Pilih 'Sudah diverifikasi' setelah padanan diperiksa; impor ulang tidak akan mengubahnya.",
    },
    { key: "keterangan", label: "Keterangan", type: "textarea" },
  ],
  filters: [
    {
      key: "tingkat",
      label: "Tingkat",
      allLabel: "Semua tingkat",
      options: Object.entries(TINGKAT_UNIT).map(([value, label]) => ({ value, label })),
    },
    {
      key: "jenis",
      label: "Jenis",
      allLabel: "Semua jenis",
      options: JENIS_UNIT.map((j) => ({ value: j, label: j })),
    },
    {
      key: "status_pencocokan",
      label: "Status pencocokan",
      allLabel: "Semua status",
      options: Object.entries(STATUS_PENCOCOKAN).map(([value, s]) => ({ value, label: s.label })),
    },
  ],
};
