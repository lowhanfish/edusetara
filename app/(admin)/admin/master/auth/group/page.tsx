import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Group | Admin Dikbud Konawe Selatan",
  description: "Manajemen Group Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function GroupPage() {
  return (
    <AdminPageScaffold
      title="Group"
      category="Data Master"
      description="Kelola dan konfigurasi data Group secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="👥"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Auth",
              "href": null
      },
      {
              "label": "Group",
              "href": "/admin/master/auth/group"
      }
]}
    />
  );
}
