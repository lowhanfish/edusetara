import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Gallery Kegiatan KKG SD | Admin Dikbud Konawe Selatan",
  description: "Manajemen Gallery Kegiatan KKG SD Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function GalleryKegiatanKKGSDPage() {
  return (
    <AdminPageScaffold
      title="Gallery Kegiatan KKG SD"
      category="Gallery"
      description="Kelola dan konfigurasi data Gallery Kegiatan KKG SD secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🎨"
      breadcrumbs={[
      {
              "label": "Gallery",
              "href": null
      },
      {
              "label": "Gallery Kegiatan KKG SD",
              "href": "/admin/gallery/kegiatan-kkg-sd"
      }
]}
    />
  );
}
