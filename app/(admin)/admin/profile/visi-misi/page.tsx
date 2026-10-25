import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Visi dan Misi | Admin Dikbud Konawe Selatan",
  description: "Manajemen Visi dan Misi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function VisiDanMisiPage() {
  return (
    <ContractCrudPage
      title="Visi dan Misi"
      category="Profile"
      description="Kelola dan konfigurasi data Visi dan Misi secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "isi", "label": "Rumusan Visi & Misi Dinas Pendidikan", "type": "textarea"},
      ]}
      columns={["isi"]}
    />
  );
}
