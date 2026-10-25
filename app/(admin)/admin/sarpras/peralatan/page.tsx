import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Peralatan / Aset | Admin Dikbud Konawe Selatan",
  description: "Manajemen Peralatan / Aset Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function PeralatanAsetPage() {
  return (
    <ContractCrudPage
      title="Peralatan / Aset"
      category="Sarana dan Prasarana"
      description="Inventaris perangkat TIK, alat elektronik, dan furnitur pada masing-masing ruang."
      fields={[
        {name:"ruang_id",label:"Ruang",type:"select",options:[{value:"1",label:"Ruang Kelas 1A"},{value:"2",label:"Ruang Kelas 1"}]},
        {name:"nama",label:"Nama Peralatan / Aset",type:"text"},
        {name:"jml_alat",label:"Jumlah",type:"number"},
        {name:"kondisi_id",label:"Kondisi",type:"select",options:[{value:"1",label:"Baik"},{value:"2",label:"Rusak Ringan"},{value:"3",label:"Rusak Berat"}]},
        {name:"tahun",label:"Tahun Pengadaan",type:"number"},
        {name:"sumber_id",label:"Sumber Dana",type:"select",options:[{value:"1",label:"APBD"},{value:"2",label:"APBN / DAK"},{value:"3",label:"BOSP"}]},
      ]}
    />
  );
}
