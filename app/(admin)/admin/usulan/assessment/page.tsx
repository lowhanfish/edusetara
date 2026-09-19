import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Usulan Data Assessment | Admin Dikbud Konawe Selatan",
  description: "Manajemen Usulan Data Assessment Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function UsulanDataAssessmentPage() {
  return (
    <AdminPageScaffold
      title="Usulan Data Assessment"
      category="Usulan Sekolah"
      description="Kelola dan konfigurasi data Usulan Data Assessment secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📊"
      breadcrumbs={[
      {
              "label": "Usulan Sekolah",
              "href": null
      },
      {
              "label": "Usulan Data Assessment",
              "href": "/admin/usulan/assessment"
      }
]}
    />
  );
}
