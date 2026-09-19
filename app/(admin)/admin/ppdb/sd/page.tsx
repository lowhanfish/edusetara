import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "PPDB SD | Admin Dikbud Konawe Selatan",
  description: "Manajemen PPDB SD Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PPDBSDPage() {
  return (
    <AdminPageScaffold
      title="PPDB SD"
      category="PPDB"
      description="Kelola dan konfigurasi data PPDB SD secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🎒"
      breadcrumbs={[
      {
              "label": "PPDB",
              "href": null
      },
      {
              "label": "PPDB SD",
              "href": "/admin/ppdb/sd"
      }
]}
    />
  );
}
