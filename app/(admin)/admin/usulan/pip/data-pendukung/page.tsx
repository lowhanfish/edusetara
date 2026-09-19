import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Data Pendukung | Admin Dikbud Konawe Selatan",
  description: "Manajemen Data Pendukung Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function DataPendukungPage() {
  return (
    <AdminPageScaffold
      title="Data Pendukung"
      category="Usulan Sekolah"
      description="Kelola dan konfigurasi data Data Pendukung secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📁"
      breadcrumbs={[
      {
              "label": "Usulan Sekolah",
              "href": null
      },
      {
              "label": "Usulan Bantuan PIP",
              "href": null
      },
      {
              "label": "Data Pendukung",
              "href": "/admin/usulan/pip/data-pendukung"
      }
]}
    />
  );
}
