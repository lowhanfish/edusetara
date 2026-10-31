import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Tugas Dan Fungsi",
  description: "Manajemen Tugas Dan Fungsi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function TugasDanFungsiPage() {
  return (
    <ContractCrudPage
      title="Tugas Dan Fungsi"
      category="Profile"
      description="Kelola dan konfigurasi data Tugas Dan Fungsi secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "isi", "label": "Uraian Tugas Pokok & Fungsi Struktural", "type": "textarea"},
      ]}
      columns={["isi"]}
    />
  );
}
