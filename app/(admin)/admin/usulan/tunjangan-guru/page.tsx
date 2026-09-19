import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Usulan Tunjangan Guru | Admin Dikbud Konawe Selatan",
  description: "Manajemen Usulan Tunjangan Guru Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function UsulanTunjanganGuruPage() {
  return (
    <AdminPageScaffold
      title="Usulan Tunjangan Guru"
      category="Usulan Sekolah"
      description="Kelola dan konfigurasi data Usulan Tunjangan Guru secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="💰"
      breadcrumbs={[
      {
              "label": "Usulan Sekolah",
              "href": null
      },
      {
              "label": "Usulan Tunjangan Guru",
              "href": "/admin/usulan/tunjangan-guru"
      }
]}
    />
  );
}
