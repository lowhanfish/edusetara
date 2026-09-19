import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Bangunan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Bangunan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function BangunanPage() {
  return (
    <AdminPageScaffold
      title="Bangunan"
      category="Data Master"
      description="Kelola dan konfigurasi data Bangunan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🏫"
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
              "label": "Bangunan",
              "href": "/admin/master/sarpras/bangunan"
      }
]}
    />
  );
}
