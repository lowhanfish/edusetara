"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { navItems } from "./home-data";

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
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
      }
    }

    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);

    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, []);

  function closeMenu() {
    setOpenMenu(null);
  }

  return (
    <header className="site-header">
      <div className="topbar container">
        <a
          className="brand"
          href="#beranda"
          aria-label="Beranda Dinas Pendidikan dan Kebudayaan"
        >
          <Image
            src="/img/logo_loght.png"
            width={70}
            height={70}
            alt="Logo Konawe Selatan"
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
        </a>
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
          <button className="login">Masuk</button>
        </div>
      </div>
      <nav className="main-nav" aria-label="Navigasi utama" ref={navRef}>
        <div className="nav-inner container">
          {navItems.map((item, index) => {
            const hasChildren = Boolean(item.children?.length);
            const isOpen = openMenu === item.label;
            const dropdownId = `menu-${item.label
              .toLowerCase()
              .replaceAll(" ", "-")
              .replaceAll("&", "dan")}`;

            return (
              <div
                className={`nav-item${isOpen ? " open" : ""}`}
                key={item.label}
                onMouseEnter={() => hasChildren && setOpenMenu(item.label)}
                onMouseLeave={() => hasChildren && setOpenMenu(null)}
              >
                {hasChildren ? (
                  <button
                    className="nav-trigger"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={dropdownId}
                    onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  >
                    {item.label}
                    <span className="nav-chevron" aria-hidden="true">
                      ⌄
                    </span>
                  </button>
                ) : (
                  <a
                    className={index === 0 ? "active" : ""}
                    href={item.href}
                    onClick={closeMenu}
                  >
                    {index === 0 && <span aria-hidden="true">⌂</span>}
                    {item.label}
                  </a>
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
                        <a
                          href={child.href}
                          key={child.label}
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
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
