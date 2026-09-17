"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { adminMenu, type MenuItem } from "../_data/admin-menu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Publish: true,
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Determine current page title from menu data
  const getActiveTitle = (): string => {
    for (const item of adminMenu) {
      if (item.path && pathname === item.path) return item.title;
      if (item.children) {
        const activeChild = item.children.find((c) => c.path === pathname);
        if (activeChild) return `${item.title} - ${activeChild.title}`;
      }
    }
    return "Admin";
  };

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
          <span className="admin-nav-label">Menu Navigasi</span>

          {adminMenu.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isGroupOpen = openGroups[item.title] ?? false;
            const isChildActive = item.children?.some((c) => c.path === pathname);

            if (hasChildren && item.children) {
              return (
                <div key={item.title} className="admin-nav-group">
                  <button
                    type="button"
                    className={`admin-nav-item admin-nav-trigger${isChildActive ? " active-parent" : ""}`}
                    onClick={() => toggleGroup(item.title)}
                  >
                    <div className="admin-nav-trigger-left">
                      <span className="admin-nav-icon">{item.icon}</span>
                      <span>{item.title}</span>
                    </div>
                    <span className={`admin-nav-chevron${isGroupOpen ? " open" : ""}`}>
                      ▼
                    </span>
                  </button>

                  {isGroupOpen && (
                    <div className="admin-submenu">
                      {item.children.map((child) => {
                        const isActive = pathname === child.path;
                        return (
                          <Link
                            key={child.title}
                            href={child.path ?? "#"}
                            className={`admin-submenu-item${isActive ? " active" : ""}`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className="admin-submenu-icon">{child.icon}</span>
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.path;
            return (
              <Link
                key={item.title}
                href={item.path ?? "#"}
                className={`admin-nav-item${isActive ? " active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            );
          })}
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
          <h1 className="admin-topbar-title">{getActiveTitle()}</h1>
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
