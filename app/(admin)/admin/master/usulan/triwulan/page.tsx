import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Triwulan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Triwulan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function TriwulanPage() {
  return (
    <AdminPageScaffold
      title="Triwulan"
      category="Data Master"
      description="Kelola dan konfigurasi data Triwulan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📅"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Usulan",
              "href": null
      },
      {
              "label": "Triwulan",
              "href": "/admin/master/usulan/triwulan"
      }
]}
    />
  );
}
