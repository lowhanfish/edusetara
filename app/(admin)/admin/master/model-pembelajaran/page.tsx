import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Master Model Pembelajaran | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master Model Pembelajaran Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterModelPembelajaranPage() {
  return (
    <AdminPageScaffold
      title="Master Model Pembelajaran"
      category="Data Master"
      description="Kelola dan konfigurasi data Master Model Pembelajaran secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="💡"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Model Pembelajaran",
              "href": "/admin/master/model-pembelajaran"
      }
]}
    />
  );
}
