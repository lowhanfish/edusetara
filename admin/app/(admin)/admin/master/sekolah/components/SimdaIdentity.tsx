"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { Button, Input } from "@/app/(admin)/_components/ui";
import type { SekolahRecord, SimdaUpb } from "../types";

const statuses: Record<string, string> = {
  belum: "Belum dicocokkan", otomatis: "Otomatis, perlu ditinjau",
  manual: "Sudah diverifikasi", bukan_sekolah: "Bukan sekolah",
};

interface Props {
  schoolId: string;
  value: SekolahRecord["simda_upb"];
  editable?: boolean;
  disabled?: boolean;
  onChange?: (value: SimdaUpb | null) => void;
}

export default function SimdaIdentity({ schoolId, value, editable, disabled, onChange }: Props) {
  const url = useUrlStore((state) => state.URL.APP);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setSearch(text.trim()), 350);
    return () => clearTimeout(timer);
  }, [text]);
  const active = Boolean(editable && !value && search.length >= 2);
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["master-aset", "unit-sekolah", "school-picker", search],
    queryFn: () => fetchData<{ data: SimdaUpb[] }>(
      `${url}/api/v1/admin/master/master_aset/unit-sekolah/read?tingkat=upb&limit=50&search=${encodeURIComponent(search)}`
    ),
    enabled: active,
  });
  const choices = (data?.data ?? []).filter((unit) =>
    unit.status_pencocokan !== "bukan_sekolah" && (
      !unit.sekolah_id || unit.sekolah_id === schoolId || unit.sekolah_kedua_id === schoolId ||
      (unit.jenis === "SATAP" && !unit.sekolah_kedua_id)
    )
  );
  return (
    <section className="rounded-xl border border-amber-300/50 bg-amber-50/60 p-4 space-y-3" aria-label="Identitas SIMDA/Aset">
      <h3 className="text-sm font-bold text-[#2d2410]">Identitas SIMDA/Aset</h3>
      <p className="text-xs text-[#7d7152]">Hubungkan sekolah dengan referensi UPB SIMDA BMD. Dua sekolah satu atap dapat memakai UPB SATAP yang sama.</p>
      {value ? (
        <>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              ["Kode SIMDA", value.kode], ["Nama UPB", value.nama],
              ["Nama di SIMDA", value.nama_simda], ["Nama Lama", value.nama_lama],
              ["Induk / UPT", value.nama_induk], ["Status Pencocokan", statuses[value.status_pencocokan] ?? value.status_pencocokan],
            ].map(([label, content]) => (
              <div key={label}><dt className="text-[#7d7152]">{label}</dt><dd className="mt-1 font-semibold text-[#2d2410] break-words">{content || "—"}</dd></div>
            ))}
          </dl>
          {value.sekolah_kedua_id && <p className="text-xs text-amber-800">UPB bersama: {value.sekolah_label || value.sekolah_id} dan {value.sekolah_kedua_label || value.sekolah_kedua_id}. Status verifikasi berlaku untuk kedua sekolah.</p>}
          {editable && <Button type="button" size="sm" variant="outline" disabled={disabled} onClick={() => { onChange?.(null); setText(""); }}>Ganti / Lepas UPB</Button>}
        </>
      ) : editable ? (
        <>
          <Input label="Cari UPB SIMDA" placeholder="Ketik minimal 2 karakter kode atau nama UPB..." value={text} disabled={disabled} onChange={(event) => setText(event.target.value)} />
          {active && <div className="max-h-52 overflow-y-auto rounded-lg border border-amber-200 bg-white p-2 text-xs" aria-live="polite">
            {isFetching ? <p>Mencari UPB...</p> : isError ? <div><p className="text-rose-700">Gagal memuat UPB.</p><Button type="button" size="sm" variant="outline" onClick={() => refetch()}>Coba lagi</Button></div> : choices.length === 0 ? <p>Tidak ada UPB yang dapat dipilih. Coba kode atau nama yang lebih spesifik.</p> : choices.map((unit) => (
              <button key={unit.id} type="button" disabled={disabled} onClick={() => { onChange?.(unit); setText(""); }} className="block w-full rounded-lg p-2 text-left hover:bg-amber-50 disabled:opacity-50">
                <span className="block font-semibold">{unit.kode} · {unit.nama}</span>
                <span className="text-[#7d7152]">{unit.nama_induk || unit.jenis}{unit.nama_lama ? ` · Nama lama: ${unit.nama_lama}` : ""}{unit.sekolah_id && unit.sekolah_id !== schoolId ? ` · Bersama ${unit.sekolah_label || unit.sekolah_id}` : ""}</span>
              </button>
            ))}
          </div>}
          <p className="text-xs text-[#7d7152]">Belum terhubung ke UPB. Pilihan atau pelepasan disimpan melalui tombol Simpan Perubahan.</p>
        </>
      ) : <p className="text-xs text-[#7d7152]">Belum terhubung ke UPB SIMDA. Pilih UPB melalui Edit Profil.</p>}
    </section>
  );
}
