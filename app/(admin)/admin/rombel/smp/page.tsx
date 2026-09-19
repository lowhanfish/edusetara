import { AdminPageScaffold } from "../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Jenjang SMP | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jenjang SMP Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JenjangSMPPage() {
  return (
    <AdminPageScaffold
      title="Jenjang SMP"
      category="Rombel"
      description="Kelola dan konfigurasi data Jenjang SMP secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🏫"
      breadcrumbs={[
      {
              "label": "Rombel",
              "href": null
      },
      {
              "label": "Jenjang SMP",
              "href": "/admin/rombel/smp"
      }
]}
    />
  );
}
