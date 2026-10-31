import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Bahan Ajar",
  description: "Manajemen Bahan Ajar Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function BahanAjarPage() {
  return (
    <ContractCrudPage
      title="Bahan Ajar"
      category="Data Master"
      description="Kelola dan konfigurasi data Bahan Ajar secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Bahan Ajar", "type": "text"},
        {"name": "desc", "label": "Keterangan Metode Instruksional", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
