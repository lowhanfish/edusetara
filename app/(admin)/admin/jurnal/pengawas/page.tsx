import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Jurnal Pengawas | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jurnal Pengawas Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JurnalPengawasPage() {
  return (
    <AdminPageScaffold
      title="Jurnal Pengawas"
      category="Jurnal V2"
      description="Kelola dan konfigurasi data Jurnal Pengawas secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🔍"
      breadcrumbs={[
      {
              "label": "Jurnal V2",
              "href": null
      },
      {
              "label": "Jurnal Pengawas",
              "href": "/admin/jurnal/pengawas"
      }
]}
    />
  );
}
