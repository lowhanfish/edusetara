"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { adminMenu, MenuItem } from "../_data/admin-menu";
import { EMOJI_ICON, Icon } from "../_components/admin-icons";

function isItemActive(item: MenuItem, pathname: string): boolean {
  if (item.path && item.path === pathname) return true;
  if (item.children) {
    return item.children.some((child) => isItemActive(child, pathname));
  }
  return false;
}

function findPageTitle(items: MenuItem[], pathname: string): string | null {
  for (const item of items) {
    if (item.path && item.path === pathname) {
      return item.title;
    }
    if (item.children) {
      const found = findPageTitle(item.children, pathname);
      if (found) return found;
    }
  }
  return null;
}

function MenuItemRenderer({
  item,
  level = 1,
  pathname,
  openMenus,
  toggleMenu,
  onItemClick,
}: {
  item: MenuItem;
  level?: number;
  pathname: string;
  openMenus: Record<string, boolean>;
  toggleMenu: (key: string) => void;
  onItemClick: () => void;
}) {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const isActive = isItemActive(item, pathname);
  const isExactActive = item.path === pathname;
  const menuKey = `${level}-${item.title}`;
  const isOpen = openMenus[menuKey] ?? isActive;

  const baseClass =
    level === 1
      ? `w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[13px] transition-all duration-150 cursor-pointer select-none text-left ${
          isExactActive
            ? "bg-white text-[#5b3fe0] font-semibold shadow-[0_4px_14px_rgba(88,76,200,.14)]"
            : isActive
            ? "text-[#5b3fe0] font-semibold"
            : "text-[#4a4770] font-medium hover:bg-white/60"
        }`
      : `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer select-none text-left ${
          isExactActive
            ? "bg-white text-[#5b3fe0] font-semibold shadow-[0_2px_10px_rgba(88,76,200,.12)]"
            : "text-[#6b6f8f] font-medium hover:bg-white/60 hover:text-[#5b3fe0]"
        }`;

  const innerContent = (
    <>
      {level === 1 ? (
        <Icon name={EMOJI_ICON[item.icon] ?? "dot"} size={18} />
      ) : (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            isExactActive ? "bg-[#7c5cff]" : "bg-[#b9b6dc]"
          }`}
        />
      )}
      <span className="flex-1 truncate leading-normal text-left">{item.title}</span>
      {hasChildren && (
        <Icon
          name="chevron"
          size={14}
          className={`text-[#9a97c0] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      )}
    </>
  );

  if (hasChildren && item.children) {
    return (
      <div className="space-y-1">
        <button type="button" onClick={() => toggleMenu(menuKey)} className={baseClass}>
          {innerContent}
        </button>

        {isOpen && (
          <div
            className={`space-y-1 pt-0.5 pb-1 ${
              level === 1 ? "ml-5 pl-3 border-l border-[#d9d6f3]" : "ml-3 pl-2.5 border-l border-[#e3e0f6]"
            }`}
          >
            {item.children.map((child) => (
              <MenuItemRenderer
                key={child.title}
                item={child}
                level={level + 1}
                pathname={pathname}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.path ?? "#"} onClick={onItemClick} className={baseClass}>
      {innerContent}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Auto-expand any active menu section when pathname changes
  useEffect(() => {
    setOpenMenus((prev) => {
      const next = { ...prev };
      const markActive = (items: MenuItem[], level = 1) => {
        for (const item of items) {
          const key = `${level}-${item.title}`;
          if (item.children && isItemActive(item, pathname)) {
            next[key] = true;
            markActive(item.children, level + 1);
          }
        }
      };
      markActive(adminMenu);
      return next;
    });
  }, [pathname]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const pageTitle = findPageTitle(adminMenu, pathname) ?? "Dashboard";

  return (
    <div className="admin-shell min-h-screen flex flex-col antialiased">
      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#1f1b4d]/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`glass fixed top-3 bottom-3 left-3 z-50 w-72 rounded-[28px] flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-[72px] flex items-center justify-between px-5 shrink-0">
          <Link href="/admin" className="flex items-center gap-3 rounded-2xl bg-white/60 border border-white/80 px-3 py-2 flex-1 mr-2 shadow-[0_2px_10px_rgba(88,76,200,.08)]">
            <div className="w-8 h-8 relative flex-shrink-0">
              <Image src="/img/logo_loght.png" width={32} height={32} alt="Logo Dikbud" className="object-contain" />
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-semibold text-sm text-[#1f1b4d] truncate">Dikbud Admin</span>
              <span className="text-[10px] text-[#8a87ad] truncate">Kab. Konawe Selatan</span>
            </div>
          </Link>

          <button
            type="button"
            className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center text-[#6b6f8f] hover:bg-white/70"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup menu"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-medium text-[#9a97c0]">Menu utama</div>

          {adminMenu.map((item) => (
            <MenuItemRenderer
              key={item.title}
              item={item}
              level={1}
              pathname={pathname}
              openMenus={openMenus}
              toggleMenu={toggleMenu}
              onItemClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/60 space-y-1 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-medium text-[#4a4770] hover:bg-white/60 transition-colors"
          >
            <Icon name="globe" size={16} />
            <span>Lihat Website Publik</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <Icon name="logout" size={16} />
            <span>Keluar Akun</span>
          </Link>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 lg:pl-[312px] flex flex-col min-w-0">
        {/* Topbar */}
        <header className="glass sticky top-3 z-30 mx-3 lg:mx-4 mt-3 h-16 rounded-[24px] px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center text-[#4a4770] hover:bg-white transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka Menu"
            >
              <Icon name="menu" size={18} />
            </button>

            <div className="flex flex-col min-w-0">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-[#9a97c0]">
                <Link href="/admin" className="hover:text-[#5b3fe0]">Admin</Link>
                <span>/</span>
                <span className="text-[#6b6f8f]">{pageTitle}</span>
              </div>
              <h1 className="text-base sm:text-lg font-semibold text-[#1f1b4d] tracking-tight truncate">
                {pageTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative w-10 h-10 rounded-2xl bg-white/70 text-[#4a4770] hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Notifikasi"
            >
              <Icon name="bell" size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-white/70">
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#8b6dff] to-[#6a49f0] text-white font-semibold text-sm flex items-center justify-center shadow-[0_4px_12px_rgba(124,92,255,.35)]">
                A
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-xs font-semibold text-[#1f1b4d]">Administrator</span>
                <span className="text-[10px] text-[#8a87ad] mt-1">Dikbud Konsel</span>
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
