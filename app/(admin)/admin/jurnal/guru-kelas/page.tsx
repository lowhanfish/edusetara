import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Jurnal Guru Kelas | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jurnal Guru Kelas Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JurnalGuruKelasPage() {
  return (
    <AdminPageScaffold
      title="Jurnal Guru Kelas"
      category="Jurnal V2"
      description="Kelola dan konfigurasi data Jurnal Guru Kelas secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="👨‍🏫"
      breadcrumbs={[
      {
              "label": "Jurnal V2",
              "href": null
      },
      {
              "label": "Jurnal Guru Kelas",
              "href": "/admin/jurnal/guru-kelas"
      }
]}
    />
  );
}
