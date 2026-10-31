import SekolahManager from "../components/SekolahManager";

export const metadata = {
  title: "Master SMP",
  description: "Manajemen Master SMP dan SMP Satu Atap (SATAP) Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterSMPPage() {
  return (
    <SekolahManager
      jenjang="SMP"
      title="Master SMP"
      category="Data Master"
      description="Kelola dan konfigurasi direktori Satuan Pendidikan Sekolah Menengah Pertama (SMP) dan SMP Satu Atap (SATAP) se-Kabupaten Konawe Selatan berbasis data terintegrasi SIMPEG."
      icon="🏫"
      breadcrumbs={[
        { label: "Master Sekolah", href: null },
      ]}
    />
  );
}
