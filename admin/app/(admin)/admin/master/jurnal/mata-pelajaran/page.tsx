import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Mata Pelajaran",
  description: "Manajemen Mata Pelajaran Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MataPelajaranPage() {
  return (
    <ContractCrudPage
      title="Mata Pelajaran"
      category="Data Master"
      description="Kelola dan konfigurasi data Mata Pelajaran secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "kelas_id", "label": "Tingkat Kelas", "type": "select", "options": [{"value": "1", "label": "Kelas 1 SD"}, {"value": "7", "label": "Kelas 7 SMP"}, {"value": "8", "label": "Kelas 8 SMP"}, {"value": "9", "label": "Kelas 9 SMP"}]},
        {"name": "title", "label": "Nama Mata Pelajaran", "type": "text"},
        {"name": "desc", "label": "Keterangan Kurikulum", "type": "textarea"},
      ]}
      columns={["title", "kelas_id", "desc"]}
    />
  );
}
