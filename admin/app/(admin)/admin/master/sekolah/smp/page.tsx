import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Master SMP",
  description: "Manajemen Master SMP Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterSMPPage() {
  return (
    <AdminPageScaffold
      title="Master SMP"
      category="Data Master"
      description="Kelola dan konfigurasi data Master SMP secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🏫"
      breadcrumbs={[
      {
              "label": "Data Master",
              "href": null
      },
      {
              "label": "Master Sekolah",
              "href": null
      },
      {
              "label": "Master SMP",
              "href": "/admin/master/sekolah/smp"
      }
]}
    />
  );
}
