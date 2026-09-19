import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Jurnal BK | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jurnal BK Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JurnalBKPage() {
  return (
    <AdminPageScaffold
      title="Jurnal BK"
      category="Jurnal V2"
      description="Kelola dan konfigurasi data Jurnal BK secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🧑‍⚕️"
      breadcrumbs={[
      {
              "label": "Jurnal V2",
              "href": null
      },
      {
              "label": "Jurnal BK",
              "href": "/admin/jurnal/bk"
      }
]}
    />
  );
}
