import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Master Jenjang | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master Jenjang Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterJenjangPage() {
  return (
    <AdminPageScaffold
      title="Master Jenjang"
      category="Data Master"
      description="Kelola dan konfigurasi data Master Jenjang secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📊"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Jenjang",
              "href": "/admin/master/jenjang"
      }
]}
    />
  );
}
