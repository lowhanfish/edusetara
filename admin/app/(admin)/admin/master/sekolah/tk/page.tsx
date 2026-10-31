import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Master TK",
  description: "Manajemen Master TK Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterTKPage() {
  return (
    <AdminPageScaffold
      title="Master TK"
      category="Data Master"
      description="Kelola dan konfigurasi data Master TK secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🧸"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Sekolah",
              "href": null
      },
      {
              "label": "Master TK",
              "href": "/admin/master/sekolah/tk"
      }
]}
    />
  );
}
