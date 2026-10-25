import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Tanah Sekolah | Admin Dikbud Konawe Selatan",
  description: "Manajemen Tanah Sekolah Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function TanahSekolahPage() {
  return (
    <ContractCrudPage
      title="Tanah Sekolah"
      category="Sarana dan Prasarana"
      description="Data bidang tanah yang dimiliki atau dikuasai satuan pendidikan beserta luas dan dokumen bukti kepemilikan."
      fields={[
        {name:"title",label:"Luas Tanah (m²)",type:"number"},
        {name:"file",label:"Berkas Bukti Kepemilikan",type:"text",placeholder:"nama berkas / URL, misal: sertifikat.pdf"},
      ]}
    />
  );
}
