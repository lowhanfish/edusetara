import { ContractCrudPage } from "../../../_components/contract-crud-page";

export const metadata = {
  title: "Bangunan | Admin Dikbud Konawe Selatan",
  description: "Manajemen Bangunan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
};

export default function BangunanPage() {
  return (
    <ContractCrudPage
      title="Bangunan"
      category="Sarana dan Prasarana"
      description="Data unit bangunan di atas lahan sekolah: luas, kepemilikan, tahun, kerusakan, kondisi, dan sumber dana."
      fields={[
        {name:"nama",label:"Nama Bangunan",type:"text"},
        {name:"luas",label:"Luas Bangunan (m²)",type:"text"},
        {name:"kepemilikan_id",label:"Kepemilikan",type:"select",options:[{value:"1",label:"Milik Sendiri"},{value:"2",label:"Pinjam"}]},
        {name:"tahun",label:"Tahun Bangunan",type:"text"},
        {name:"persentase",label:"Persentase Kerusakan (%)",type:"number"},
        {name:"kondisi_id",label:"Kondisi",type:"select",options:[{value:"1",label:"Baik"},{value:"2",label:"Rusak Ringan"},{value:"3",label:"Rusak Berat"}]},
        {name:"jns_bantuan_id",label:"Jenis Bantuan",type:"select",options:[{value:"1",label:"RKB"},{value:"2",label:"Rehabilitasi"}]},
        {name:"sumber_id",label:"Sumber Dana",type:"select",options:[{value:"1",label:"APBD"},{value:"2",label:"APBN / DAK"},{value:"3",label:"BOSP"}]},
      ]}
      columns={["nama","luas","kepemilikan_id","tahun","persentase","kondisi_id"]}
    />
  );
}
