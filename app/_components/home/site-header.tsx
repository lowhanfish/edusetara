import Image from "next/image";

import { navItems } from "./home-data";

export function SiteHeader() {
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
      <nav className="main-nav" aria-label="Navigasi utama">
        <div className="nav-inner container">
          {navItems.map((item, index) => (
            <a
              className={index === 0 ? "active" : ""}
              href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
              key={item}
            >
              {index === 0 && <span>⌂</span>}
              {item}
              {index > 0 && index < 6 ? <small>⌄</small> : null}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
