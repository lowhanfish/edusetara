import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Master BK Jenis Layanan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master BK Jenis Layanan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterBKJenisLayananPage() {
  return (
    <AdminPageScaffold
      title="Master BK Jenis Layanan"
      category="Data Master"
      description="Kelola dan konfigurasi data Master BK Jenis Layanan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🧑‍⚕️"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master BK Jenis Layanan",
              "href": "/admin/master/bk-jenis-layanan"
      }
]}
    />
  );
}
