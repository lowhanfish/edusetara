import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Sekolah Penggerak | Admin Dikbud Konawe Selatan",
  description: "Manajemen Sekolah Penggerak Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function SekolahPenggerakPage() {
  return (
    <AdminPageScaffold
      title="Sekolah Penggerak"
      category="Gallery"
      description="Kelola dan konfigurasi data Sekolah Penggerak secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🚀"
      breadcrumbs={[
      {
              "label": "Gallery",
              "href": null
      },
      {
              "label": "Sekolah Penggerak",
              "href": "/admin/gallery/sekolah-penggerak"
      }
]}
    />
  );
}
