import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Tanah Sekolah | Admin Dikbud Konawe Selatan",
  description: "Manajemen Tanah Sekolah Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function TanahSekolahPage() {
  return (
    <AdminPageScaffold
      title="Tanah Sekolah"
      category="Sarana dan Prasarana"
      description="Kelola dan konfigurasi data Tanah Sekolah secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🗺️"
      breadcrumbs={[
      {
              "label": "Sarana dan Prasarana",
              "href": null
      },
      {
              "label": "Tanah Sekolah",
              "href": "/admin/sarpras/tanah"
      }
]}
    />
  );
}
