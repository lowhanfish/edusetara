import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Gallery Program Guru Penggerak | Admin Dikbud Konawe Selatan",
  description: "Manajemen Gallery Program Guru Penggerak Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function GalleryProgramGuruPenggerakPage() {
  return (
    <AdminPageScaffold
      title="Gallery Program Guru Penggerak"
      category="Gallery"
      description="Kelola dan konfigurasi data Gallery Program Guru Penggerak secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🌟"
      breadcrumbs={[
      {
              "label": "Gallery",
              "href": null
      },
      {
              "label": "Gallery Program Guru Penggerak",
              "href": "/admin/gallery/guru-penggerak"
      }
]}
    />
  );
}
