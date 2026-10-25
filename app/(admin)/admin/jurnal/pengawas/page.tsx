import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Jurnal Pengawas | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jurnal Pengawas Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JurnalPengawasPage() {
  return (
    <ContractCrudPage
      title="Jurnal Pengawas"
      category="Jurnal V2"
      description="Kelola dan konfigurasi data Jurnal Pengawas secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "unit_kerja", "label": "Sekolah Binaan Dikunjungi", "type": "select", "options": [{"value": "sdn1", "label": "SD Negeri 1 Ranomeeto"}, {"value": "smpn22", "label": "SMP Negeri 22 Konsel"}, {"value": "sdn2", "label": "SD Negeri 2 Buke"}]},
        {"name": "kepsek", "label": "Kepala Sekolah Didampingi", "type": "select", "options": [{"value": "k1", "label": "Drs. H. Ahmad, M.Pd."}, {"value": "k2", "label": "Nur Aini, S.Pd."}]},
        {"name": "pendampingan_id", "label": "Jenis Pendampingan", "type": "select", "options": [{"value": "1", "label": "Pendampingan Perencanaan Kerja"}, {"value": "2", "label": "Pendampingan Program Sekolah"}, {"value": "3", "label": "Supervisi KOSP"}]},
        {"name": "temuan_akademik", "label": "Temuan Akademik", "type": "text"},
        {"name": "temuan_manajerial", "label": "Temuan Manajerial", "type": "text"},
        {"name": "tindak_lanjut", "label": "Arahan Rekomendasi / Tindak Lanjut", "type": "textarea"},
        {"name": "tugas_id", "label": "Tugas Kepengawasan", "type": "select", "options": [{"value": "1", "label": "Supervisi Akademik"}, {"value": "2", "label": "Monitoring Asesmen Nasional"}, {"value": "3", "label": "Evaluasi Sarpras"}]},
        {"name": "tgl", "label": "Tanggal Pelaksanaan", "type": "date"},
        {"name": "file", "label": "Lembar Instrumen / Foto", "type": "file", "accept": ".pdf,image/*", "placeholder": "Unggah lembar instrumen atau foto"},
      ]}
      columns={["unit_kerja", "kepsek", "pendampingan_id", "tgl", "temuan_akademik"]}
    />
  );
}
