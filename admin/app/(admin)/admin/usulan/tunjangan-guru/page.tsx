import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Usulan Tunjangan Guru",
  description: "Manajemen Usulan Tunjangan Guru Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function UsulanTunjanganGuruPage() {
  return (
    <ContractCrudPage
      title="Usulan Tunjangan Guru"
      category="Usulan Sekolah"
      description="Kelola dan konfigurasi data Usulan Tunjangan Guru secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "tahun", "label": "Tahun", "type": "select", "options": [{"value": "2025", "label": "2025"}, {"value": "2026", "label": "2026"}]},
        {"name": "triwulan_id", "label": "Triwulan", "type": "select", "options": [{"value": "1", "label": "Triwulan I"}, {"value": "2", "label": "Triwulan II"}, {"value": "3", "label": "Triwulan III"}, {"value": "4", "label": "Triwulan IV"}]},
        {"name": "jns_penerimaan_id", "label": "Jenis Penerimaan", "type": "select", "options": [{"value": "tpg-pns", "label": "TPG PNS"}, {"value": "tpg-pppk", "label": "TPG PPPK"}, {"value": "tamsil-pns", "label": "Tamsil PNS"}, {"value": "tamsil-pppk", "label": "Tamsil PPPK"}, {"value": "khusus", "label": "Tunjangan Khusus"}]},
        {"name": "kelas_penerima_id", "label": "Kelas Penerima", "type": "select", "options": [{"value": "tk", "label": "Guru Kelas TK"}, {"value": "sd", "label": "Guru Kelas SD"}, {"value": "smp", "label": "Guru Mapel SMP"}, {"value": "bk", "label": "Guru BK"}, {"value": "kepsek", "label": "Kepala Sekolah"}]},
        {"name": "nama", "label": "Nama (dari SIMPEG)", "type": "text"},
        {"name": "nip", "label": "NIP / NIPPPK (dari SIMPEG)", "type": "text"},
      ]}
    />
  );
}
