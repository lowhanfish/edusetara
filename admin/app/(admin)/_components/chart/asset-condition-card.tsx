"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api_secure";
import { useUrlStore } from "@/store/useUrlStore";
import { ChartCard } from "./highchart-base";
import { ColumnBarChart } from "./chart-presets";

interface AssetSummary {
  total: number;
  nilai_total: string;
  kondisi: { kode: number; nama: string }[];
  data: { kib: string; kondisi_kode: number; jumlah: number; nilai: string }[];
}

const KIB_LABELS: [string, string][] = [
  ["A", "Tanah"],
  ["B", "Peralatan & Mesin"],
  ["C", "Gedung & Bangunan"],
  ["D", "Jalan, Irigasi & Jaringan"],
  ["E", "Aset Tetap Lainnya"],
  ["F", "Konstruksi Dlm Pengerjaan"],
];

const conditionColor = (name: string) => {
  const text = name.toLowerCase();
  if (text.includes("berat")) return "#f43f5e";
  if (text.includes("sedang")) return "#f97316";
  if (text.includes("ringan")) return "#f59e0b";
  if (text.includes("baik")) return "#10b981";
  return "#64748b";
};

const rupiah = (value: string) =>
  `Rp ${new Intl.NumberFormat("id-ID").format(BigInt(value.split(".")[0] || "0"))}`;

function useAssetSummary() {
  const base = useUrlStore((s) => s.URL.APP);
  return useQuery({
    queryKey: ["inventaris-aset", "rekap"],
    queryFn: () => fetchData<AssetSummary>(`${base}/api/v1/admin/inventaris-aset/rekap`),
  });
}

/** Kondisi barang Inventaris Aset BMD per kelompok KIB, dihitung dari data register. */
export function AssetConditionCard() {
  const summary = useAssetSummary();
  const data = summary.data;
  const count = (kib: string, kode: number) =>
    data?.data.find((row) => row.kib === kib && row.kondisi_kode === kode)?.jumlah ?? 0;

  return (
    <ChartCard
      title="Kondisi Aset Sekolah"
      subtitle="Jumlah register Inventaris Aset BMD per kelompok KIB dan kondisi barang"
      icon="building"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[#5e5133] font-medium">
            {data
              ? `${new Intl.NumberFormat("id-ID").format(data.total)} register • nilai perolehan ${rupiah(data.nilai_total)}`
              : summary.isError
                ? "Rekap aset gagal dimuat"
                : "Memuat rekap aset..."}
          </span>
          <Link
            href="/admin/inventaris-aset"
            className="font-bold text-[#a86a00] hover:text-[#f5b82e] transition-colors"
          >
            Kelola Inventaris Aset →
          </Link>
        </div>
      }
    >
      {summary.isPending ? (
        <div className="h-[285px] animate-pulse rounded-xl bg-amber-950/5" aria-label="Memuat grafik aset" />
      ) : summary.isError ? (
        <div className="flex h-[285px] flex-col items-center justify-center gap-2 text-xs text-rose-700" role="alert">
          <p>Rekap aset gagal dimuat.</p>
          <button type="button" className="underline" onClick={() => summary.refetch()}>
            Coba lagi
          </button>
        </div>
      ) : !data?.total ? (
        <div className="flex h-[285px] items-center justify-center text-xs text-[#7d7152]">
          Belum ada aset tercatat di Inventaris Aset BMD.
        </div>
      ) : (
        <ColumnBarChart
          categories={KIB_LABELS.map(([, label]) => label)}
          series={data.kondisi.map((item) => ({
            name: item.nama,
            data: KIB_LABELS.map(([kib]) => count(kib, item.kode)),
            color: conditionColor(item.nama),
          }))}
          stacking="normal"
          height={285}
        />
      )}
    </ChartCard>
  );
}

/** Nilai perolehan Inventaris Aset BMD per kelompok KIB (juta rupiah, sebelum penyusutan). */
export function AssetValueCard() {
  const summary = useAssetSummary();
  const data = summary.data;
  const valueMillions = (kib: string) =>
    Math.round(
      (data?.data.filter((row) => row.kib === kib).reduce((sum, row) => sum + Number(row.nilai), 0) ?? 0) / 10_000,
    ) / 100;

  return (
    <ChartCard
      title="Nilai Aset Sekolah per KIB"
      subtitle="Total nilai perolehan Inventaris Aset BMD per kelompok KIB, dalam juta rupiah"
      icon="building"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[#5e5133] font-medium">
            {data ? `Total nilai perolehan ${rupiah(data.nilai_total)} • sebelum penyusutan` : summary.isError ? "Rekap aset gagal dimuat" : "Memuat rekap aset..."}
          </span>
          <Link href="/admin/inventaris-aset" className="font-bold text-[#a86a00] hover:text-[#f5b82e] transition-colors">
            Kelola Inventaris Aset →
          </Link>
        </div>
      }
    >
      {summary.isPending ? (
        <div className="h-[285px] animate-pulse rounded-xl bg-amber-950/5" aria-label="Memuat grafik nilai aset" />
      ) : summary.isError ? (
        <div className="flex h-[285px] flex-col items-center justify-center gap-2 text-xs text-rose-700" role="alert">
          <p>Rekap aset gagal dimuat.</p>
          <button type="button" className="underline" onClick={() => summary.refetch()}>Coba lagi</button>
        </div>
      ) : !data?.total ? (
        <div className="flex h-[285px] items-center justify-center text-xs text-[#7d7152]">
          Belum ada aset tercatat di Inventaris Aset BMD.
        </div>
      ) : (
        <ColumnBarChart
          horizontal
          categories={KIB_LABELS.map(([kib, label]) => `${kib} · ${label}`)}
          series={[{ name: "Nilai perolehan", data: KIB_LABELS.map(([kib]) => valueMillions(kib)), color: "#3b82f6" }]}
          yAxisSuffix="jt"
          showLegend={false}
          height={285}
        />
      )}
    </ChartCard>
  );
}
