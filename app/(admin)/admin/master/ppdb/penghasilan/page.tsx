import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Penghasilan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Penghasilan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PenghasilanPage() {
  return (
    <AdminPageScaffold
      title="Penghasilan"
      category="Data Master"
      description="Kelola dan konfigurasi data Penghasilan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="💵"
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
              "label": "Penghasilan",
              "href": "/admin/master/ppdb/penghasilan"
      }
]}
    />
  );
}
