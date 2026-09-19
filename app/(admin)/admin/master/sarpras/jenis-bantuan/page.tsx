import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Jenis Bantuan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jenis Bantuan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JenisBantuanPage() {
  return (
    <AdminPageScaffold
      title="Jenis Bantuan"
      category="Data Master"
      description="Kelola dan konfigurasi data Jenis Bantuan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🎁"
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
              "label": "Jenis Bantuan",
              "href": "/admin/master/sarpras/jenis-bantuan"
      }
]}
    />
  );
}
