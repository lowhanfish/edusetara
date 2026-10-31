import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Master Siswa",
  description: "Manajemen Master Siswa Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function MasterSiswaPage() {
  return (
    <ContractCrudPage
      title="Master Siswa"
      category="Data Master"
      description="Kelola dan konfigurasi data Master Siswa secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "nama", "label": "Nama Lengkap Siswa", "type": "text"},
        {"name": "nisn", "label": "NISN", "type": "number"},
        {"name": "nik", "label": "NIK", "type": "number"},
        {"name": "jns_kelamin", "label": "Jenis Kelamin", "type": "select", "options": [{"value": "1", "label": "Laki-laki"}, {"value": "2", "label": "Perempuan"}]},
        {"name": "tmp_lahir", "label": "Tempat Lahir", "type": "text"},
        {"name": "tgl_lahir", "label": "Tanggal Lahir", "type": "date"},
        {"name": "alamat", "label": "Alamat Tempat Tinggal", "type": "text"},
      ]}
      columns={["nama", "nisn", "nik", "jns_kelamin", "alamat"]}
    />
  );
}
