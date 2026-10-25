import { ContractCrudPage } from "../../_components/contract-crud-page";

export const metadata = {
  title: "Piagam Sertifikat | Admin Dikbud Konawe Selatan",
  description: "Manajemen Piagam Sertifikat Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PiagamSertifikatPage() {
  return (
    <ContractCrudPage
      title="Piagam Sertifikat"
      category="Piagam Sertifikat"
      description="Kelola dan konfigurasi data Piagam Sertifikat secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "kegiatan", "label": "Nama Pelatihan / Bimtek / Lomba", "type": "text"},
        {"name": "penyelenggara", "label": "Lembaga / Instansi Penyelenggara", "type": "text"},
        {"name": "tahun", "label": "Tahun Perolehan", "type": "number"},
        {"name": "tempat_pelaksana", "label": "Lokasi Pelaksanaan", "type": "text"},
        {"name": "sebagai", "label": "Peran (Peserta / Narasumber / Juara)", "type": "text"},
        {"name": "file", "label": "Berkas Piagam/Sertifikat (PDF)", "type": "text", "placeholder": "sertifikat.pdf"},
      ]}
      columns={["kegiatan", "penyelenggara", "tahun", "sebagai", "file"]}
    />
  );
}
