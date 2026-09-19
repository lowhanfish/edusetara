import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Regulasi | Admin Dikbud Konawe Selatan",
  description: "Manajemen Regulasi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function RegulasiPage() {
  return (
    <AdminPageScaffold
      title="Regulasi"
      category="Regulasi dan Info GTK"
      description="Kelola dan konfigurasi data Regulasi secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="⚖️"
      breadcrumbs={[
      {
              "label": "Regulasi dan Info GTK",
              "href": null
      },
      {
              "label": "Regulasi",
              "href": "/admin/regulasi-gtk/regulasi"
      }
]}
    />
  );
}
