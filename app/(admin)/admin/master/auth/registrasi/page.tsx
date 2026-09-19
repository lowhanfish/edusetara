import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Registrasi | Admin Dikbud Konawe Selatan",
  description: "Manajemen Registrasi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function RegistrasiPage() {
  return (
    <AdminPageScaffold
      title="Registrasi"
      category="Data Master"
      description="Kelola dan konfigurasi data Registrasi secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="👤"
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
              "label": "Registrasi",
              "href": "/admin/master/auth/registrasi"
      }
]}
    />
  );
}
