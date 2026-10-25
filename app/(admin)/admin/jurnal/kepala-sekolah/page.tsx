import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Jurnal Kepala Sekolah | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jurnal Kepala Sekolah Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JurnalKepalaSekolahPage() {
  return (
    <ContractCrudPage
      title="Jurnal Kepala Sekolah"
      category="Jurnal V2"
      description="Kelola dan konfigurasi data Jurnal Kepala Sekolah secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "uraian", "label": "Uraian Tugas / Agenda", "type": "text"},
        {"name": "target", "label": "Target Capaian Sasaran", "type": "text"},
        {"name": "hasil", "label": "Hasil / Output Terealisasi", "type": "text"},
        {"name": "keterlibatan", "label": "Pihak yang Dilibatkan", "type": "text", "placeholder": "Dewan Guru, Pengawas, Komite"},
        {"name": "tgl", "label": "Tanggal Pelaksanaan", "type": "date"},
        {"name": "keterangan", "label": "Catatan Detail & Arahan Manajerial", "type": "textarea"},
        {"name": "file", "label": "Dokumen Pendukung / Notula (PDF/Foto)", "type": "text"},
      ]}
      columns={["uraian", "target", "hasil", "tgl", "keterlibatan"]}
    />
  );
}
