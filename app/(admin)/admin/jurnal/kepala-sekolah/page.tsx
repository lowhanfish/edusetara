import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Jurnal Kepala Sekolah | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jurnal Kepala Sekolah Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JurnalKepalaSekolahPage() {
  return (
    <AdminPageScaffold
      title="Jurnal Kepala Sekolah"
      category="Jurnal V2"
      description="Kelola dan konfigurasi data Jurnal Kepala Sekolah secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="👔"
      breadcrumbs={[
      {
              "label": "Jurnal V2",
              "href": null
      },
      {
              "label": "Jurnal Kepala Sekolah",
              "href": "/admin/jurnal/kepala-sekolah"
      }
]}
    />
  );
}
