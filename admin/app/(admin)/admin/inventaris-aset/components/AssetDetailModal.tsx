"use client";
import { useEffect, useState } from "react";
import { Button, Input, Modal, Select } from "@/app/(admin)/_components/ui";
import { useUrlStore } from "@/store/useUrlStore";
import LookupField from "../../master/master_aset/_shared/LookupField";
import type { FieldDef } from "../../master/master_aset/_shared/types";
import { useInventoryDetail, useInventoryOptions, usePlaceInventory, useUpdateCondition } from "../hooks";
import { KIB, errorText, rupiah } from "../types";
import AssetFormModal from "./AssetFormModal";

const placementField: FieldDef = {
  key: "upb_id", label: "UPB sekolah penempatan", type: "lookup", placeholder: "Cari kode atau nama sekolah...",
  lookup: { path: "/api/v1/admin/inventaris-aset/pilihan-upb", labelKey: "nama", toChoice: (item) => ({ value: String(item.id), label: String(item.value) }) },
};
export default function AssetDetailModal({ id, onClose }: { id: string; onClose: () => void }) {
  const base = useUrlStore((state) => state.URL.APP);
  const detail = useInventoryDetail(id);
  const update = useUpdateCondition(id);
  const { conditions } = useInventoryOptions();
  const [editing, setEditing] = useState(false);
  const [editingVersion, setEditingVersion] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [validation, setValidation] = useState("");
  const [saved, setSaved] = useState(false);
  const [correcting, setCorrecting] = useState(false);
  const place = usePlaceInventory(id);
  const [placing, setPlacing] = useState(false);
  const [target, setTarget] = useState("");
  const [targetLabel, setTargetLabel] = useState("");
  useEffect(() => {
    if (!photo) { setPreview(""); return; }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  const asset = detail.data;
  return <Modal isOpen onClose={() => { if (!update.isPending) onClose(); }} title={asset?.nama || "Detail Aset"} description="Identitas barang, kondisi terkini, dan riwayat pemeriksaan." maxWidth="xl"
    footer={<><Button variant="outline" disabled={update.isPending} onClick={onClose}>Tutup</Button>{asset && !editing && <><Button variant="outline" disabled={detail.isFetching} onClick={() => { setSaved(false); setCorrecting(true); }}>Koreksi data</Button><Button onClick={() => { setEditingVersion(asset.version); setEditing(true); setSaved(false); }}>Perbarui kondisi</Button></>}</>}>
    {detail.isPending ? <p className="text-sm text-[#7d7152]">Memuat detail aset...</p> : detail.isError ? <p role="alert" className="text-sm text-rose-700">{errorText(detail.error)} <button className="underline" onClick={() => detail.refetch()}>Coba lagi</button></p> : asset && <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div><p className="text-[11px] font-medium text-amber-800">UPB {asset.upb_kode}</p><p className="text-sm font-bold text-[#2d2410]">{asset.upb_nama}</p></div>
        <span className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900">{asset.kondisi_nama}</span>
      </div>
      <div className="rounded-2xl border border-[#efe3c2] bg-white/70 p-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-[#7d7152]">Sekolah penempatan</p>
            <p className="mt-1 font-semibold text-[#2d2410]">{asset.penempatan_nama ? `${asset.penempatan_kode} · ${asset.penempatan_nama}` : "Belum ditetapkan"}</p>
            {asset.status_penempatan === "otomatis" && <p className="mt-1 text-amber-800">Hasil pencocokan otomatis dari keterangan SIMDA; periksa lalu tetapkan bila sudah benar.</p>}
            {!asset.penempatan_nama && <p className="mt-1 text-[#7d7152]">Barang mengikuti UPB pembukuannya. Isi bila barang berada di sekolah lain.</p>}
          </div>
          {!placing && <div className="flex flex-wrap gap-2">
            {asset.status_penempatan === "otomatis" && <Button size="sm" variant="outline" disabled={place.isPending} onClick={() => place.mutate(asset.upb_penempatan_id)}>Benar, tetapkan</Button>}
            <Button size="sm" variant="outline" disabled={place.isPending} onClick={() => { place.reset(); setTarget(""); setTargetLabel(""); setPlacing(true); }}>{asset.penempatan_nama ? "Ubah" : "Atur penempatan"}</Button>
          </div>}
        </div>
        {placing && <div className="mt-3 space-y-3">
          <LookupField field={placementField} value={target} valueLabel={targetLabel} onChange={(value, label) => { setTarget(value); setTargetLabel(label); }} />
          <div className="flex flex-wrap justify-end gap-2">
            <Button size="sm" variant="outline" disabled={place.isPending} onClick={() => setPlacing(false)}>Batal</Button>
            {asset.upb_penempatan_id && <Button size="sm" variant="outline" disabled={place.isPending} onClick={() => place.mutate(null, { onSuccess: () => setPlacing(false) })}>Kosongkan</Button>}
            <Button size="sm" disabled={!target || place.isPending} onClick={() => place.mutate(target, { onSuccess: () => setPlacing(false) })}>{place.isPending ? "Menyimpan..." : "Simpan penempatan"}</Button>
          </div>
        </div>}
        {place.isError && <p role="alert" className="mt-2 text-rose-700">{errorText(place.error)}</p>}
      </div>
      <dl className="grid gap-4 sm:grid-cols-2 text-xs">
        {[
          ["Kode barang", asset.kode_barang], ["Uraian master", asset.uraian_barang], ["Nomor register", asset.nomor_register],
          ["Kelompok KIB", KIB[asset.kib]], ["Tahun perolehan", String(asset.tahun_perolehan)], ["Tanggal perolehan", asset.tanggal_perolehan],
          ["Nilai perolehan", rupiah(asset.nilai_perolehan)], ["Lokasi", asset.lokasi], ["Merk / tipe", asset.merk], ["Nomor seri", asset.nomor_seri],
          ["Sumber dana", asset.sumber_dana_nama], ["Keterangan", asset.keterangan],
          ["Asal data", asset.simda_id ? `Impor SIMDA · ID ${asset.simda_id}` : "Dicatat di aplikasi"],
        ].map(([label, value]) => <div key={label}><dt className="text-[#7d7152]">{label}</dt><dd className="mt-1 break-words font-semibold text-[#2d2410]">{value || "—"}</dd></div>)}
      </dl>
      {saved && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">Kondisi dan bukti foto berhasil disimpan ke riwayat.</p>}
      {editing && <form className="space-y-3 rounded-2xl border border-amber-200 bg-white/70 p-4" onSubmit={(event) => {
        event.preventDefault();
        if (!photo) { setValidation("Pilih foto bukti pemeriksaan."); return; }
        if (photo.size > 10 * 1024 * 1024) { setValidation("Ukuran foto maksimal 10 MB."); return; }
        const data = new FormData(event.currentTarget);
        data.set("version", String(editingVersion));
        data.set("foto", photo);
        setValidation("");
        update.mutate(data, { onSuccess: () => { setEditing(false); setPhoto(null); setSaved(true); } });
      }}>
        <h3 className="text-sm font-bold text-[#2d2410]">Pemeriksaan kondisi</h3>
        <Select name="kondisi_kode" label="Kondisi hasil pemeriksaan" required defaultValue={String(asset.kondisi_kode)} disabled={update.isPending || conditions.isPending || conditions.isError}>
          {conditions.data?.map((option) => <option key={option.id} value={option.id}>{option.value}</option>)}
        </Select>
        {conditions.isError && <p role="alert" className="text-xs text-rose-700">Master kondisi gagal dimuat. <button type="button" className="underline" onClick={() => conditions.refetch()}>Coba lagi</button></p>}
        <Input name="catatan" label="Catatan pemeriksaan" required maxLength={4000} disabled={update.isPending} placeholder="Jelaskan keadaan fisik dan hasil pemeriksaan..." />
        <Input label="Foto bukti (JPG, PNG, WebP · maksimal 10 MB)" type="file" accept="image/jpeg,image/png,image/webp" required disabled={update.isPending} onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} />
        {preview && <img src={preview} alt="Pratinjau foto pemeriksaan" className="max-h-48 rounded-xl border border-amber-100 object-contain" />}
        {(validation || update.isError) && <p role="alert" className="text-xs text-rose-700">{validation || errorText(update.error)}</p>}
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" disabled={update.isPending} onClick={() => { setEditing(false); setPhoto(null); }}>Batal</Button>
          <Button type="submit" disabled={update.isPending || detail.isFetching || conditions.isPending || conditions.isError}>{update.isPending ? "Menyimpan..." : "Simpan pemeriksaan"}</Button>
        </div>
      </form>}
      <section className="border-t border-amber-100 pt-4">
        <h3 className="mb-3 text-sm font-bold text-[#2d2410]">Riwayat kondisi <span className="font-normal text-[#7d7152]">({asset.riwayat.length})</span></h3>
        <ol className="space-y-3">{asset.riwayat.map((entry) => <li key={entry.id} className="rounded-xl border border-[#efe3c2] bg-white/70 p-3">
          <div className="flex flex-wrap justify-between gap-2 text-xs"><strong className="text-[#2d2410]">{!entry.kondisi_lama ? `Kondisi awal: ${entry.kondisi_baru.nama}` : entry.kondisi_lama.kode === entry.kondisi_baru.kode && !entry.foto_url ? (entry.catatan.startsWith("Penempatan") ? "Penempatan" : "Koreksi data") : `${entry.kondisi_lama.nama} → ${entry.kondisi_baru.nama}`}</strong><time className="text-[#7d7152]" dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleString("id-ID")}</time></div>
          <p className="mt-2 whitespace-pre-wrap break-words text-xs text-[#2d2410]">{entry.catatan}</p>
          <p className="mt-1 text-[11px] text-[#7d7152]">Dicatat oleh {entry.created_by}</p>
          {entry.foto_url && <a href={`${base}${entry.foto_url}`} target="_blank" rel="noreferrer"><img src={`${base}${entry.foto_url}`} alt={`Bukti pemeriksaan kondisi ${entry.kondisi_baru.nama}`} loading="lazy" className="mt-3 max-h-40 rounded-lg object-contain" /></a>}
        </li>)}</ol>
      </section>
    </div>}
    {correcting && asset && <AssetFormModal asset={asset} onClose={() => setCorrecting(false)} />}
  </Modal>;
}
