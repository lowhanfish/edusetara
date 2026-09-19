import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Verifikasi Tunjangan Guru | Admin Dikbud Konawe Selatan",
  description: "Manajemen Verifikasi Tunjangan Guru Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function VerifikasiTunjanganGuruPage() {
  return (
    <AdminPageScaffold
      title="Verifikasi Tunjangan Guru"
      category="Verifikasi"
      description="Kelola dan konfigurasi data Verifikasi Tunjangan Guru secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="💰"
      breadcrumbs={[
      {
              "label": "Verifikasi",
              "href": null
      },
      {
              "label": "Verifikasi Tunjangan Guru",
              "href": "/admin/verifikasi/tunjangan-guru"
      }
]}
    />
  );
}
