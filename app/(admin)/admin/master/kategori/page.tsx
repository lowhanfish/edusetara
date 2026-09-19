import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Master Kategori | Admin Dikbud Konawe Selatan",
  description: "Manajemen Master Kategori Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterKategoriPage() {
  return (
    <AdminPageScaffold
      title="Master Kategori"
      category="Data Master"
      description="Kelola dan konfigurasi data Master Kategori secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🗂️"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Kategori",
              "href": "/admin/master/kategori"
      }
]}
    />
  );
}
