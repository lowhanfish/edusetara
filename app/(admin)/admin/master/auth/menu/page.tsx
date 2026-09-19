import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Menu | Admin Dikbud Konawe Selatan",
  description: "Manajemen Menu Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MenuPage() {
  return (
    <AdminPageScaffold
      title="Menu"
      category="Data Master"
      description="Kelola dan konfigurasi data Menu secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📑"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Auth",
              "href": null
      },
      {
              "label": "Menu",
              "href": "/admin/master/auth/menu"
      }
]}
    />
  );
}
