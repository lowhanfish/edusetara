import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Kondisi Alat | Admin Dikbud Konawe Selatan",
  description: "Manajemen Kondisi Alat Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KondisiAlatPage() {
  return (
    <AdminPageScaffold
      title="Kondisi Alat"
      category="Data Master"
      description="Kelola dan konfigurasi data Kondisi Alat secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🔧"
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
              "label": "Kondisi Alat",
              "href": "/admin/master/sarpras/kondisi-alat"
      }
]}
    />
  );
}
