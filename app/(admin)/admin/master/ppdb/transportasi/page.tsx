import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Mode Transportasi | Admin Dikbud Konawe Selatan",
  description: "Manajemen Mode Transportasi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function ModeTransportasiPage() {
  return (
    <ContractCrudPage
      title="Mode Transportasi"
      category="Data Master"
      description="Kelola dan konfigurasi data Mode Transportasi secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Mode Transportasi", "type": "text"},
        {"name": "desc", "label": "Deskripsi", "type": "textarea"},
      ]}
      columns={["title", "desc"]}
    />
  );
}
