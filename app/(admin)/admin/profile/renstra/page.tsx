import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Renstra | Admin Dikbud Konawe Selatan",
  description: "Manajemen Renstra Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function RenstraPage() {
  return (
    <AdminPageScaffold
      title="Renstra"
      category="Profile"
      description="Kelola dan konfigurasi data Renstra secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📈"
      breadcrumbs={[
      {
              "label": "Profile",
              "href": null
      },
      {
              "label": "Renstra",
              "href": "/admin/profile/renstra"
      }
]}
    />
  );
}
