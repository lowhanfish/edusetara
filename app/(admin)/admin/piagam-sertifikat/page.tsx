import { AdminPageScaffold } from "../../_components/admin-page-scaffold";

export const metadata = {
  title: "Piagam Sertifikat | Admin Dikbud Konawe Selatan",
  description: "Manajemen Piagam Sertifikat Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PiagamSertifikatPage() {
  return (
    <AdminPageScaffold
      title="Piagam Sertifikat"
      category="Piagam Sertifikat"
      description="Kelola dan konfigurasi data Piagam Sertifikat secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🏆"
      breadcrumbs={[
      {
              "label": "Piagam Sertifikat",
              "href": "/admin/piagam-sertifikat"
      }
]}
    />
  );
}
