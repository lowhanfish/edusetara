import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Gallery Kegiatan Pengawas Satdik | Admin Dikbud Konawe Selatan",
  description: "Manajemen Gallery Kegiatan Pengawas Satdik Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function GalleryKegiatanPengawasSatdikPage() {
  return (
    <AdminPageScaffold
      title="Gallery Kegiatan Pengawas Satdik"
      category="Gallery"
      description="Kelola dan konfigurasi data Gallery Kegiatan Pengawas Satdik secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📋"
      breadcrumbs={[
      {
              "label": "Gallery",
              "href": null
      },
      {
              "label": "Gallery Kegiatan Pengawas Satdik",
              "href": "/admin/gallery/kegiatan-pengawas"
      }
]}
    />
  );
}
