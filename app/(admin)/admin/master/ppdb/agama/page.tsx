import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Agama | Admin Dikbud Konawe Selatan",
  description: "Manajemen Agama Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function AgamaPage() {
  return (
    <AdminPageScaffold
      title="Agama"
      category="Data Master"
      description="Kelola dan konfigurasi data Agama secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🕌"
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
              "label": "Agama",
              "href": "/admin/master/ppdb/agama"
      }
]}
    />
  );
}
