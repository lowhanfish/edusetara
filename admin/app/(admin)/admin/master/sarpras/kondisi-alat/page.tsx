import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Kondisi Alat | Admin Dikbud Konawe Selatan",
  description: "Manajemen Kondisi Alat Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KondisiAlatPage() {
  return (
    <ContractCrudPage
      title="Kondisi Alat"
      category="Data Master"
      description="Kelola dan konfigurasi data Kondisi Alat secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Nama", "type": "text"},
        {"name": "desc", "label": "Penjelasan Singkat", "type": "textarea"},
      ]}
      initialData={[{"id": "seed-ka-0", "title": "Baik", "desc": "Peralatan berfungsi normal dan siap digunakan.", "created_at": "2026-01-01", "created_by": "admin"}, {"id": "seed-ka-1", "title": "Rusak Ringan", "desc": "Penurunan fungsi parsial, masih dapat diperbaiki.", "created_at": "2026-01-01", "created_by": "admin"}, {"id": "seed-ka-2", "title": "Rusak Berat", "desc": "Malfungsi permanen, masuk usulan afkir.", "created_at": "2026-01-01", "created_by": "admin"}]}
    />
  );
}
