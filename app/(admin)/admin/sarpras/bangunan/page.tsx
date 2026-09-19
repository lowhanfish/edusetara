import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Bangunan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Bangunan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function BangunanPage() {
  return (
    <AdminPageScaffold
      title="Bangunan"
      category="Sarana dan Prasarana"
      description="Kelola dan konfigurasi data Bangunan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🏫"
      breadcrumbs={[
      {
              "label": "Sarana dan Prasarana",
              "href": null
      },
      {
              "label": "Bangunan",
              "href": "/admin/sarpras/bangunan"
      }
]}
    />
  );
}
