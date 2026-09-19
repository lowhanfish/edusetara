import { AdminPageScaffold } from "../../_components/admin-page-scaffold";

export const metadata = {
  title: "Komunitas Belajar | Admin Dikbud Konawe Selatan",
  description: "Manajemen Komunitas Belajar Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KomunitasBelajarPage() {
  return (
    <AdminPageScaffold
      title="Komunitas Belajar"
      category="Komunitas Belajar"
      description="Kelola dan konfigurasi data Komunitas Belajar secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🤝"
      breadcrumbs={[
      {
              "label": "Komunitas Belajar",
              "href": "/admin/komunitas-belajar"
      }
]}
    />
  );
}
