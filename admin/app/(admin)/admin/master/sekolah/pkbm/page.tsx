import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Master PKBM | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master PKBM Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterPKBMPage() {
  return (
    <AdminPageScaffold
      title="Master PKBM"
      category="Data Master"
      description="Kelola dan konfigurasi data Master PKBM secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📖"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Sekolah",
              "href": null
      },
      {
              "label": "Master PKBM",
              "href": "/admin/master/sekolah/pkbm"
      }
]}
    />
  );
}
