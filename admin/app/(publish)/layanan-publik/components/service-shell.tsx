import Link from "next/link";
import { navItems } from "../../_components/site-navigation";

const sectionNumbers: Record<string, string> = {
  "service-by-audience": "01",
  "service-quick-access": "02",
  "service-school-finder": "03",
};

export function ServiceHero({
  title,
  description,
  current,
  variant,
}: {
  title: string;
  description: string;
  current: string;
  variant?: "glass";
}) {
  return (
    <section className={`service-hero${variant === "glass" ? " service-hero-glass" : ""}`}>
      <div className="service-hero-grid" aria-hidden="true" />
      <div className="container service-hero-inner">
        <nav className="service-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link><span>/</span>
          <Link href="/layanan-publik">Layanan Publik</Link><span>/</span>
          <strong>{current}</strong>
        </nav>
        <div className="service-hero-layout">
          <div className="service-hero-copy">
            <p className="service-overline"><span /> Pusat Layanan Pendidikan &amp; Kebudayaan</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <aside className="service-hero-aside" aria-label="Informasi layanan">
            <div className="service-status">
              <span className="service-status-dot" />
              <div><small>Status portal</small><strong>Informasi layanan tersedia</strong></div>
            </div>
            <div className="service-hero-meta">
              <span>Untuk masyarakat</span><span>Terbuka &amp; transparan</span><span>Akses mandiri 24 jam</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function ServiceNavigation({ active }: { active: string }) {
  const items =
    navItems.find((item) => item.id === "nav-public-services")?.children ?? [];

  return (
    <div className="service-nav-wrap quick-glass-nav">
    <nav className="container service-page-nav" aria-label="Navigasi Layanan Publik">
      <div className="service-nav-label"><small>Direktori</small><strong>Layanan Publik</strong></div>
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={active === item.id ? "active" : ""}
          aria-current={active === item.id ? "page" : undefined}
        >
          <span className="service-nav-number" aria-hidden="true">{sectionNumbers[item.id] ?? "—"}</span>
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

export function ServiceHelp() {
  return (
    <section className="service-help">
      <div className="service-help-mark" aria-hidden="true">?</div>
      <div>
        <p className="section-kicker">Petugas siap mengarahkan</p>
        <h2>Belum menemukan layanan yang tepat?</h2>
        <p>Jelaskan kebutuhan Anda kepada petugas. Kami akan membantu menentukan kanal, persyaratan, dan langkah berikutnya.</p>
      </div>
      <Link className="service-help-action" href="/tentang-kami/kontak">
        <span><small>Kanal resmi</small>Kontak &amp; alamat</span><b aria-hidden="true">→</b>
      </Link>
    </section>
  );
}
