"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { adminMenu } from "../_data/admin-menu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(true);

  // Cari judul halaman aktif berdasarkan pathname
  const getPageTitle = (): string => {
    for (const item of adminMenu) {
      if (item.path && item.path === pathname) return item.title;
      if (item.children) {
        const matched = item.children.find((c) => c.path === pathname);
        if (matched) return matched.title;
      }
    }
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] text-[#052552] flex flex-col antialiased">
      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#052552] text-white flex flex-col shadow-2xl transition-transform duration-200 ease-in-out border-r border-[#0a356e] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 bg-[#031b3c] border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 relative flex-shrink-0">
              <Image
                src="/img/logo_loght.png"
                width={36}
                height={36}
                alt="Logo Dikbud"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                Dikbud Admin
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#ffc400] text-[#052552]">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Kab. Konawe Selatan
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>

          {adminMenu.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);

            // Group menu dengan sub-menu (Publish)
            if (hasChildren && item.children) {
              const isChildActive = item.children.some((c) => c.path === pathname);

              return (
                <div key={item.title} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setPublishOpen((v) => !v)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none ${
                      isChildActive
                        ? "text-white bg-white/10"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    <span
                      className={`text-[10px] text-slate-400 transition-transform duration-200 ${
                        publishOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▲
                    </span>
                  </button>

                  {/* Sub-menu accordion items */}
                  {publishOpen && (
                    <div className="ml-4 pl-3 border-l-2 border-white/15 space-y-1 pt-1 pb-1">
                      {item.children.map((child) => {
                        const isActive = pathname === child.path;
                        return (
                          <Link
                            key={child.title}
                            href={child.path ?? "#"}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                              isActive
                                ? "bg-[#ffc400] text-[#052552] shadow-sm font-bold"
                                : "text-slate-300 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            <span className="text-sm">{child.icon}</span>
                            <span className="truncate">{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Standalone menu item (Dashboard)
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.title}
                href={item.path ?? "#"}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? "bg-[#ffc400] text-[#052552] shadow-sm font-bold"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 bg-[#031b3c] border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>🌐</span>
            <span>Lihat Website Publik</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-600 transition-colors"
          >
            <span>🚪</span>
            <span>Keluar Akun</span>
          </Link>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-xs">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka Menu"
            >
              ☰
            </button>

            <div className="flex flex-col">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <Link href="/admin" className="hover:text-slate-600">Admin</Link>
                <span>›</span>
                <span className="text-slate-600 font-bold">{getPageTitle()}</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-[#052552] tracking-tight">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right: Notifications & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              className="relative w-9 h-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-sm transition-colors cursor-pointer"
              aria-label="Notifikasi"
            >
              🔔
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-[#ffc400] text-[#052552] font-black text-sm flex items-center justify-center shadow-xs">
                A
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-xs font-bold text-[#052552]">
                  Administrator
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Dikbud Konsel
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Shell */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
