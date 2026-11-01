"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { navItems } from "./site-navigation";

export function SiteHeader({
  activeSection = "home",
}: {
  activeSection?:
    | "home"
    | "about"
    | "public-services"
    | "data"
    | "education"
    | "culture"
    | "news"
    | "announcements";
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeFromOutside(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    function closeFromKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);

    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  function closeMenu() {
    setOpenMenu(null);
    setMobileMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="topbar container">
        <Link
          className="brand"
          href="/"
          aria-label="Beranda Dinas Pendidikan dan Kebudayaan"
        >
          <Image
            src="/img/logo_loght.png"
            width={70}
            height={70}
            alt="Logo Kabupaten Konawe Selatan"
            priority
          />
          <div>
            <strong>
              Dinas Pendidikan dan Kebudayaan
              <small>Kabupaten Konawe Selatan</small>
            </strong>
            <p>Portal Resmi Layanan &amp; Informasi Pendidikan Terpadu</p>
          </div>
        </Link>
        <div className="utility">
          <span>📅 Berakhlak &amp; Berbudaya</span>
          <Link href="/admin" className="admin-link">
            Masuk Admin ›
          </Link>
        </div>
      </div>

      <nav className="navbar" ref={navRef} aria-label="Navigasi Utama">
        <div className="container nav-content">
          <ul className="nav-list">
            {navItems.map((item) => {
              const hasDropdown = Boolean(item.children?.length);
              const isCurrent = activeSection === item.id;
              const isOpen = openMenu === item.id;

              return (
                <li
                  key={item.id}
                  className={`nav-item ${hasDropdown ? "has-dropdown" : ""}`}
                >
                  {hasDropdown ? (
                    <>
                      <button
                        type="button"
                        className={`nav-link ${isCurrent ? "current" : ""} ${
                          isOpen ? "open" : ""
                        }`}
                        aria-expanded={isOpen}
                        aria-controls={`menu-${item.id}`}
                        onClick={() =>
                          setOpenMenu(isOpen ? null : item.id)
                        }
                      >
                        {item.label}
                        <span className="arrow" aria-hidden="true">
                          ▾
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          id={`menu-${item.id}`}
                          className="dropdown-menu"
                          role="menu"
                        >
                          {item.children?.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              className="dropdown-item"
                              role="menuitem"
                              onClick={closeMenu}
                            >
                              <span
                                className="dropdown-icon"
                                aria-hidden="true"
                              >
                                {child.icon}
                              </span>
                              <div>
                                <strong>{child.label}</strong>
                                <small>{child.description}</small>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`nav-link ${isCurrent ? "current" : ""}`}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mobile-toggle">
            <button
              type="button"
              className="toggle-button"
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Menu</span>
              <div
                className={`hamburger-icon ${mobileMenuOpen ? "open" : ""}`}
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
              </div>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-drawer" role="dialog" aria-modal="true">
            <div className="mobile-drawer-header">
              <strong>Menu Navigasi</strong>
              <button
                type="button"
                className="close-button"
                aria-label="Tutup menu navigasi"
                onClick={closeMenu}
              >
                ✕
              </button>
            </div>
            <ul className="mobile-list">
              {navItems.map((item) => (
                <li key={item.id} className="mobile-item">
                  <div className="mobile-item-title">
                    <Link
                      href={item.href}
                      className={activeSection === item.id ? "current" : ""}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </div>
                  {item.children && (
                    <ul className="mobile-sublist">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link href={child.href} onClick={closeMenu}>
                            <span aria-hidden="true">{child.icon}</span>
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="mobile-drawer-footer">
              <Link href="/admin" className="mobile-admin-link" onClick={closeMenu}>
                Masuk ke Portal Admin EduSetara ›
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
