import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Mata Pelajaran | Admin Dikbud Konawe Selatan",
  description: "Manajemen Mata Pelajaran Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MataPelajaranPage() {
  return (
    <AdminPageScaffold
      title="Mata Pelajaran"
      category="Data Master"
      description="Kelola dan konfigurasi data Mata Pelajaran secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📐"
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
              "label": "Mata Pelajaran",
              "href": "/admin/master/jurnal/mata-pelajaran"
      }
]}
    />
  );
}
