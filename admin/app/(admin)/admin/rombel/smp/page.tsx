import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Jenjang SMP",
  description: "Manajemen Jenjang SMP Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JenjangSMPPage() {
  return (
    <ContractCrudPage
      title="Jenjang SMP"
      category="Rombel"
      description="Kelola dan konfigurasi data Jenjang SMP secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "jns_rombel", "label": "Jenis Rombel", "type": "select", "options": [{"value": "0", "label": "Kelas"}, {"value": "1", "label": "Kelas Jauh/Kecil"}, {"value": "2", "label": "Kelas Terbuka"}]},
        {"name": "tgkt_pendidikan", "label": "Tingkat Pendidikan", "type": "select", "options": [{"value": "7", "label": "Kelas 7"}, {"value": "8", "label": "Kelas 8"}, {"value": "9", "label": "Kelas 9"}]},
        {"name": "kurikulum", "label": "Kurikulum", "type": "text"},
        {"name": "nama", "label": "Nama Rombel", "type": "text"},
        {"name": "wali_kelas", "label": "Wali Kelas (SIMPEG)", "type": "select", "options": [{"value": "g1", "label": "Contoh Guru 1"}, {"value": "g2", "label": "Contoh Guru 2"}]},
        {"name": "ruang_kelas", "label": "Ruang Kelas", "type": "select", "options": [{"value": "1", "label": "Ruang Kelas 1A"}, {"value": "2", "label": "Ruang Kelas 1"}]},
      ]}
      columns={["nama", "jns_rombel", "tgkt_pendidikan", "kurikulum", "wali_kelas", "ruang_kelas"]}
    />
  );
}
