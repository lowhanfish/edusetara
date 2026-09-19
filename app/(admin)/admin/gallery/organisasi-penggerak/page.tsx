import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Gallery Program Organisasi Penggerak | Admin Dikbud Konawe Selatan",
  description: "Manajemen Gallery Program Organisasi Penggerak Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function GalleryProgramOrganisasiPenggerakPage() {
  return (
    <AdminPageScaffold
      title="Gallery Program Organisasi Penggerak"
      category="Gallery"
      description="Kelola dan konfigurasi data Gallery Program Organisasi Penggerak secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🏛️"
      breadcrumbs={[
      {
              "label": "Gallery",
              "href": null
      },
      {
              "label": "Gallery Program Organisasi Penggerak",
              "href": "/admin/gallery/organisasi-penggerak"
      }
]}
    />
  );
}
