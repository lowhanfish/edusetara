import { MasterUsulanManagement } from "../master-usulan-management";

export const metadata = {
  title: "Jenis Penerima | Admin Dikbud Konawe Selatan",
  description: "Manajemen Jenis Penerima Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function JenisPenerimaPage() {
  return <MasterUsulanManagement kind="jenis-penerima" />;
}
