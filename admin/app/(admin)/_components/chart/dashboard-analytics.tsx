"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChartCard } from "./highchart-base";
import {
  ColumnBarChart,
  DonutPieChart,
  TrendSplineChart,
} from "./chart-presets";
import { Badge } from "../ui";
import { AssetConditionCard, AssetValueCard } from "./asset-condition-card";

const DEMOGRAFI_DATA = {
  siswa: {
    centerValue: "52.847",
    centerLabel: "Total Siswa",
    unitLabel: "Siswa",
    subtitle: "Proporsi peserta didik aktif berdasarkan jenjang pendidikan",
    slices: [
      { name: "Jenjang SD", y: 31420, color: "#f59e0b" },
      { name: "Jenjang SMP", y: 15890, color: "#3b82f6" },
      { name: "PAUD & TK", y: 4312, color: "#10b981" },
      { name: "PKBM / Kesetaraan", y: 1225, color: "#8b5cf6" },
    ],
  },
  rombel: {
    centerValue: "2.148",
    centerLabel: "Total Rombel",
    unitLabel: "Rombel",
    subtitle: "Sebaran rombongan belajar aktif Semester Ganjil 2026/2027",
    slices: [
      { name: "Rombel SD (Kls 1-6)", y: 1320, color: "#f59e0b" },
      { name: "Rombel SMP (Kls 7-9)", y: 542, color: "#3b82f6" },
      { name: "Rombel PAUD & TK", y: 224, color: "#10b981" },
      { name: "Rombel Paket A/B/C", y: 62, color: "#8b5cf6" },
    ],
  },
  sekolah: {
    centerValue: "287",
    centerLabel: "Satuan Sekolah",
    unitLabel: "Sekolah",
    subtitle: "Komposisi satuan pendidikan Negeri & Swasta terverifikasi",
    slices: [
      { name: "Sekolah Dasar (SD)", y: 164, color: "#f59e0b" },
      { name: "SMP Negeri & Satap", y: 58, color: "#3b82f6" },
      { name: "TK & PAUD", y: 49, color: "#10b981" },
      { name: "PKBM", y: 16, color: "#8b5cf6" },
    ],
  },
} as const;

const USULAN_VERIFIKASI_DATA = {
  semua: {
    categories: ["Triwulan I", "Triwulan II", "Triwulan III", "Triwulan IV"],
    series: [
      {
        name: "Usulan Masuk",
        type: "column" as const,
        data: [1240, 1380, 1425, 1190],
        color: "#f59e0b",
      },
      {
        name: "Terverifikasi Dinas",
        type: "column" as const,
        data: [1195, 1340, 1360, 1085],
        color: "#3b82f6",
      },
      {
        name: "SK Terbit / Tersalurkan",
        type: "areaspline" as const,
        data: [1160, 1310, 1315, 980],
        color: "#10b981",
      },
    ],
    badge: "94,2% Terverifikasi",
  },
  tunjangan: {
    categories: ["Triwulan I", "Triwulan II", "Triwulan III", "Triwulan IV"],
    series: [
      {
        name: "Usulan Tunjangan GTK",
        type: "column" as const,
        data: [820, 865, 890, 845],
        color: "#f59e0b",
      },
      {
        name: "Verifikasi SIMPEG/Dapodik",
        type: "column" as const,
        data: [798, 850, 862, 790],
        color: "#3b82f6",
      },
      {
        name: "Tersalurkan",
        type: "areaspline" as const,
        data: [785, 842, 850, 740],
        color: "#10b981",
      },
    ],
    badge: "TPG & Tamsil",
  },
  bosp_pip: {
    categories: ["Triwulan I", "Triwulan II", "Triwulan III", "Triwulan IV"],
    series: [
      {
        name: "Usulan Rekonsiliasi BOSP & PIP",
        type: "column" as const,
        data: [420, 515, 535, 345],
        color: "#f59e0b",
      },
      {
        name: "Lolos Verifikasi Berkas",
        type: "column" as const,
        data: [397, 490, 498, 295],
        color: "#3b82f6",
      },
      {
        name: "Selesai Rekonsiliasi",
        type: "areaspline" as const,
        data: [375, 468, 465, 240],
        color: "#10b981",
      },
    ],
    badge: "Dana BOSP & PIP",
  },
};

export function DashboardAnalyticsSection() {
  const [demografiTab, setDemografiTab] =
    useState<keyof typeof DEMOGRAFI_DATA>("siswa");
  const [usulanTab, setUsulanTab] =
    useState<keyof typeof USULAN_VERIFIKASI_DATA>("semua");
  const [activityMode, setActivityMode] = useState<"jurnal" | "ppdb">("jurnal");

  const activeDemografi = DEMOGRAFI_DATA[demografiTab];
  const activeUsulan = USULAN_VERIFIKASI_DATA[usulanTab];

  return (
    <section className="space-y-6" aria-label="Analitik Visual Portal Admin">
      {/* Row 1: Kondisi aset (7 cols) & Distribusi Rombel/Siswa (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AssetConditionCard />
        </div>

        <div className="lg:col-span-5">
          <ChartCard
            title="Komposisi Pendidikan & Rombel"
            subtitle={activeDemografi.subtitle}
            icon="pie"
            action={
              <div className="inline-flex rounded-xl bg-amber-950/5 p-1 border border-amber-200/60">
                {(
                  [
                    { key: "siswa", label: "Siswa" },
                    { key: "rombel", label: "Rombel" },
                    { key: "sekolah", label: "Sekolah" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setDemografiTab(tab.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      demografiTab === tab.key
                        ? "bg-white text-amber-900 shadow-xs"
                        : "text-[#7d7152] hover:text-[#2d2410]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            }
            footer={
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5e5133] font-medium">
                  Rasio rata-rata: <b>24,6 siswa / rombel</b> (Sesuai SPM)
                </span>
                <Link
                  href="/admin/rombel/sd"
                  className="font-bold text-[#a86a00] hover:text-[#f5b82e] transition-colors"
                >
                  Data Rombel →
                </Link>
              </div>
            }
          >
            <DonutPieChart
              data={activeDemografi.slices.map((s) => ({ ...s }))}
              centerValue={activeDemografi.centerValue}
              centerLabel={activeDemografi.centerLabel}
              unitLabel={activeDemografi.unitLabel}
              height={285}
            />
          </ChartCard>
        </div>
      </div>

      {/* Row 1b: Nilai aset per KIB */}
      <AssetValueCard />

      {/* Row 2: Usulan & Verifikasi (6 cols) & Jurnal V2 / PPDB (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ChartCard
            title="Realisasi Usulan & Verifikasi Sekolah"
            subtitle="Perbandingan berkas usulan masuk terhadap verifikasi dinas per Triwulan"
            icon="check"
            action={
              <div className="inline-flex rounded-xl bg-amber-950/5 p-1 border border-amber-200/60">
                {(
                  [
                    { key: "semua", label: "Semua" },
                    { key: "tunjangan", label: "Tunjangan" },
                    { key: "bosp_pip", label: "BOSP & PIP" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setUsulanTab(tab.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      usulanTab === tab.key
                        ? "bg-white text-amber-900 shadow-xs"
                        : "text-[#7d7152] hover:text-[#2d2410]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            }
            footer={
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="success">{activeUsulan.badge}</Badge>
                  <span className="text-[#5e5133] font-medium">
                    105 berkas menunggu verifikasi tahap akhir
                  </span>
                </div>
                <Link
                  href="/admin/verifikasi/tunjangan-guru"
                  className="font-bold text-[#a86a00] hover:text-[#f5b82e] transition-colors"
                >
                  Buka Verifikasi →
                </Link>
              </div>
            }
          >
            <TrendSplineChart
              categories={activeUsulan.categories}
              series={activeUsulan.series}
              yAxisSuffix=" Berkas"
              height={280}
            />
          </ChartCard>
        </div>

        <div className="lg:col-span-6">
          <ChartCard
            title={
              activityMode === "jurnal"
                ? "Keaktifan Pengisian Jurnal V2 GTK"
                : "Keterisian Daya Tampung Kuota PPDB"
            }
            subtitle={
              activityMode === "jurnal"
                ? "Tren kepatuhan laporan jurnal Guru Kelas, Kepala Sekolah, Pengawas & BK"
                : "Perbandingan kuota daya tampung terhadap pendaftar terverifikasi"
            }
            icon="trending"
            action={
              <div className="inline-flex rounded-xl bg-amber-950/5 p-1 border border-amber-200/60">
                <button
                  type="button"
                  onClick={() => setActivityMode("jurnal")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    activityMode === "jurnal"
                      ? "bg-white text-amber-900 shadow-xs"
                      : "text-[#7d7152] hover:text-[#2d2410]"
                  }`}
                >
                  Jurnal V2
                </button>
                <button
                  type="button"
                  onClick={() => setActivityMode("ppdb")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    activityMode === "ppdb"
                      ? "bg-white text-amber-900 shadow-xs"
                      : "text-[#7d7152] hover:text-[#2d2410]"
                  }`}
                >
                  Kuota PPDB
                </button>
              </div>
            }
            footer={
              <div className="flex items-center justify-between text-xs">
                {activityMode === "jurnal" ? (
                  <>
                    <span className="text-[#5e5133] font-medium">
                      Rata-rata keaktifan pengisian jurnal bulan ini:{" "}
                      <b className="text-emerald-700">89,5%</b>
                    </span>
                    <Link
                      href="/admin/jurnal/guru-kelas"
                      className="font-bold text-[#a86a00] hover:text-[#f5b82e] transition-colors"
                    >
                      Lihat Jurnal V2 →
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="text-[#5e5133] font-medium">
                      Total serapan kuota PPDB Kabupaten:{" "}
                      <b className="text-amber-800">93,8% Terisi</b>
                    </span>
                    <Link
                      href="/admin/kuota-ppdb"
                      className="font-bold text-[#a86a00] hover:text-[#f5b82e] transition-colors"
                    >
                      Atur Kuota PPDB →
                    </Link>
                  </>
                )}
              </div>
            }
          >
            {activityMode === "jurnal" ? (
              <TrendSplineChart
                categories={["Mei", "Jun", "Jul", "Agu", "Sep", "Okt"]}
                series={[
                  {
                    name: "Jurnal Guru Kelas",
                    data: [78, 82, 76, 88, 91, 94],
                    color: "#f59e0b",
                    type: "areaspline",
                  },
                  {
                    name: "Jurnal Kepala Sekolah",
                    data: [81, 84, 80, 89, 92, 95],
                    color: "#10b981",
                    type: "spline",
                  },
                  {
                    name: "Jurnal Pengawas & BK",
                    data: [72, 75, 74, 83, 86, 89],
                    color: "#3b82f6",
                    type: "spline",
                  },
                ]}
                yAxisSuffix="%"
                height={280}
              />
            ) : (
              <ColumnBarChart
                categories={[
                  "PPDB PAUD / TK",
                  "PPDB SD Negeri",
                  "PPDB SMP Negeri",
                ]}
                series={[
                  {
                    name: "Kuota Daya Tampung",
                    data: [2450, 6800, 5200],
                    color: "#cbd5e1",
                  },
                  {
                    name: "Pendaftar Terverifikasi",
                    data: [2180, 6540, 4990],
                    color: "#f59e0b",
                  },
                  {
                    name: "Daftar Ulang Diterima",
                    data: [2095, 6410, 4860],
                    color: "#10b981",
                  },
                ]}
                height={280}
              />
            )}
          </ChartCard>
        </div>
      </div>
    </section>
  );
}
