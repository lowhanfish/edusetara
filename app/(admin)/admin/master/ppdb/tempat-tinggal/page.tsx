import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Tempat Tinggal | Admin Dikbud Konawe Selatan",
  description: "Manajemen Tempat Tinggal Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function TempatTinggalPage() {
  return (
    <AdminPageScaffold
      title="Tempat Tinggal"
      category="Data Master"
      description="Kelola dan konfigurasi data Tempat Tinggal secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🏠"
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
              "label": "Tempat Tinggal",
              "href": "/admin/master/ppdb/tempat-tinggal"
      }
]}
    />
  );
}
