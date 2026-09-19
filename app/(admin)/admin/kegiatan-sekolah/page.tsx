import { AdminPageScaffold } from "../../_components/admin-page-scaffold";

export const metadata = {
  title: "Kegiatan Sekolah | Admin Dikbud Konawe Selatan",
  description: "Manajemen Kegiatan Sekolah Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KegiatanSekolahPage() {
  return (
    <AdminPageScaffold
      title="Kegiatan Sekolah"
      category="Kegiatan Sekolah"
      description="Kelola dan konfigurasi data Kegiatan Sekolah secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🎯"
      breadcrumbs={[
      {
              "label": "Kegiatan Sekolah",
              "href": "/admin/kegiatan-sekolah"
      }
]}
    />
  );
}
