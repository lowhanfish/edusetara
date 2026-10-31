import { ContractCrudPage } from "../../_components/contract-crud-page";

export const metadata = {
  title: "Kuota PPDB",
  description: "Manajemen Kuota PPDB Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KuotaPPDBPage() {
  return (
    <ContractCrudPage
      title="Kuota PPDB"
      category="Kuota PPDB"
      description="Kelola dan konfigurasi data Kuota PPDB secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "nama_sekolah", "label": "Nama Satuan Pendidikan", "type": "text"},
        {"name": "jenjang", "label": "Jenjang Pendidikan", "type": "select", "options": [{"value": "PAUD", "label": "PAUD/TK (Maks 22/rombel)"}, {"value": "SD", "label": "SD (Maks 28/rombel)"}, {"value": "SMP", "label": "SMP (Maks 32/rombel)"}]},
        {"name": "jml_ruang_tersedia", "label": "Jumlah Ruang Kelas Fisik Tersedia", "type": "number"},
        {"name": "standar_maks_rombel", "label": "Standar Kapasitas per Rombel", "type": "number"},
        {"name": "total_daya_tampung", "label": "Total Daya Tampung", "type": "number"},
        {"name": "siswa_terdaftar", "label": "Jumlah Siswa Terdaftar", "type": "number"},
        {"name": "sisa_kuota", "label": "Sisa Kuota Kursi", "type": "number"},
        {"name": "status_kuota", "label": "Status Keterisian", "type": "select", "options": [{"value": "tersedia", "label": "Tersedia (Hijau)"}, {"value": "penuh", "label": "Penuh (Oranye)"}, {"value": "over", "label": "Melebihi Kuota (Merah)"}]},
      ]}
      columns={["nama_sekolah", "jenjang", "total_daya_tampung", "siswa_terdaftar", "sisa_kuota", "status_kuota"]}
    />
  );
}
