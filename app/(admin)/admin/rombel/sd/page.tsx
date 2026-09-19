import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Jenjang SD | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jenjang SD Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JenjangSDPage() {
  return (
    <AdminPageScaffold
      title="Jenjang SD"
      category="Rombel"
      description="Kelola dan konfigurasi data Jenjang SD secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🎒"
      breadcrumbs={[
      {
              "label": "Rombel",
              "href": null
      },
      {
              "label": "Jenjang SD",
              "href": "/admin/rombel/sd"
      }
]}
    />
  );
}
