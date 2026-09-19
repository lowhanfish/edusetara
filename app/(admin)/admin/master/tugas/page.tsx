import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Master Tugas | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master Tugas Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterTugasPage() {
  return (
    <AdminPageScaffold
      title="Master Tugas"
      category="Data Master"
      description="Kelola dan konfigurasi data Master Tugas secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📌"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Tugas",
              "href": "/admin/master/tugas"
      }
]}
    />
  );
}
