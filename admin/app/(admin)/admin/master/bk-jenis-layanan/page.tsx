import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Master BK Jenis Layanan",
  description: "Manajemen Master BK Jenis Layanan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterBKJenisLayananPage() {
  return (
    <ContractCrudPage
      title="Master BK Jenis Layanan"
      category="Data Master"
      description="Kelola dan konfigurasi data Master BK Jenis Layanan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Jenis Bidang Layanan BK", "type": "text"},
        {"name": "desc", "label": "Deskripsi Ranah Layanan", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
