import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Tempat Tinggal",
  description: "Manajemen Tempat Tinggal Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function TempatTinggalPage() {
  return (
    <ContractCrudPage
      title="Tempat Tinggal"
      category="Data Master"
      description="Kelola dan konfigurasi data Tempat Tinggal secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Status Tempat Tinggal", "type": "text"},
        {"name": "desc", "label": "Deskripsi", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
