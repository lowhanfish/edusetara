import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Verifikasi Usulan Rekonsiliasi Dana BOSP | Admin Dikbud Konawe Selatan",
  description: "Manajemen Verifikasi Usulan Rekonsiliasi Dana BOSP Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function VerifikasiUsulanRekonsiliasiDanaBOSPPage() {
  return (
    <ContractCrudPage
      title="Verifikasi Usulan Rekonsiliasi Dana BOSP"
      category="Verifikasi"
      description="Kelola dan konfigurasi data Verifikasi Usulan Rekonsiliasi Dana BOSP secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "id", "label": "ID Lampiran Rekonsiliasi", "type": "text", "placeholder": "rekon-lamp-2026-001"},
        {"name": "status_1", "label": "Tahap 1: Cek Benar", "type": "select", "options": [{"value": "1", "label": "Terverifikasi / Benar"}, {"value": "2", "label": "Penolakan / Perbaikan"}]},
        {"name": "pesan_1", "label": "Catatan Transaksi / Kuitansi", "type": "textarea"},
        {"name": "status_2", "label": "Tahap 2: Cek Lengkap", "type": "select", "options": [{"value": "1", "label": "Terverifikasi / Lengkap"}, {"value": "2", "label": "Penolakan / Belum Lengkap"}]},
        {"name": "pesan_2", "label": "Catatan Kelengkapan Dokumen", "type": "textarea"},
      ]}
      columns={["id", "status_1", "status_2", "pesan_1"]}
    />
  );
}
