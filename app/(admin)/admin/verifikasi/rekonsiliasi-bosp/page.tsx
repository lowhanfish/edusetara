import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Verifikasi Usulan Rekonsiliasi Dana BOSP | Admin Dikbud Konawe Selatan",
  description: "Manajemen Verifikasi Usulan Rekonsiliasi Dana BOSP Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function VerifikasiUsulanRekonsiliasiDanaBOSPPage() {
  return (
    <AdminPageScaffold
      title="Verifikasi Usulan Rekonsiliasi Dana BOSP"
      category="Verifikasi"
      description="Kelola dan konfigurasi data Verifikasi Usulan Rekonsiliasi Dana BOSP secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📑"
      breadcrumbs={[
      {
              "label": "Verifikasi",
              "href": null
      },
      {
              "label": "Verifikasi Usulan Rekonsiliasi Dana BOSP",
              "href": "/admin/verifikasi/rekonsiliasi-bosp"
      }
]}
    />
  );
}
