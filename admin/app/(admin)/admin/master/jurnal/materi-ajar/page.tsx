import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Materi Ajar | Admin Dikbud Konawe Selatan",
  description: "Manajemen Materi Ajar Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MateriAjarPage() {
  return (
    <ContractCrudPage
      title="Materi Ajar"
      category="Data Master"
      description="Kelola dan konfigurasi data Materi Ajar secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Materi / Media Ajar", "type": "text"},
        {"name": "desc", "label": "Keterangan Media / Tatap Muka", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
