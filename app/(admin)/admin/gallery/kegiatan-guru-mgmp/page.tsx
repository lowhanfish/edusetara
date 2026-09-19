import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Gallery Kegiatan Guru MGMP | Admin Dikbud Konawe Selatan",
  description: "Manajemen Gallery Kegiatan Guru MGMP Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function GalleryKegiatanGuruMGMPPage() {
  return (
    <AdminPageScaffold
      title="Gallery Kegiatan Guru MGMP"
      category="Gallery"
      description="Kelola dan konfigurasi data Gallery Kegiatan Guru MGMP secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🔬"
      breadcrumbs={[
      {
              "label": "Gallery",
              "href": null
      },
      {
              "label": "Gallery Kegiatan Guru MGMP",
              "href": "/admin/gallery/kegiatan-guru-mgmp"
      }
]}
    />
  );
}
