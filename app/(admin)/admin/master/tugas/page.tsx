import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Master Tugas | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master Tugas Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterTugasPage() {
  return (
    <ContractCrudPage
      title="Master Tugas"
      category="Data Master"
      description="Kelola dan konfigurasi data Master Tugas secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Nama Penugasan Formal", "type": "text"},
        {"name": "desc", "label": "Deskripsi Peran / Fungsi", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
