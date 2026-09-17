"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarMenu = [
  { id: "dashboard", label: "Dashboard", icon: "📊", href: "/admin" },
  { id: "berita", label: "Berita", icon: "📰", href: "/admin/berita" },
  { id: "pengumuman", label: "Pengumuman", icon: "📢", href: "/admin/pengumuman" },
  { id: "sekolah", label: "Data Sekolah", icon: "🏫", href: "/admin/sekolah" },
  { id: "guru", label: "Tenaga Pendidik", icon: "👨‍🏫", href: "/admin/guru" },
  { id: "kebudayaan", label: "Kebudayaan", icon: "🎭", href: "/admin/kebudayaan" },
  { id: "statistik", label: "Statistik", icon: "📈", href: "/admin/statistik" },
  { id: "layanan", label: "Layanan Publik", icon: "🏛", href: "/admin/layanan" },
  { id: "pengguna", label: "Pengguna", icon: "👥", href: "/admin/pengguna" },
  { id: "pengaturan", label: "Pengaturan", icon: "⚙", href: "/admin/pengaturan" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeItem = sidebarMenu.find((m) => pathname === m.href) ?? sidebarMenu[0];

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="admin-sidebar-brand">
          <Image
            src="/img/logo_loght.png"
            width={40}
            height={40}
            alt="Logo"
          />
          <span>
            <strong>Dikbud</strong>
            <small>Konawe Selatan</small>
          </span>
        </div>

        <nav className="admin-sidebar-nav">
          <span className="admin-nav-label">Menu Utama</span>
          {sidebarMenu.slice(0, 8).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`admin-nav-item${pathname === item.href ? " active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <span className="admin-nav-label">Sistem</span>
          {sidebarMenu.slice(8).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`admin-nav-item${pathname === item.href ? " active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-item">
            <span className="admin-nav-icon">🌐</span>
            Lihat Website
          </Link>
          <Link href="/login" className="admin-nav-item admin-logout">
            <span className="admin-nav-icon">🚪</span>
            Keluar
          </Link>
        </div>
      </aside>

      {/* Backdrop mobile */}
      <button
        className={`admin-sidebar-backdrop${sidebarOpen ? " visible" : ""}`}
        type="button"
        aria-label="Tutup sidebar"
        tabIndex={sidebarOpen ? 0 : -1}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <button
            className="admin-menu-toggle"
            type="button"
            aria-label="Buka menu"
            onClick={() => setSidebarOpen(true)}
          >
            <span /><span /><span />
          </button>
          <h1 className="admin-topbar-title">{activeItem?.label ?? "Admin"}</h1>
          <div className="admin-topbar-actions">
            <button className="admin-topbar-btn" type="button" aria-label="Notifikasi">
              🔔
              <i className="admin-notif-dot" />
            </button>
            <div className="admin-topbar-user">
              <div className="admin-avatar">A</div>
              <span>
                <strong>Admin</strong>
                <small>Administrator</small>
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
