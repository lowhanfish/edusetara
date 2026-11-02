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
          <span className="brand-copy">
            <strong>
              Dinas Pendidikan
              <br />
              dan Kebudayaan
            </strong>
            <small>Kabupaten Konawe Selatan</small>
          </span>
        </Link>
        <span className="motto">
          Cerdas Berkarakter
          <br />
          Lestari Budayanya
          <br />
          Maju Konselnya
        </span>
        <div className="top-actions">
          <a href="#footer">⊙ PPID</a>
          <a href="#footer">♿ Aksesibilitas</a>
          <a href="#footer">▣ Peta Situs</a>
          <label className="search">
            <input
              type="search"
              placeholder="Cari informasi..."
              aria-label="Cari informasi"
            />
            <span>⌕</span>
          </label>
          <Link href="/login" className="login">
            Masuk
          </Link>
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-label="Buka menu navigasi"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav
        className={`main-nav${mobileMenuOpen ? " mobile-open" : ""}`}
        aria-label="Navigasi utama"
        id="mobile-navigation"
        ref={navRef}
      >
        <div className="mobile-nav-header">
          <div>
            <span>Menu Utama</span>
            <strong>Dikbud Konawe Selatan</strong>
          </div>
          <button
            type="button"
            aria-label="Tutup menu navigasi"
            onClick={closeMenu}
          >
            ×
          </button>
        </div>
        <div className="nav-inner container">
          {navItems.map((item, index) => {
            const hasChildren = Boolean(item.children?.length);
            const isOpen = openMenu === item.id;
            const dropdownId = `menu-${item.id}`;
            const isSectionActive =
              item.id === activeSection ||
              item.id === `nav-${activeSection}` ||
              (index === 0 && activeSection === "home");

            return (
              <div
                className={`nav-item${isOpen ? " open" : ""}${
                  isSectionActive ? " section-active" : ""
                }`}
                key={item.id}
              >
                {hasChildren ? (
                  <button
                    className="nav-trigger"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={dropdownId}
                    onClick={() =>
                      setOpenMenu((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                  >
                    {item.label}
                    <span className="nav-chevron" aria-hidden="true">
                      ⌄
                    </span>
                  </button>
                ) : (
                  <Link
                    className={isSectionActive ? "active" : ""}
                    href={item.href}
                    onClick={closeMenu}
                  >
                    {index === 0 && <span aria-hidden="true">⌂</span>}
                    {item.label}
                  </Link>
                )}

                {hasChildren && (
                  <div
                    className="nav-dropdown"
                    id={dropdownId}
                    aria-hidden={!isOpen}
                  >
                    <div className="dropdown-heading">
                      <span>Jelajahi</span>
                      <strong>{item.label}</strong>
                    </div>
                    <div className="dropdown-links">
                      {item.children?.map((child) => (
                        <Link
                          href={child.href}
                          key={child.id}
                          onClick={closeMenu}
                          tabIndex={isOpen ? 0 : -1}
                        >
                          <span className="dropdown-icon" aria-hidden="true">
                            {child.icon}
                          </span>
                          <span>
                            <strong>{child.label}</strong>
                            <small>{child.description}</small>
                          </span>
                          <span className="dropdown-arrow" aria-hidden="true">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
      <button
        className={`mobile-nav-backdrop${mobileMenuOpen ? " visible" : ""}`}
        type="button"
        aria-label="Tutup menu navigasi"
        tabIndex={mobileMenuOpen ? 0 : -1}
        onClick={closeMenu}
      />
    </header>
  );
}
