import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Master Model Pembelajaran | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master Model Pembelajaran Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterModelPembelajaranPage() {
  return (
    <ContractCrudPage
      title="Master Model Pembelajaran"
      category="Data Master"
      description="Kelola dan konfigurasi data Master Model Pembelajaran secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Model Pembelajaran", "type": "text"},
        {"name": "desc", "label": "Sintaks Strategi Pembelajaran", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
