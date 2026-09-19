import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Ruang | Admin Dikbud Konawe Selatan",
  description: "Manajemen Ruang Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function RuangPage() {
  return (
    <AdminPageScaffold
      title="Ruang"
      category="Sarana dan Prasarana"
      description="Kelola dan konfigurasi data Ruang secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🚪"
      breadcrumbs={[
      {
              "label": "Sarana dan Prasarana",
              "href": null
      },
      {
              "label": "Ruang",
              "href": "/admin/sarpras/ruang"
      }
]}
    />
  );
}
