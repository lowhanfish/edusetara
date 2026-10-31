import { MasterUsulanManagement } from "../master-usulan-management";

export const metadata = {
  title: "Kelas Penerima",
  description: "Manajemen Kelas Penerima Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function KelasPenerimaPage() {
  return <MasterUsulanManagement kind="kelas-penerima" />;
}
