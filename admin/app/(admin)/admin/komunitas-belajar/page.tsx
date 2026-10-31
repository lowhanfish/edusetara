import { ContractCrudPage } from "../../_components/contract-crud-page";

export const metadata = {
  title: "Komunitas Belajar",
  description: "Manajemen Komunitas Belajar Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KomunitasBelajarPage() {
  return (
    <ContractCrudPage
      title="Komunitas Belajar"
      category="Komunitas Belajar"
      description="Kelola dan konfigurasi data Komunitas Belajar secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "uraian", "label": "Nama Komunitas Belajar", "type": "text"},
        {"name": "jns_kegiatan", "label": "Jenis Kegiatan", "type": "select", "options": [{"value": "0", "label": "Siklus Refleksi Awal"}, {"value": "1", "label": "Siklus Perencanaan"}, {"value": "2", "label": "Siklus Implementasi"}, {"value": "3", "label": "Siklus Evaluasi"}]},
        {"name": "deskripsi", "label": "Deskripsi Kegiatan", "type": "textarea"},
        {"name": "file", "label": "Lampiran (Foto / PDF)", "type": "file", "accept": ".pdf,image/*", "placeholder": "Unggah foto atau dokumen kegiatan"},
      ]}
      columns={["uraian", "jns_kegiatan", "deskripsi", "file"]}
    />
  );
}
