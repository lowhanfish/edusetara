import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Kelas | Admin Dikbud Konawe Selatan",
  description: "Manajemen Kelas Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KelasPage() {
  return (
    <ContractCrudPage
      title="Kelas"
      category="Data Master"
      description="Kelola dan konfigurasi data Kelas secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Tingkat Kelas", "type": "text"},
        {"name": "desc", "label": "Keterangan Kelas", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
