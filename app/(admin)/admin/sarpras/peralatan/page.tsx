import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Peralatan / Aset | Admin Dikbud Konawe Selatan",
  description: "Manajemen Peralatan / Aset Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PeralatanAsetPage() {
  return (
    <AdminPageScaffold
      title="Peralatan / Aset"
      category="Sarana dan Prasarana"
      description="Kelola dan konfigurasi data Peralatan / Aset secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🖥️"
      breadcrumbs={[
      {
              "label": "Sarana dan Prasarana",
              "href": null
      },
      {
              "label": "Peralatan / Aset",
              "href": "/admin/sarpras/peralatan"
      }
]}
    />
  );
}
