import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Master Pendampingan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master Pendampingan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterPendampinganPage() {
  return (
    <AdminPageScaffold
      title="Master Pendampingan"
      category="Data Master"
      description="Kelola dan konfigurasi data Master Pendampingan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🤝"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Pendampingan",
              "href": "/admin/master/pendampingan"
      }
]}
    />
  );
}
