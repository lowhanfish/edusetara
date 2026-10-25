import { ContractCrudPage } from "../../../../_components/contract-crud-page";

export const metadata = {
  title: "Data Pendukung | Admin Dikbud Konawe Selatan",
  description: "Manajemen Data Pendukung Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function DataPendukungPage() {
  return (
    <ContractCrudPage
      title="Data Pendukung"
      category="Usulan Bantuan PIP"
      description="Dokumen pendukung alokasi PIP (SK / Berita Acara): uraian, jenjang, nominal, tahun, dan lampiran."
      fields={[
        {name:"uraian",label:"Uraian",type:"textarea"},
        {name:"jenjang_id",label:"Jenjang",type:"select",options:[{value:"2",label:"SD"},{value:"3",label:"SMP"}]},
        {name:"nominal",label:"Nominal (Rp)",type:"number"},
        {name:"tahun",label:"Tahun Anggaran",type:"number"},
        {name:"file",label:"Lampiran Dokumen SK (PDF)",type:"file",accept:".pdf",placeholder:"Unggah dokumen SK/Berita Acara PDF"},
      ]}
      columns={["uraian","jenjang_id","nominal","tahun","file"]}
    />
  );
}
