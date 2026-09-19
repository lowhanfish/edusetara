import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Master SD | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master SD Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterSDPage() {
  return (
    <AdminPageScaffold
      title="Master SD"
      category="Data Master"
      description="Kelola dan konfigurasi data Master SD secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🎒"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Sekolah",
              "href": null
      },
      {
              "label": "Master SD",
              "href": "/admin/master/sekolah/sd"
      }
]}
    />
  );
}
