import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Usulan Data Assessment",
  description: "Manajemen Usulan Data Assessment Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function UsulanDataAssessmentPage() {
  return (
    <ContractCrudPage
      title="Usulan Data Assessment"
      category="Usulan Sekolah"
      description="Kelola dan konfigurasi data Usulan Data Assessment secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "status_sekolah_id", "label": "Status Sekolah", "type": "select", "options": [{"value": "0", "label": "Negeri"}, {"value": "1", "label": "Swasta"}, {"value": "2", "label": "Satuan Pendidikan Kerjasama"}]},
        {"name": "jml_siswa", "label": "Jumlah Siswa Peserta", "type": "number"},
        {"name": "jml_laki", "label": "Jumlah Laki-laki", "type": "number"},
        {"name": "jml_perempuan", "label": "Jumlah Perempuan", "type": "number"},
        {"name": "kurikulum_k13", "label": "Siswa Kurikulum 2013", "type": "number"},
        {"name": "kurikulum_kurmer", "label": "Siswa Kurikulum Merdeka", "type": "number"},
        {"name": "file", "label": "Lampiran Excel Nominasi", "type": "file", "accept": ".xlsx,.xls,.csv", "placeholder": "Unggah berkas Excel nominasi"},
      ]}
    />
  );
}
