import React from "react";
import Link from "next/link";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from "./ui";

export interface AdminPageScaffoldProps {
  title: string;
  category?: string;
  description?: string;
  icon?: string;
  breadcrumbs?: { label: string; href?: string | null }[];
}

export function AdminPageScaffold({
  title,
  category = "Modul Administrasi",
  description = "Halaman manajemen data dan konfigurasi modul Dinas Pendidikan dan Kebudayaan.",
  icon = "📁",
  breadcrumbs = [],
}: AdminPageScaffoldProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/admin" className="hover:text-[#2d2410] transition-colors">
            Dashboard
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span>/</span>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-[#2d2410] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#2d2410] font-semibold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header */}
      <PageHeader
        title={title}
        description={description}
        badge={<Badge variant="info">{category}</Badge>}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Ekspor Data
            </Button>
            <Button variant="primary" size="sm">
              + Tambah Data
            </Button>
          </div>
        }
      />

      {/* Status Notice */}
      <div className="p-4 rounded-2xl bg-amber-400/15 border border-white/70 text-amber-900 flex items-start gap-3.5 shadow-xs">
        <span className="text-2xl mt-0.5 shrink-0">ℹ️</span>
        <div className="text-xs space-y-1">
          <div className="font-bold text-amber-950 flex items-center gap-2">
            <span>Modul Halaman Disiapkan</span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              Siap Dikonfigurasi
            </span>
          </div>
          <p className="text-amber-800 leading-relaxed">
            Struktur rute dan navigasi untuk menu <strong>{title}</strong> telah aktif. Tampilan formulir, tabel data, serta integrasi API backend dapat diterapkan pada tahap desain berikutnya.
          </p>
        </div>
      </div>

      {/* Placeholder Workspace Card */}
      <Card>
        <CardHeader className="bg-white/30 border-b border-white/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <CardTitle className="text-sm font-bold text-[#2d2410] flex items-center gap-2">
              <span>📋</span>
              <span>Daftar {title}</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Cari ${title.toLowerCase()}...`}
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-xl bg-white/70 focus:outline-hidden focus:ring-2 focus:ring-[#2d2410]/20"
                disabled
              />
              <select
                className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white/70 text-slate-600"
                disabled
              >
                <option>Semua Status</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-16 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center text-3xl mx-auto shadow-inner">
            {icon}
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-sm font-bold text-[#2d2410]">
              Belum Ada Data Tersimpan
            </h3>
            <p className="text-xs text-slate-500">
              Silakan gunakan tombol tambah di atas atau import data awal saat perancangan form modul {title} telah diselesaikan.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
