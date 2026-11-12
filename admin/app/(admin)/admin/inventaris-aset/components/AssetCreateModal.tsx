"use client";
import { useState } from "react";
import { Button, Input, Modal, Select } from "@/app/(admin)/_components/ui";
import LookupField from "../../master/master_aset/_shared/LookupField";
import type { FieldDef } from "../../master/master_aset/_shared/types";
import { useCreateInventory, useInventoryOptions } from "../hooks";
import { KIB, errorText } from "../types";

const codeField: FieldDef = {
  key: "kode_barang", label: "Kode barang rinci", type: "lookup", placeholder: "Cari kode atau nama barang...",
  helper: "Pilih kode level 7 (sub-sub rincian objek).", lookup: {
    path: "/api/v1/admin/inventaris-aset/pilihan-kode-barang", labelKey: "uraian_barang",
    toChoice: (item) => ({ value: String(item.id), label: String(item.value) }),
  },
};
export default function AssetCreateModal({ schoolId, schoolName, onClose }: { schoolId: string; schoolName: string; onClose: () => void }) {
  const create = useCreateInventory();
  const { conditions, sources } = useInventoryOptions();
  const [code, setCode] = useState("");
  const [codeLabel, setCodeLabel] = useState("");
  const [validation, setValidation] = useState("");
  return <Modal isOpen onClose={() => { if (!create.isPending) onClose(); }} title="Catat Aset Sekolah" description={`Satu formulir untuk satu barang / nomor register · ${schoolName}`} maxWidth="xl"
    footer={<><Button variant="outline" disabled={create.isPending} onClick={onClose}>Batal</Button><Button type="submit" form="asset-create" disabled={create.isPending || conditions.isError || conditions.isPending}>{create.isPending ? "Menyimpan..." : "Simpan aset"}</Button></>}>
    <form id="asset-create" className="space-y-4" onSubmit={(event) => {
      event.preventDefault();
      if (!code || code.split(".").length !== 7) { setValidation("Pilih kode barang rinci level 7 terlebih dahulu."); return; }
      setValidation("");
      const form = new FormData(event.currentTarget);
      const fields = Object.fromEntries(form);
      create.mutate({ ...fields, sekolah_id: schoolId, kode_barang: code,
        tahun_perolehan: Number(fields.tahun_perolehan), kondisi_kode: Number(fields.kondisi_kode),
        tanggal_perolehan: fields.tanggal_perolehan || null, sumber_dana_id: fields.sumber_dana_id || null,
      }, { onSuccess: onClose });
    }}>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Nomor register, kode barang, tahun perolehan, dan UPB menjadi identitas barang. Periksa nilainya sebelum menyimpan.</div>
      <LookupField field={codeField} value={code} valueLabel={codeLabel} onChange={(value, label) => { setCode(value); setCodeLabel(label); }} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="nama" label="Nama / deskripsi barang" required maxLength={255} placeholder="Contoh: Laptop ruang tata usaha" />
        <Input name="nomor_register" label="Nomor register" required maxLength={50} placeholder="Contoh: 000001" />
        <Select name="kib" label="Kelompok KIB" required defaultValue="B">{Object.entries(KIB).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</Select>
        <Input name="lokasi" label="Lokasi / ruangan" required maxLength={255} placeholder="Contoh: Ruang tata usaha" />
        <Input name="tahun_perolehan" label="Tahun perolehan" type="number" min={1900} max={2100} defaultValue={new Date().getFullYear()} required />
        <Input name="tanggal_perolehan" label="Tanggal perolehan (opsional)" type="date" />
        <Input name="nilai_perolehan" label="Nilai perolehan (Rp)" type="number" min="0" step="0.01" required placeholder="0" />
        <Select name="kondisi_kode" label="Kondisi awal" required defaultValue="" disabled={conditions.isPending || conditions.isError}>
          <option value="">{conditions.isPending ? "Memuat kondisi..." : "Pilih kondisi"}</option>
          {conditions.data?.map((item) => <option key={item.id} value={item.id}>{item.value}</option>)}
        </Select>
        <Input name="merk" label="Merk / tipe (opsional)" maxLength={150} />
        <Input name="nomor_seri" label="Nomor seri (opsional)" maxLength={150} />
        <Select name="sumber_dana_id" label="Sumber dana (opsional)"><option value="">Belum dicatat</option>{sources.data?.map((item) => <option key={item.id} value={item.id}>{item.uraian}</option>)}</Select>
        <Input name="keterangan" label="Keterangan (opsional)" maxLength={4000} />
      </div>
      {conditions.isError && <p role="alert" className="text-xs text-rose-700">Gagal memuat master kondisi. <button type="button" className="underline" onClick={() => conditions.refetch()}>Coba lagi</button></p>}
      {sources.isError && <p role="alert" className="text-xs text-amber-800">Sumber dana gagal dimuat. Anda dapat mengosongkannya.</p>}
      {(validation || create.isError) && <p role="alert" className="text-sm text-rose-700">{validation || errorText(create.error)}</p>}
    </form>
  </Modal>;
}
