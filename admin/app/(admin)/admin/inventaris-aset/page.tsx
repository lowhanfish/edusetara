"use client";

import { SkeletonTableRows } from "@/app/(admin)/_components/ui/skeleton";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, Input, PageHeader, Pagination, Select } from "@/app/(admin)/_components/ui";
import LookupField from "../master/master_aset/_shared/LookupField";
import type { FieldDef } from "../master/master_aset/_shared/types";
import { useInventory, useInventoryOptions, useInventorySchool, useInventorySubUnits } from "./hooks";
import { KIB, errorText, rupiah } from "./types";
import AssetFormModal from "./components/AssetFormModal";
import AssetDetailModal from "./components/AssetDetailModal";

const schoolField: FieldDef = {
  key: "sekolah_id", label: "Sekolah", type: "lookup", placeholder: "Cari nama sekolah atau NPSN...",
  lookup: { path: "/api/v1/admin/master/sekolah/option", labelKey: "nama_sekolah", toChoice: (item) => ({ value: String(item.id), label: `${item.nama} · ${item.npsn}`, description: String(item.kecamatan || "") }) },
};
export default function InventoryPage() {
  const [schoolId, setSchoolId] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [kib, setKib] = useState("");
  const [condition, setCondition] = useState("");
  const [subUnitId, setSubUnitId] = useState("");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState("");
  useEffect(() => { const timer = setTimeout(() => { setSearch(text.trim()); setPage(1); }, 350); return () => clearTimeout(timer); }, [text]);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("sekolah_id");
    if (id) setSchoolId(id);
  }, []);
  const list = useInventory({ page, schoolId, subUnitId, search, kib, condition });
  const school = useInventorySchool(schoolId);
  const { conditions } = useInventoryOptions();
  const subUnits = useInventorySubUnits();
  useEffect(() => {
    if (school.data) setSchoolName(`${school.data.nama_sekolah} · ${school.data.npsn}`);
  }, [school.data]);
  const upb = school.data?.simda_upb;
  const verified = upb?.status_pencocokan === "manual";
  const hasItemFilters = Boolean(search || kib || condition || subUnitId);
  const emptyTitle = hasItemFilters
    ? "Tidak ada aset sesuai filter"
    : schoolId ? "Belum ada aset tercatat untuk sekolah ini" : "Belum ada aset tercatat";
  const emptyDescription = hasItemFilters
    ? "Coba ubah atau reset filter untuk melihat barang yang sudah tercatat."
    : "Data barang belum dicatat atau diimpor. Hubungan sekolah–UPB belum otomatis mengisi inventaris barang.";

  return <div className="space-y-6">
    <PageHeader title="Inventaris Aset Sekolah" description="Catat barang per register, pantau nilai perolehan, dan dokumentasikan kondisi fisiknya."
      action={<Button onClick={() => setCreating(true)} disabled={!verified || school.isFetching}>+ Catat aset</Button>} />
    <Card className="p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-bold text-[#2d2410]">Lingkup inventaris</h2><p className="mt-1 text-xs text-[#7d7152]">Pilih sekolah untuk melihat UPB dan mencatat barangnya.</p></div><Button variant="outline" size="sm" disabled={list.isFetching} onClick={() => list.refetch()}>{list.isFetching ? "Memuat..." : "Segarkan"}</Button></div>
      <div className="grid gap-4 lg:grid-cols-2">
        <LookupField field={schoolField} value={schoolId} valueLabel={schoolName} onChange={(id, label) => { setSchoolId(id); setSchoolName(label); setPage(1); }} />
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
          {!schoolId ? <p>Menampilkan inventaris UPB sesuai filter di bawah. Pilih sekolah sebelum mencatat aset baru.</p> : school.isPending ? <p>Memuat identitas UPB...</p> : school.isError ? <p role="alert">{errorText(school.error)} <button className="underline" onClick={() => school.refetch()}>Coba lagi</button></p> : upb ? <><p className="font-bold">UPB {upb.kode} · {upb.nama}</p><p className="mt-1">{verified ? "Padanan sekolah sudah diverifikasi." : "Padanan otomatis perlu diverifikasi sebelum mencatat aset."}</p>{upb.sekolah_kedua_id && <p className="mt-1">UPB bersama satu atap: barang yang sama tampil bagi kedua sekolah.</p>}{!verified && <Link href="/admin/master/master_aset/unit-sekolah" className="mt-2 inline-block underline">Periksa padanan di Master Sekolah ↗</Link>}</> : <p>Belum terhubung ke UPB. Hubungkan sekolah melalui Master Sekolah terlebih dahulu.</p>}
        </div>
      </div>
    </Card>
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="p-5"><p className="text-xs font-medium text-[#7d7152]">Barang sesuai filter</p><p className="mt-2 text-2xl font-bold text-[#2d2410]">{list.isError ? "—" : list.isPending ? "…" : list.data?.total ?? 0}<span className="ml-2 text-xs font-normal text-[#7d7152]">register</span></p></Card>
      <Card className="p-5"><p className="text-xs font-medium text-[#7d7152]">Total nilai perolehan sesuai filter</p><p className="mt-2 text-xl font-bold text-amber-900">{list.isError ? "—" : list.isPending ? "…" : rupiah(list.data?.nilai_total ?? "0")}</p><p className="mt-1 text-[11px] text-[#7d7152]">Nilai perolehan, sebelum penyusutan.</p></Card>
    </div>
    <Card>
      <div className="grid items-end gap-3 border-b border-amber-100 p-4 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-4"><Input label="Cari barang" type="search" value={text} onChange={(event) => setText(event.target.value)} placeholder="Nama, kode barang, atau nomor register..." /></div>
        <div className="min-w-0 lg:col-span-3">
          <Select label="Sub Unit / UPT" value={subUnitId} disabled={subUnits.isPending || subUnits.isError}
            onChange={(event) => { setSubUnitId(event.target.value); setPage(1); }}>
            <option value="">{subUnits.isPending ? "Memuat sub unit..." : "Semua sub unit"}</option>
            {subUnits.data?.map((item) => <option key={item.id} value={item.id}>{item.value}</option>)}
          </Select>
        </div>
        <div className="min-w-0 lg:col-span-2"><Select label="Kelompok KIB" value={kib} onChange={(event) => { setKib(event.target.value); setPage(1); }}><option value="">Semua kelompok</option>{Object.entries(KIB).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</Select></div>
        <div className="min-w-0 lg:col-span-2"><Select label="Kondisi barang" value={condition} disabled={conditions.isError || conditions.isPending} onChange={(event) => { setCondition(event.target.value); setPage(1); }}><option value="">Semua kondisi</option>{conditions.data?.map((item) => <option key={item.id} value={item.id}>{item.value}</option>)}</Select></div>
        <Button variant="ghost" disabled={!text && !kib && !condition && !subUnitId} onClick={() => { setText(""); setSearch(""); setKib(""); setCondition(""); setSubUnitId(""); setPage(1); }}>Reset</Button>
        {subUnits.isError && <p role="alert" className="text-xs text-rose-700 sm:col-span-2 lg:col-span-12">Filter sub unit gagal dimuat. <button className="underline" onClick={() => subUnits.refetch()}>Coba lagi</button></p>}
        {conditions.isError && <p role="alert" className="text-xs text-rose-700 sm:col-span-2 lg:col-span-12">Filter kondisi gagal dimuat. <button className="underline" onClick={() => conditions.refetch()}>Coba lagi</button></p>}
      </div>
      <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-white/40 text-[#7d7152]"><tr>{["Barang / register", "UPB", "Perolehan", "Lokasi", "Kondisi", "Aksi"].map((label) => <th key={label} className="px-4 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-amber-100/70">
        {list.isPending ? <SkeletonTableRows cols={6} /> : list.isError ? <tr><td colSpan={6} className="p-10 text-center text-rose-700" role="alert">{errorText(list.error)} <button className="underline" onClick={() => list.refetch()}>Coba lagi</button></td></tr> : !list.data?.data.length ? <tr><td colSpan={6} className="p-10 text-center"><p className="font-semibold text-[#2d2410]">{emptyTitle}</p>
          <p className="mx-auto mt-2 max-w-lg leading-relaxed text-[#7d7152]">{emptyDescription}</p>
          {verified ? <Button size="sm" className="mt-4" onClick={() => setCreating(true)}>+ Catat aset pertama</Button>
            : !schoolId ? <p className="mt-3 text-[#7d7152]">Pilih sekolah pada bagian Lingkup inventaris untuk mulai mencatat barang.</p>
            : school.isPending ? <p className="mt-3 text-[#7d7152]">Memeriksa padanan UPB sekolah...</p>
            : school.isError ? <p className="mt-3 text-rose-700">Identitas sekolah gagal dimuat. Coba muat ulang melalui panel di atas.</p>
            : <p className="mt-3 text-[#7d7152]">{upb ? "Sekolah sudah terhubung ke UPB; padanannya perlu diverifikasi sebelum pencatatan barang." : "Sekolah belum terhubung ke UPB. Hubungkan melalui Master Sekolah terlebih dahulu."}</p>}
</td></tr> : list.data.data.map((asset) => <tr key={asset.id} className="hover:bg-white/40">
          <td className="px-4 py-4"><p className="font-bold text-[#2d2410]">{asset.nama}</p><p className="mt-1 font-mono text-[11px] text-amber-800">{asset.kode_barang}</p><p className="mt-1 text-[#7d7152]">Register {asset.nomor_register} · KIB {asset.kib}</p></td>
          <td className="px-4 py-4"><p className="font-medium text-[#2d2410]">{asset.upb_nama}</p><p className="mt-1 font-mono text-[#7d7152]">{asset.upb_kode}</p>{asset.penempatan_nama && <p className="mt-1 text-amber-800">Ditempatkan di {asset.penempatan_nama}{asset.status_penempatan === "otomatis" ? " (otomatis)" : ""}</p>}</td>
          <td className="whitespace-nowrap px-4 py-4"><p className="font-semibold text-[#2d2410]">{rupiah(asset.nilai_perolehan)}</p><p className="mt-1 text-[#7d7152]">Tahun {asset.tahun_perolehan}</p></td>
          <td className="px-4 py-4 text-[#2d2410]">{asset.lokasi}</td><td className="px-4 py-4"><span className="inline-block rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-amber-900">{asset.kondisi_nama}</span></td>
          <td className="px-4 py-4"><Button size="sm" variant="outline" onClick={() => setSelected(asset.id)}>Detail</Button></td>
        </tr>)}
      </tbody></table></div>
      <div className="border-t border-amber-100 p-4"><Pagination page={page} pageSize={10} total={list.data?.total ?? 0} onPageChange={setPage} /></div>
    </Card>
    {creating && schoolId && verified && <AssetFormModal schoolId={schoolId} schoolName={schoolName} onClose={() => setCreating(false)} />}
    {selected && <AssetDetailModal key={selected} id={selected} onClose={() => setSelected("")} />}
  </div>;
}
