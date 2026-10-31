import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Verifikasi Tunjangan Guru",
  description: "Manajemen Verifikasi Tunjangan Guru Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function VerifikasiTunjanganGuruPage() {
  return (
    <ContractCrudPage
      title="Verifikasi Tunjangan Guru"
      category="Verifikasi"
      description="Kelola dan konfigurasi data Verifikasi Tunjangan Guru secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "id", "label": "ID Usulan Guru", "type": "text", "placeholder": "usul-tpg-2026-001"},
        {"name": "status", "label": "Status Verifikasi", "type": "select", "options": [{"value": "1", "label": "Diterima / Disetujui"}, {"value": "2", "label": "Dikembalikan / Ditolak"}]},
        {"name": "pesan", "label": "Catatan Verifikasi / Alasan", "type": "textarea"},
      ]}
      columns={["id", "status", "pesan"]}
    />
  );
}
