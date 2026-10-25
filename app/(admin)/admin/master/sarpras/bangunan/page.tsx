import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Bangunan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Bangunan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function BangunanPage() {
  return (
    <ContractCrudPage
      title="Bangunan"
      category="Data Master"
      description="Kelola dan konfigurasi data Bangunan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Nama", "type": "text"},
        {"name": "desc", "label": "Penjelasan Singkat", "type": "textarea"},
      ]}
      initialData={[{"id": "seed-bg-0", "title": "Baik", "desc": "Kondisi fisik utuh, laik fungsi optimal.", "created_at": "2026-01-01", "created_by": "admin"}, {"id": "seed-bg-1", "title": "Rusak Ringan", "desc": "Kerusakan non-struktural minor.", "created_at": "2026-01-01", "created_by": "admin"}, {"id": "seed-bg-2", "title": "Rusak Sedang", "desc": "Kerusakan sebagian komponen non-struktural/struktural kecil.", "created_at": "2026-01-01", "created_by": "admin"}, {"id": "seed-bg-3", "title": "Rusak Berat", "desc": "Kerusakan elemen struktur utama, perlu renovasi total.", "created_at": "2026-01-01", "created_by": "admin"}]}
    />
  );
}
