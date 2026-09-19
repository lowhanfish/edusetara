import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Sumber Dana | Admin Dikbud Konawe Selatan",
  description: "Manajemen Sumber Dana Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function SumberDanaPage() {
  return (
    <AdminPageScaffold
      title="Sumber Dana"
      category="Data Master"
      description="Kelola dan konfigurasi data Sumber Dana secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="💰"
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
              "label": "Sumber Dana",
              "href": "/admin/master/sarpras/sumber-dana"
      }
]}
    />
  );
}
