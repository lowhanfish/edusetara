import { MasterUsulanManagement } from "../master-usulan-management";

export const metadata = {
  title: "Triwulan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Triwulan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function TriwulanPage() {
  return <MasterUsulanManagement kind="triwulan" />;
}
