import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Usulan Rekonsiliasi Dana BOSP | Admin Dikbud Konawe Selatan",
  description: "Manajemen Usulan Rekonsiliasi Dana BOSP Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function UsulanRekonsiliasiDanaBOSPPage() {
  return (
    <AdminPageScaffold
      title="Usulan Rekonsiliasi Dana BOSP"
      category="Usulan Sekolah"
      description="Kelola dan konfigurasi data Usulan Rekonsiliasi Dana BOSP secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🧾"
      breadcrumbs={[
      {
              "label": "Usulan Sekolah",
              "href": null
      },
      {
              "label": "Usulan Rekonsiliasi Dana BOSP",
              "href": "/admin/usulan/rekonsiliasi-bosp"
      }
]}
    />
  );
}
