import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Pengumuman GTK | Admin Dikbud Konawe Selatan",
  description: "Manajemen Pengumuman GTK Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PengumumanGTKPage() {
  return (
    <AdminPageScaffold
      title="Pengumuman GTK"
      category="Regulasi dan Info GTK"
      description="Kelola dan konfigurasi data Pengumuman GTK secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📣"
      breadcrumbs={[
      {
              "label": "Regulasi dan Info GTK",
              "href": null
      },
      {
              "label": "Pengumuman GTK",
              "href": "/admin/regulasi-gtk/pengumuman"
      }
]}
    />
  );
}
