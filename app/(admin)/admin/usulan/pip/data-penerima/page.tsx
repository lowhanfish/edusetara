import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Data Penerima | Admin Dikbud Konawe Selatan",
  description: "Manajemen Data Penerima Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function DataPenerimaPage() {
  return (
    <AdminPageScaffold
      title="Data Penerima"
      category="Usulan Sekolah"
      description="Kelola dan konfigurasi data Data Penerima secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="👥"
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
              "label": "Data Penerima",
              "href": "/admin/usulan/pip/data-penerima"
      }
]}
    />
  );
}
