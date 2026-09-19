import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Visi dan Misi | Admin Dikbud Konawe Selatan",
  description: "Manajemen Visi dan Misi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function VisiDanMisiPage() {
  return (
    <AdminPageScaffold
      title="Visi dan Misi"
      category="Profile"
      description="Kelola dan konfigurasi data Visi dan Misi secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🎯"
      breadcrumbs={[
      {
              "label": "Profile",
              "href": null
      },
      {
              "label": "Visi dan Misi",
              "href": "/admin/profile/visi-misi"
      }
]}
    />
  );
}
