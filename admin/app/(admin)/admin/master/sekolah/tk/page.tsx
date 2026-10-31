import SekolahManager from "../components/SekolahManager";

export const metadata = {
  title: "Master TK & PAUD",
  description: "Manajemen Master Taman Kanak-Kanak (TK) dan PAUD Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterTKPage() {
  return (
    <SekolahManager
      jenjang="TK"
      title="Master TK & PAUD"
      category="Data Master"
      description="Kelola dan konfigurasi direktori Satuan Pendidikan Taman Kanak-Kanak (TK Negeri/Swasta) dan PAUD se-Kabupaten Konawe Selatan berbasis data terintegrasi SIMPEG."
      icon="🧸"
      breadcrumbs={[
        { label: "Master Sekolah", href: null },
      ]}
    />
  );
}
