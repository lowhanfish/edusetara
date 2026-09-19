import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Tugas Dan Fungsi | Admin Dikbud Konawe Selatan",
  description: "Manajemen Tugas Dan Fungsi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function TugasDanFungsiPage() {
  return (
    <AdminPageScaffold
      title="Tugas Dan Fungsi"
      category="Profile"
      description="Kelola dan konfigurasi data Tugas Dan Fungsi secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="⚖️"
      breadcrumbs={[
      {
              "label": "Profile",
              "href": null
      },
      {
              "label": "Tugas Dan Fungsi",
              "href": "/admin/profile/tugas-fungsi"
      }
]}
    />
  );
}
