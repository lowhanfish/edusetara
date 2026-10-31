import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Kepemilikan",
  description: "Manajemen Kepemilikan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KepemilikanPage() {
  return (
    <ContractCrudPage
      title="Kepemilikan"
      category="Data Master"
      description="Kelola dan konfigurasi data Kepemilikan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Nama", "type": "text"},
        {"name": "desc", "label": "Penjelasan Singkat", "type": "textarea"},
      ]}
      initialData={[{"id": "seed-kp-0", "title": "Milik Sendiri", "desc": "Aset tetap milik sah lembaga/pemerintah daerah.", "created_at": "2026-01-01", "created_by": "admin"}, {"id": "seed-kp-1", "title": "Sewa", "desc": "Dimanfaatkan melalui perjanjian sewa.", "created_at": "2026-01-01", "created_by": "admin"}, {"id": "seed-kp-2", "title": "Pinjam", "desc": "Pinjam pakai dari instansi lain tanpa sewa.", "created_at": "2026-01-01", "created_by": "admin"}]}
    />
  );
}
