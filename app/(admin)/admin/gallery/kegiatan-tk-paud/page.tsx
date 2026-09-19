import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Gallery Kegiatan TK & PAUD | Admin Dikbud Konawe Selatan",
  description: "Manajemen Gallery Kegiatan TK & PAUD Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function GalleryKegiatanTKPAUDPage() {
  return (
    <AdminPageScaffold
      title="Gallery Kegiatan TK & PAUD"
      category="Gallery"
      description="Kelola dan konfigurasi data Gallery Kegiatan TK & PAUD secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🎈"
      breadcrumbs={[
      {
              "label": "Gallery",
              "href": null
      },
      {
              "label": "Gallery Kegiatan TK & PAUD",
              "href": "/admin/gallery/kegiatan-tk-paud"
      }
]}
    />
  );
}
