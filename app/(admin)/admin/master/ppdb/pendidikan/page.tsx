import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Pendidikan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Pendidikan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PendidikanPage() {
  return (
    <AdminPageScaffold
      title="Pendidikan"
      category="Data Master"
      description="Kelola dan konfigurasi data Pendidikan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🎓"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master PPDB",
              "href": null
      },
      {
              "label": "Pendidikan",
              "href": "/admin/master/ppdb/pendidikan"
      }
]}
    />
  );
}
