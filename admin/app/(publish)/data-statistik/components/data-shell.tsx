import Link from "next/link";
import { navItems } from "../../_components/site-navigation";

export function DataHero({
  title,
  description,
  current,
}: {
  title: string;
  description: string;
  current: string;
}) {
  return (
    <section className="service-hero service-hero-glass data-service-hero">
      <div className="service-hero-grid" aria-hidden="true" />
      <div className="container service-hero-inner">
        <nav className="service-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link><span>/</span>
          <Link href="/data-statistik">Data &amp; Statistik</Link><span>/</span>
          <strong>{current}</strong>
        </nav>
        <div className="service-hero-layout">
          <div className="service-hero-copy">
            <p className="service-overline">
              <span /> Satu Data Pendidikan &amp; Kebudayaan
            </p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <aside className="service-hero-aside" aria-label="Informasi Satu Data Dikbud">
            <div className="service-status">
              <span className="service-status-dot" />
              <div>
                <small>Portal Satu Data</small>
                <strong>Sinkronisasi Dapodik &amp; Dinas</strong>
              </div>
            </div>
            <div className="service-hero-meta">
              <span>Data terbuka</span>
              <span>Terverifikasi</span>
              <span>Pembaruan berkala</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const sectionNumbers: Record<string, string> = {
  "data-education-statistics": "01",
  "data-satisfaction-index": "02",
  "data-announcements": "03",
};

export function DataNavigation({ active }: { active: string }) {
  const items =
    navItems.find((item) => item.id === "nav-data")?.children ?? [];

  return (
    <div className="service-nav-wrap quick-glass-nav">
      <nav className="container service-page-nav" aria-label="Navigasi Data dan Statistik">
        <div className="service-nav-label">
          <small>Direktori</small>
          <strong>Data &amp; Statistik</strong>
        </div>
        {items.map((item, index) => (
          <Link
            key={item.id}
            href={item.href}
            className={active === item.id ? "active" : ""}
            aria-current={active === item.id ? "page" : undefined}
          >
            <span className="service-nav-number" aria-hidden="true">
              {sectionNumbers[item.id] ?? String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
            <b aria-hidden="true">↗</b>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function DataHelp() {
  return (
    <section className="service-help data-help-box">
      <div className="service-help-mark" aria-hidden="true">?</div>
      <div>
        <p className="section-kicker">Layanan Satu Data Pendidikan</p>
        <h2>Butuh permohonan data atau informasi statistik khusus?</h2>
        <p>
          Ajukan permohonan data agregat resmi untuk kebutuhan riset, kebijakan, atau kemitraan melalui layanan PPID dan persuratan dinas.
        </p>
      </div>
      <Link className="service-help-action" href="/tentang-kami/kontak">
        <span><small>Layanan resmi</small>Hubungi Tim Data</span><b aria-hidden="true">→</b>
      </Link>
    </section>
  );
}
