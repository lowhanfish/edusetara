import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Master Pendampingan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master Pendampingan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterPendampinganPage() {
  return (
    <ContractCrudPage
      title="Master Pendampingan"
      category="Data Master"
      description="Kelola dan konfigurasi data Master Pendampingan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Tahapan Pendampingan", "type": "text"},
        {"name": "desc", "label": "Deskripsi Siklus Pendampingan", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
