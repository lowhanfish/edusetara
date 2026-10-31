import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Renstra",
  description: "Manajemen Renstra Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function RenstraPage() {
  return (
    <ContractCrudPage
      title="Renstra"
      category="Profile"
      description="Kelola dan konfigurasi data Renstra secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "isi", "label": "Uraian Kebijakan & Sasaran Renstra", "type": "textarea"},
      ]}
      columns={["isi"]}
    />
  );
}
