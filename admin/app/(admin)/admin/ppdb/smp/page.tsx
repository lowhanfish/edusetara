import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "PPDB SMP | Admin Dikbud Konawe Selatan",
  description: "Manajemen PPDB SMP Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PPDBSMPPage() {
  return (
    <ContractCrudPage
      title="PPDB SMP"
      category="PPDB"
      description="Kelola dan konfigurasi data PPDB SMP secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "nama", "label": "Nama Lengkap Calon Siswa", "type": "text"},
        {"name": "nm_panggilan", "label": "Nama Panggilan", "type": "text"},
        {"name": "jns_kelamin", "label": "Jenis Kelamin", "type": "select", "options": [{"value": "L", "label": "Laki-laki"}, {"value": "P", "label": "Perempuan"}]},
        {"name": "nisn", "label": "NISN", "type": "number", "required": false},
        {"name": "nik", "label": "NIK Calon Siswa", "type": "number"},
        {"name": "tmp_lahir", "label": "Tempat Lahir", "type": "text"},
        {"name": "tgl_lahir", "label": "Tanggal Lahir", "type": "date"},
        {"name": "agama", "label": "Agama", "type": "select", "options": [{"value": "islam", "label": "Islam"}, {"value": "kristen", "label": "Kristen/Protestan"}, {"value": "katolik", "label": "Katholik"}, {"value": "hindu", "label": "Hindu"}, {"value": "budha", "label": "Buddha"}]},
        {"name": "alamat", "label": "Alamat Domisili Sesuai KK", "type": "text"},
        {"name": "tmp_tinggal", "label": "Status Tempat Tinggal", "type": "select", "options": [{"value": "ortu", "label": "Bersama Orang Tua"}, {"value": "wali", "label": "Wali"}, {"value": "kos", "label": "Kos"}, {"value": "asrama", "label": "Asrama"}]},
        {"name": "moda_transportasi", "label": "Moda Transportasi", "type": "select", "options": [{"value": "jalan", "label": "Jalan Kaki"}, {"value": "pribadi", "label": "Kendaraan Pribadi"}, {"value": "umum", "label": "Kendaraan Umum / Angkot"}, {"value": "antar_jemput", "label": "Jemputan Sekolah"}]},
        {"name": "nama_ayah", "label": "Nama Lengkap Ayah Kandung", "type": "text"},
        {"name": "pekerjaan_ayah", "label": "Pekerjaan Ayah", "type": "text"},
        {"name": "nama_ibu", "label": "Nama Lengkap Ibu Kandung", "type": "text"},
        {"name": "pekerjaan_ibu", "label": "Pekerjaan Ibu", "type": "text"},
        {"name": "file", "label": "Lampiran Pasfoto Calon Siswa", "type": "file", "accept": "image/*", "placeholder": "Unggah pasfoto siswa"},
      ]}
      columns={["nama", "jns_kelamin", "nisn", "nik", "alamat"]}
    />
  );
}
