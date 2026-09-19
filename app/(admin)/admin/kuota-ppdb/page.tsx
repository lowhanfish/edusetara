import { AdminPageScaffold } from "../../_components/admin-page-scaffold";

export const metadata = {
  title: "Kuota PPDB | Admin Dikbud Konawe Selatan",
  description: "Manajemen Kuota PPDB Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KuotaPPDBPage() {
  return (
    <AdminPageScaffold
      title="Kuota PPDB"
      category="Kuota PPDB"
      description="Kelola dan konfigurasi data Kuota PPDB secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🔢"
      breadcrumbs={[
      {
              "label": "Kuota PPDB",
              "href": "/admin/kuota-ppdb"
      }
]}
    />
  );
}
