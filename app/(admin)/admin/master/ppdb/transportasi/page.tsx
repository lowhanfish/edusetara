import { AdminPageScaffold } from "../../../../_components/admin-page-scaffold";

export const metadata = {
  title: "Mode Transportasi | Admin Dikbud Konawe Selatan",
  description: "Manajemen Mode Transportasi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function ModeTransportasiPage() {
  return (
    <AdminPageScaffold
      title="Mode Transportasi"
      category="Data Master"
      description="Kelola dan konfigurasi data Mode Transportasi secara berkala untuk mendukung tata kelola pendidikan terpadu."
      icon="🚌"
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
              "label": "Mode Transportasi",
              "href": "/admin/master/ppdb/transportasi"
      }
]}
    />
  );
}
