import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Jenis Bantuan",
  description: "Manajemen Jenis Bantuan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JenisBantuanPage() {
  return (
    <ContractCrudPage
      title="Jenis Bantuan"
      category="Data Master"
      description="Kelola dan konfigurasi data Jenis Bantuan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Nama", "type": "text"},
        {"name": "desc", "label": "Penjelasan Singkat", "type": "textarea"},
      ]}
      initialData={[{"id": "seed-jb-0", "title": "Dana Alokasi Khusus (DAK)", "desc": "Bantuan fisik rehabilitasi, pembangunan lab, pengadaan TIK.", "created_at": "2026-01-01", "created_by": "admin"}, {"id": "seed-jb-1", "title": "Bantuan Operasional Sekolah (BOS)", "desc": "Bantuan operasional penunjang KBM.", "created_at": "2026-01-01", "created_by": "admin"}]}
    />
  );
}
