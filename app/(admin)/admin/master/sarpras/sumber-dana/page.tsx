import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Sumber Dana | Admin Dikbud Konawe Selatan",
  description: "Manajemen Sumber Dana Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function SumberDanaPage() {
  return (
    <ContractCrudPage
      title="Sumber Dana"
      category="Data Master"
      description="Kelola dan konfigurasi data Sumber Dana secara berkala untuk mendukung tata kelola pendidikan terpadu."
      fields={[
        {"name": "title", "label": "Nama", "type": "text"},
        {"name": "desc", "label": "Penjelasan Singkat", "type": "textarea"},
      ]}
      initialData={[{"id": "seed-sd-0", "title": "Dana Alokasi Khusus (DAK)", "desc": "Transfer pusat untuk kegiatan fisik/sarana pendidikan.", "created_at": "2026-01-01", "created_by": "admin"}, {"id": "seed-sd-1", "title": "Bantuan Operasional Sekolah (BOS)", "desc": "Anggaran operasional reguler sekolah.", "created_at": "2026-01-01", "created_by": "admin"}, {"id": "seed-sd-2", "title": "Dana Hibah", "desc": "Bantuan pihak ketiga/yayasan/CSR.", "created_at": "2026-01-01", "created_by": "admin"}]}
    />
  );
}
