import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Jurnal Guru Kelas | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jurnal Guru Kelas Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JurnalGuruKelasPage() {
  return (
    <ContractCrudPage
      title="Jurnal Guru Kelas"
      category="Jurnal V2"
      description="Kelola dan konfigurasi data Jurnal Guru Kelas secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "tema", "label": "Tema Pembelajaran", "type": "text"},
        {"name": "materi_pokok", "label": "Materi Pokok / Subtema", "type": "text"},
        {"name": "pertemuan_ke", "label": "Pertemuan Ke-", "type": "number"},
        {"name": "tgl", "label": "Tanggal Pelaksanaan", "type": "date"},
        {"name": "model_pembelajaran", "label": "Model Pembelajaran", "type": "select", "options": [{"value": "pbl", "label": "Problem Based Learning"}, {"value": "pjbl", "label": "Project Based Learning"}, {"value": "discovery", "label": "Discovery Learning"}]},
        {"name": "metode_pembelajaran", "label": "Metode Pembelajaran", "type": "select", "options": [{"value": "ceramah", "label": "Ceramah"}, {"value": "diskusi", "label": "Diskusi"}, {"value": "tanya_jawab", "label": "Tanya Jawab"}, {"value": "demonstrasi", "label": "Demonstrasi"}, {"value": "penugasan", "label": "Penugasan"}]},
        {"name": "kegiatan", "label": "Uraian Kegiatan Belajar", "type": "textarea"},
        {"name": "penilaian", "label": "Bentuk Penilaian", "type": "select", "options": [{"value": "sikap", "label": "Penilaian Sikap"}, {"value": "pengetahuan", "label": "Penilaian Pengetahuan"}, {"value": "keterampilan", "label": "Penilaian Keterampilan"}]},
        {"name": "siswa_hadir", "label": "Siswa Hadir", "type": "number"},
        {"name": "siswa_izin", "label": "Siswa Izin", "type": "number"},
        {"name": "siswa_sakit", "label": "Siswa Sakit", "type": "number"},
        {"name": "siswa_alpa", "label": "Siswa Alpa", "type": "number"},
        {"name": "persentase", "label": "Persentase Kehadiran (%)", "type": "number"},
        {"name": "keterangan", "label": "Catatan / Refleksi KBM", "type": "textarea"},
        {"name": "file", "label": "Foto Dokumentasi KBM", "type": "text", "placeholder": "nama file foto .jpg/.png"},
      ]}
      columns={["tema", "materi_pokok", "pertemuan_ke", "tgl", "persentase"]}
    />
  );
}
