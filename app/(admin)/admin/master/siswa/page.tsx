import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Master Siswa | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master Siswa Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterSiswaPage() {
  return (
    <AdminPageScaffold
      title="Master Siswa"
      category="Data Master"
      description="Kelola dan konfigurasi data Master Siswa secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🎓"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Siswa",
              "href": "/admin/master/siswa"
      }
]}
    />
  );
}
