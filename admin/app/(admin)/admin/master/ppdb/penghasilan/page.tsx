import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Penghasilan",
  description: "Manajemen Penghasilan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PenghasilanPage() {
  return (
    <ContractCrudPage
      title="Penghasilan"
      category="Data Master"
      description="Kelola dan konfigurasi data Penghasilan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Skala Rentang Pendapatan", "type": "text"},
        {"name": "desc", "label": "Deskripsi", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
