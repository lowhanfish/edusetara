import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Kelas | Admin Dikbud Konawe Selatan",
  description: "Manajemen Kelas Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KelasPage() {
  return (
    <AdminPageScaffold
      title="Kelas"
      category="Data Master"
      description="Kelola dan konfigurasi data Kelas secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🏷️"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Jurnal",
              "href": null
      },
      {
              "label": "Kelas",
              "href": "/admin/master/jurnal/kelas"
      }
]}
    />
  );
}
