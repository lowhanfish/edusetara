import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Pekerjaan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Pekerjaan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PekerjaanPage() {
  return (
    <AdminPageScaffold
      title="Pekerjaan"
      category="Data Master"
      description="Kelola dan konfigurasi data Pekerjaan secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="💼"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master PPDB",
              "href": null
      },
      {
              "label": "Pekerjaan",
              "href": "/admin/master/ppdb/pekerjaan"
      }
]}
    />
  );
}
