import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Jenis Penerima | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jenis Penerima Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JenisPenerimaPage() {
  return (
    <AdminPageScaffold
      title="Jenis Penerima"
      category="Data Master"
      description="Kelola dan konfigurasi data Jenis Penerima secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="👥"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Usulan",
              "href": null
      },
      {
              "label": "Jenis Penerima",
              "href": "/admin/master/usulan/jenis-penerima"
      }
]}
    />
  );
}
