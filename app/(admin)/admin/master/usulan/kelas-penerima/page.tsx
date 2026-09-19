import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Kelas Penerima | Admin Dikbud Konawe Selatan",
  description: "Manajemen Kelas Penerima Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KelasPenerimaPage() {
  return (
    <AdminPageScaffold
      title="Kelas Penerima"
      category="Data Master"
      description="Kelola dan konfigurasi data Kelas Penerima secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🏷️"
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
              "label": "Kelas Penerima",
              "href": "/admin/master/usulan/kelas-penerima"
      }
]}
    />
  );
}
