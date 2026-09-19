import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Bahan Ajar | Admin Dikbud Konawe Selatan",
  description: "Manajemen Bahan Ajar Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function BahanAjarPage() {
  return (
    <AdminPageScaffold
      title="Bahan Ajar"
      category="Data Master"
      description="Kelola dan konfigurasi data Bahan Ajar secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="📄"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Jurnal",
              "href": null
      },
      {
              "label": "Bahan Ajar",
              "href": "/admin/master/jurnal/bahan-ajar"
      }
]}
    />
  );
}
