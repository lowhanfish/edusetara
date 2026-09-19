import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "PPDB PAUD | Admin Dikbud Konawe Selatan",
  description: "Manajemen PPDB PAUD Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PPDBPAUDPage() {
  return (
    <AdminPageScaffold
      title="PPDB PAUD"
      category="PPDB"
      description="Kelola dan konfigurasi data PPDB PAUD secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🧸"
      breadcrumbs={[
      {
              "label": "PPDB",
              "href": null
      },
      {
              "label": "PPDB PAUD",
              "href": "/admin/ppdb/paud"
      }
]}
    />
  );
}
