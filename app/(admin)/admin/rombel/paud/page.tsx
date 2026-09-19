import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Jenjang PAUD | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jenjang PAUD Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JenjangPAUDPage() {
  return (
    <AdminPageScaffold
      title="Jenjang PAUD"
      category="Rombel"
      description="Kelola dan konfigurasi data Jenjang PAUD secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🧸"
      breadcrumbs={[
      {
              "label": "Rombel",
              "href": null
      },
      {
              "label": "Jenjang PAUD",
              "href": "/admin/rombel/paud"
      }
]}
    />
  );
}
