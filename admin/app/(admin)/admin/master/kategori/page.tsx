import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Master Kategori",
  description: "Manajemen Master Kategori Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterKategoriPage() {
  return (
    <ContractCrudPage
      title="Master Kategori"
      category="Data Master"
      description="Kelola dan konfigurasi data Master Kategori secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Kategori Dokumen SPJ BOSP", "type": "text"},
        {"name": "desc", "label": "Deskripsi Instrumen Laporan", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
