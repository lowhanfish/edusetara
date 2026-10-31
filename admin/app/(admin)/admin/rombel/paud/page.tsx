import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Jenjang PAUD",
  description: "Manajemen Jenjang PAUD Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JenjangPAUDPage() {
  return (
    <ContractCrudPage
      title="Jenjang PAUD"
      category="Rombel"
      description="Kelola dan konfigurasi data Jenjang PAUD secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "jns_rombel", "label": "Jenis Rombel", "type": "select", "options": [{"value": "0", "label": "Kelas"}, {"value": "1", "label": "Kelas Jauh/Kecil"}, {"value": "2", "label": "Kelas Terbuka"}]},
        {"name": "tgkt_pendidikan", "label": "Tingkat Pendidikan", "type": "select", "options": [{"value": "kb", "label": "KB"}, {"value": "tka", "label": "TK-A"}, {"value": "tkb", "label": "TK-B"}]},
        {"name": "kurikulum", "label": "Kurikulum", "type": "text"},
        {"name": "nama", "label": "Nama Rombel", "type": "text"},
        {"name": "wali_kelas", "label": "Wali Kelas (SIMPEG)", "type": "select", "options": [{"value": "g1", "label": "Contoh Guru 1"}, {"value": "g2", "label": "Contoh Guru 2"}]},
        {"name": "ruang_kelas", "label": "Ruang Kelas", "type": "select", "options": [{"value": "1", "label": "Ruang Kelas 1A"}, {"value": "2", "label": "Ruang Kelas 1"}]},
      ]}
      columns={["nama", "jns_rombel", "tgkt_pendidikan", "kurikulum", "wali_kelas", "ruang_kelas"]}
    />
  );
}
