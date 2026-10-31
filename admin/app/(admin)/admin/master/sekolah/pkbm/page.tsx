import SekolahManager from "../components/SekolahManager";

export const metadata = {
  title: "Master PKBM & SKB",
  description: "Manajemen Master Sanggar Kegiatan Belajar (SKB) dan PKBM Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterPKBMPage() {
  return (
    <SekolahManager
      jenjang="PKBM"
      title="Master PKBM & SKB"
      category="Data Master"
      description="Kelola dan konfigurasi direktori Satuan Pendidikan Nonformal Sanggar Kegiatan Belajar (SKB) dan PKBM se-Kabupaten Konawe Selatan berbasis data terintegrasi SIMPEG."
      icon="📖"
      breadcrumbs={[
        { label: "Master Sekolah", href: null },
      ]}
    />
  );
}
