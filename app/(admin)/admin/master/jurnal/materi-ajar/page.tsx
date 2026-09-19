import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Materi Ajar | Admin Dikbud Konawe Selatan",
  description: "Manajemen Materi Ajar Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MateriAjarPage() {
  return (
    <AdminPageScaffold
      title="Materi Ajar"
      category="Data Master"
      description="Kelola dan konfigurasi data Materi Ajar secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📚"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Jurnal",
              "href": null
      },
      {
              "label": "Materi Ajar",
              "href": "/admin/master/jurnal/materi-ajar"
      }
]}
    />
  );
}
