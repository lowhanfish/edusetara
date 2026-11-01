import Link from "next/link";
import { navItems } from "../../_components/site-navigation";

export function CultureHero({
  title,
  description,
  current,
  status = "Data Kebudayaan 2026",
  subStatus = "18 Situs & 12 WBTb Terdata",
  tags = ["Kearifan Lokal Tolaki", "Kalosara & Mosehe", "Warisan Budaya"],
}: {
  title: string;
  description: string;
  current: string;
  status?: string;
  subStatus?: string;
  tags?: string[];
}) {
  return (
    <section className="service-hero service-hero-glass culture-service-hero">
      <div className="service-hero-grid" aria-hidden="true" />
      <div className="container service-hero-inner">
        <nav className="service-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link><span>/</span>
          <Link href="/kebudayaan">Kebudayaan</Link><span>/</span>
          <strong>{current}</strong>
        </nav>
        <div className="service-hero-layout">
          <div className="service-hero-copy">
            <p className="service-overline">
              <span /> Pelestarian Nilai Luhur Kebudayaan Konawe Selatan
            </p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <aside className="service-hero-aside" aria-label="Informasi kebudayaan daerah">
            <div className="service-status">
              <span className="service-status-dot" />
              <div>
                <small>{status}</small>
                <strong>{subStatus}</strong>
              </div>
            </div>
            <div className="service-hero-meta">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const sectionNumbers: Record<string, string> = {
  "culture-heritage": "01",
  "culture-communities": "02",
  "culture-agenda": "03",
};

export function CultureNavigation({ active }: { active: string }) {
  const items =
    navItems.find((item) => item.id === "nav-culture")?.children ?? [];

  return (
    <div className="service-nav-wrap quick-glass-nav">
      <nav className="container service-page-nav" aria-label="Navigasi Kebudayaan">
        <div className="service-nav-label">
          <small>Direktori</small>
          <strong>Kebudayaan</strong>
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

export function CultureHelp() {
  return (
    <section className="service-help culture-help-box">
      <div className="service-help-mark" aria-hidden="true">✦</div>
      <div>
        <p className="section-kicker">Pusat Pelestarian &amp; Fasilitasi Kebudayaan</p>
        <h2>Ingin mendaftarkan cagar budaya, sanggar seni, atau berpartisipasi festival?</h2>
        <p>
          Tim Bidang Kebudayaan Dikbud Konawe Selatan siap mendampingi pendaftaran Nomor Induk Kesenian (NIK), fasilitasi sarana sanggar, pencatatan WBTb, dan kurasi pementasan seni daerah.
        </p>
      </div>
      <Link className="service-help-action" href="/tentang-kami/kontak">
        <span><small>Layanan resmi</small>Hubungi Bidang Kebudayaan</span><b aria-hidden="true">→</b>
      </Link>
    </section>
  );
}
