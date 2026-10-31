import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Ruang | Admin Dikbud Konawe Selatan",
  description: "Manajemen Ruang Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function RuangPage() {
  return (
    <ContractCrudPage
      title="Ruang"
      category="Sarana dan Prasarana"
      description="Pemetaan unit ruangan pada bangunan yang telah diinput pada menu Bangunan."
      fields={[
        {name:"bangunan_id",label:"Bangunan",type:"select",options:[{value:"1",label:"Gedung Kelas 1"},{value:"2",label:"RKB Unit 1"}]},
        {name:"kelas_id",label:"Kelas",type:"select",options:[{value:"1",label:"Kelas 1"},{value:"2",label:"Kelas 2"}]},
        {name:"nama",label:"Nama Ruang",type:"text"},
        {name:"luas",label:"Luas Ruang (m²)",type:"text"},
        {name:"kondisi_id",label:"Kondisi",type:"select",options:[{value:"1",label:"Baik"},{value:"2",label:"Rusak Ringan"},{value:"3",label:"Rusak Berat"}]},
      ]}
    />
  );
}
