import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Modul dan Materi Pelatihan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Modul dan Materi Pelatihan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function ModulDanMateriPelatihanPage() {
  return (
    <AdminPageScaffold
      title="Modul dan Materi Pelatihan"
      category="Regulasi dan Info GTK"
      description="Kelola dan konfigurasi data Modul dan Materi Pelatihan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📖"
      breadcrumbs={[
      {
              "label": "Regulasi dan Info GTK",
              "href": null
      },
      {
              "label": "Modul dan Materi Pelatihan",
              "href": "/admin/regulasi-gtk/modul-materi"
      }
]}
    />
  );
}
