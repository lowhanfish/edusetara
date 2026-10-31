import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Data Penerima",
  description: "Manajemen Data Penerima Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function DataPenerimaPage() {
  return (
    <ContractCrudPage
      title="Data Penerima"
      category="Usulan Sekolah"
      description="Kelola dan konfigurasi data Data Penerima secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "pendukung_id", "label": "Data Pendukung PIP", "type": "select", "options": [{"value": "pip-dukung-2026-sd-01", "label": "SK Pemberian PIP SD Tahap I"}, {"value": "pip-dukung-2026-smp-01", "label": "SK Pemberian PIP SMP Tahap I"}]},
        {"name": "siswa_id", "label": "Siswa", "type": "select", "options": [{"value": "siswa-sd-0101", "label": "Aditya Pratama Saputra (0145892301)"}, {"value": "siswa-sd-0102", "label": "Siti Nur Halizah (0152489104)"}]},
      ]}
    />
  );
}
