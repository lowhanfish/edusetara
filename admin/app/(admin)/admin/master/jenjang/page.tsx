import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Master Jenjang | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master Jenjang Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterJenjangPage() {
  return (
    <ContractCrudPage
      title="Master Jenjang"
      category="Data Master"
      description="Kelola dan konfigurasi data Master Jenjang secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Jenjang Pendidikan", "type": "text"},
        {"name": "desc", "label": "Keterangan Jenjang", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
