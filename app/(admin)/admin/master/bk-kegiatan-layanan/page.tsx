import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Master BK Kegiatan Layanan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master BK Kegiatan Layanan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterBKKegiatanLayananPage() {
  return (
    <AdminPageScaffold
      title="Master BK Kegiatan Layanan"
      category="Data Master"
      description="Kelola dan konfigurasi data Master BK Kegiatan Layanan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🩺"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master BK Kegiatan Layanan",
              "href": "/admin/master/bk-kegiatan-layanan"
      }
]}
    />
  );
}
