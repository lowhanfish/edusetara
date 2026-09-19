import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "PPDB SMP | Admin Dikbud Konawe Selatan",
  description: "Manajemen PPDB SMP Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PPDBSMPPage() {
  return (
    <AdminPageScaffold
      title="PPDB SMP"
      category="PPDB"
      description="Kelola dan konfigurasi data PPDB SMP secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🏫"
      breadcrumbs={[
      {
              "label": "PPDB",
              "href": null
      },
      {
              "label": "PPDB SMP",
              "href": "/admin/ppdb/smp"
      }
]}
    />
  );
}
