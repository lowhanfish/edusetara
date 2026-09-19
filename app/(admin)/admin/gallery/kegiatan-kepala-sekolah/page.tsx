import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Gallery Kegiatan Kepala Sekolah | Admin Dikbud Konawe Selatan",
  description: "Manajemen Gallery Kegiatan Kepala Sekolah Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function GalleryKegiatanKepalaSekolahPage() {
  return (
    <AdminPageScaffold
      title="Gallery Kegiatan Kepala Sekolah"
      category="Gallery"
      description="Kelola dan konfigurasi data Gallery Kegiatan Kepala Sekolah secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="👔"
      breadcrumbs={[
      {
              "label": "Gallery",
              "href": null
      },
      {
              "label": "Gallery Kegiatan Kepala Sekolah",
              "href": "/admin/gallery/kegiatan-kepala-sekolah"
      }
]}
    />
  );
}
