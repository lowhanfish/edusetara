import SekolahManager from "../master/sekolah/components/SekolahManager";

export const metadata = {
  title: "Direktori Satuan Pendidikan",
  description: "Pangkalan data seluruh Satuan Pendidikan terintegrasi SIMPEG Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function DirektoriSekolahPage() {
  return (
    <SekolahManager
      jenjang="ALL"
      title="Direktori Seluruh Satuan Pendidikan"
      category="Kelembagaan"
      description="Pangkalan data terpadu seluruh Satuan Pendidikan (TK/PAUD, SD, SMP, SATAP, SKB/PKBM) se-Kabupaten Konawe Selatan berbasis data terintegrasi SIMPEG."
      icon="🏫"
      breadcrumbs={[
        { label: "Direktori Sekolah", href: null },
      ]}
    />
  );
}
