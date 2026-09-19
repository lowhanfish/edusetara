import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Kepemilikan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Kepemilikan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KepemilikanPage() {
  return (
    <AdminPageScaffold
      title="Kepemilikan"
      category="Data Master"
      description="Kelola dan konfigurasi data Kepemilikan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📜"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Sarpras",
              "href": null
      },
      {
              "label": "Kepemilikan",
              "href": "/admin/master/sarpras/kepemilikan"
      }
]}
    />
  );
}
