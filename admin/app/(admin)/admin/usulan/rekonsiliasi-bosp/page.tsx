import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Usulan Rekonsiliasi Dana BOSP | Admin Dikbud Konawe Selatan",
  description: "Manajemen Usulan Rekonsiliasi Dana BOSP Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function UsulanRekonsiliasiDanaBOSPPage() {
  return (
    <ContractCrudPage
      title="Usulan Rekonsiliasi Dana BOSP"
      category="Usulan Sekolah"
      description="Kelola dan konfigurasi data Usulan Rekonsiliasi Dana BOSP secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "tahun", "label": "Tahun Anggaran", "type": "select", "options": [{"value": "2025", "label": "2025"}, {"value": "2026", "label": "2026"}]},
        {"name": "semester_id", "label": "Semester", "type": "select", "options": [{"value": "1", "label": "Semester I (Januari - Juni)"}, {"value": "2", "label": "Semester II (Juli - Desember)"}]},
      ]}
    />
  );
}
