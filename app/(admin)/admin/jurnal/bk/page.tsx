import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Jurnal BK | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jurnal BK Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JurnalBKPage() {
  return (
    <ContractCrudPage
      title="Jurnal BK"
      category="Jurnal V2"
      description="Kelola dan konfigurasi data Jurnal BK secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "nm_siswa", "label": "Nama Siswa Konseli", "type": "text"},
        {"name": "kelas_id", "label": "Kelas", "type": "select", "options": [{"value": "7a", "label": "Kelas 7A"}, {"value": "8b", "label": "Kelas 8B"}, {"value": "9a", "label": "Kelas 9A"}]},
        {"name": "tgl", "label": "Tanggal Pelaksanaan", "type": "date"},
        {"name": "materi_layanan", "label": "Materi / Topik Bimbingan", "type": "textarea"},
        {"name": "permasalahan", "label": "Gejala / Latar Belakang Masalah", "type": "textarea"},
        {"name": "mdl_kegiatan_id", "label": "Model Kegiatan", "type": "select", "options": [{"value": "1", "label": "Konseling Individu"}, {"value": "2", "label": "Bimbingan Kelompok"}, {"value": "3", "label": "Bimbingan Klasikal"}, {"value": "4", "label": "Home Visit"}]},
        {"name": "jns_layanan_id", "label": "Bidang Layanan BK", "type": "select", "options": [{"value": "pribadi", "label": "Layanan Pribadi"}, {"value": "sosial", "label": "Layanan Sosial"}, {"value": "belajar", "label": "Layanan Belajar"}, {"value": "karir", "label": "Layanan Karir"}]},
        {"name": "hasil", "label": "Hasil Konseling / Solusi", "type": "textarea"},
        {"name": "rnc_tindak_lanjut", "label": "Rencana Tindak Lanjut", "type": "textarea"},
        {"name": "keterangan", "label": "Catatan Perkembangan Siswa", "type": "text"},
        {"name": "file", "label": "Foto Sesi / Berkas Penanganan", "type": "file", "accept": ".pdf,image/*", "placeholder": "Unggah foto sesi atau berkas penanganan"},
      ]}
      columns={["nm_siswa", "kelas_id", "tgl", "jns_layanan_id", "mdl_kegiatan_id"]}
    />
  );
}
