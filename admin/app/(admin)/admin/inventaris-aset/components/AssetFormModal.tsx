"use client";
import { useState } from "react";
import { Button, Input, Modal, Select } from "@/app/(admin)/_components/ui";
import LookupField from "../../master/master_aset/_shared/LookupField";
import type { FieldDef } from "../../master/master_aset/_shared/types";
import { useCorrectInventory, useCreateInventory, useInventoryOptions } from "../hooks";
import { KIB, errorText, kibOf } from "../types";
import type { AssetDetail } from "../types";

const codeField: FieldDef = {
  key: "kode_barang", label: "Kode barang rinci", type: "lookup", placeholder: "Cari kode atau nama barang...",
  helper: "Pilih kode level 7 (sub-sub rincian objek). Kelompok KIB mengikuti kode ini.", lookup: {
    path: "/api/v1/admin/inventaris-aset/pilihan-kode-barang", labelKey: "uraian_barang",
    toChoice: (item) => ({ value: String(item.id), label: String(item.value) }),
  },
};

/** Pencatatan awal (tanpa `asset`) atau koreksi data barang yang sudah tercatat (dengan `asset`). */
export default function AssetFormModal({ schoolId = "", schoolName = "", asset, onClose }: { schoolId?: string; schoolName?: string; asset?: AssetDetail; onClose: () => void }) {
  const create = useCreateInventory();
  const correct = useCorrectInventory(asset?.id ?? "");
  const save = asset ? correct : create;
  const { conditions, sources } = useInventoryOptions();
  const [code, setCode] = useState(asset?.kode_barang ?? "");
  const [codeLabel, setCodeLabel] = useState(asset ? `${asset.kode_barang} · ${asset.uraian_barang}` : "");
  const [validation, setValidation] = useState("");
  const kib = kibOf(code);
  const waitingConditions = !asset && (conditions.isError || conditions.isPending);
  return <Modal isOpen onClose={() => { if (!save.isPending) onClose(); }} title={asset ? "Koreksi Data Aset" : "Catat Aset Sekolah"}
    description={asset ? `Perbaiki data yang salah catat · ${asset.upb_nama}` : `Satu formulir untuk satu barang / nomor register · ${schoolName}`} maxWidth="xl"
    footer={<><Button variant="outline" disabled={save.isPending} onClick={onClose}>Batal</Button><Button type="submit" form="asset-form" disabled={save.isPending || waitingConditions}>{save.isPending ? "Menyimpan..." : asset ? "Simpan koreksi" : "Simpan aset"}</Button></>}>
    <form id="asset-form" className="space-y-4" onSubmit={(event) => {
      event.preventDefault();
      if (!code || code.split(".").length !== 7) { setValidation("Pilih kode barang rinci level 7 terlebih dahulu."); return; }
      if (!kib) { setValidation("Kode barang ini bukan aset tetap KIB A–F."); return; }
      setValidation("");
      const fields = Object.fromEntries(new FormData(event.currentTarget));
      const body = { ...fields, kode_barang: code, kib,
        tahun_perolehan: Number(fields.tahun_perolehan),
        tanggal_perolehan: fields.tanggal_perolehan || null, sumber_dana_id: fields.sumber_dana_id || null,
      };
      if (asset) correct.mutate({ ...body, version: asset.version }, { onSuccess: onClose });
      else create.mutate({ ...body, sekolah_id: schoolId, kondisi_kode: Number(fields.kondisi_kode) }, { onSuccess: onClose });
    }}>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">{asset
        ? "Koreksi hanya untuk memperbaiki salah catat. Setiap perubahan beserta alasannya tersimpan di riwayat barang. Kondisi diubah lewat Perbarui kondisi."
        : "Nomor register, kode barang, tahun perolehan, dan UPB menjadi identitas barang. Periksa nilainya sebelum menyimpan."}</div>
      <LookupField field={codeField} value={code} valueLabel={codeLabel} onChange={(value, label) => { setCode(value); setCodeLabel(label); }} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="nama" label="Nama / deskripsi barang" required maxLength={255} defaultValue={asset?.nama} placeholder="Contoh: Laptop ruang tata usaha" />
        <Input name="nomor_register" label="Nomor register" required maxLength={50} defaultValue={asset?.nomor_register} placeholder="Contoh: 000001" />
        <Input label="Kelompok KIB" readOnly value={kib ? KIB[kib] : code ? "Bukan aset tetap KIB A–F" : "Mengikuti kode barang"} />
        <Input name="lokasi" label="Lokasi / ruangan" required maxLength={255} defaultValue={asset?.lokasi} placeholder="Contoh: Ruang tata usaha" />
        <Input name="tahun_perolehan" label="Tahun perolehan" type="number" min={1900} max={2100} defaultValue={asset?.tahun_perolehan ?? new Date().getFullYear()} required />
        <Input name="tanggal_perolehan" label="Tanggal perolehan (opsional)" type="date" defaultValue={asset?.tanggal_perolehan ?? ""} />
        <Input name="nilai_perolehan" label="Nilai perolehan (Rp)" type="number" min="0" step="0.01" required defaultValue={asset?.nilai_perolehan} placeholder="0" />
        {!asset && <Select name="kondisi_kode" label="Kondisi awal" required defaultValue="" disabled={conditions.isPending || conditions.isError}>
          <option value="">{conditions.isPending ? "Memuat kondisi..." : "Pilih kondisi"}</option>
          {conditions.data?.map((item) => <option key={item.id} value={item.id}>{item.value}</option>)}
        </Select>}
        <Input name="merk" label="Merk / tipe (opsional)" maxLength={150} defaultValue={asset?.merk ?? ""} />
        <Input name="nomor_seri" label="Nomor seri (opsional)" maxLength={150} defaultValue={asset?.nomor_seri ?? ""} />
        <Select key={sources.data ? "sources" : "loading"} name="sumber_dana_id" label="Sumber dana (opsional)" defaultValue={asset?.sumber_dana_id ?? ""}>
          <option value="">Belum dicatat</option>
          {!sources.data && asset?.sumber_dana_id && <option value={asset.sumber_dana_id}>{asset.sumber_dana_nama}</option>}
          {sources.data?.map((item) => <option key={item.id} value={item.id}>{item.uraian}</option>)}
        </Select>
        <Input name="keterangan" label="Keterangan (opsional)" maxLength={4000} defaultValue={asset?.keterangan ?? ""} />
      </div>
      {asset && <Input name="alasan" label="Alasan koreksi" required maxLength={1000} placeholder="Contoh: salah ketik nilai perolehan saat pencatatan awal" />}
      {!asset && conditions.isError && <p role="alert" className="text-xs text-rose-700">Gagal memuat master kondisi. <button type="button" className="underline" onClick={() => conditions.refetch()}>Coba lagi</button></p>}
      {sources.isError && <p role="alert" className="text-xs text-amber-800">Sumber dana gagal dimuat. {asset ? "Pilihan yang tersimpan tetap dipakai." : "Anda dapat mengosongkannya."}</p>}
      {(validation || save.isError) && <p role="alert" className="text-sm text-rose-700">{validation || errorText(save.error)}</p>}
    </form>
  </Modal>;
}
