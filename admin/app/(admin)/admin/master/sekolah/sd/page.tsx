import SekolahManager from "../components/SekolahManager";

export const metadata = {
  title: "Master SD",
  description: "Manajemen Master SD dan SD Satu Atap (SATAP) Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterSDPage() {
  return (
    <SekolahManager
      jenjang="SD"
      title="Master SD"
      category="Data Master"
      description="Kelola dan konfigurasi direktori Satuan Pendidikan Sekolah Dasar (SD) dan SD Satu Atap (SATAP) se-Kabupaten Konawe Selatan berbasis data terintegrasi SIMPEG."
      icon="🎒"
      breadcrumbs={[
        { label: "Master Sekolah", href: null },
      ]}
    />
  );
}
