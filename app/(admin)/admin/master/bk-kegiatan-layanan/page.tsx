import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Master BK Kegiatan Layanan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master BK Kegiatan Layanan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterBKKegiatanLayananPage() {
  return (
    <ContractCrudPage
      title="Master BK Kegiatan Layanan"
      category="Data Master"
      description="Kelola dan konfigurasi data Master BK Kegiatan Layanan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Bentuk Kegiatan Layanan BK", "type": "text"},
        {"name": "desc", "label": "Deskripsi Operasional", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
