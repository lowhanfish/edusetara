import Link from "next/link";
import { navItems } from "../../_components/home/home-data";

export function EducationHero({
  title,
  description,
  current,
  status = "Tahun Ajaran 2026/2027",
  subStatus = "Penyelenggaraan Pendidikan Aktif",
  tags = ["Kurikulum Merdeka", "Inklusif & Berkarakter", "Terakreditasi"],
}: {
  title: string;
  description: string;
  current: string;
  status?: string;
  subStatus?: string;
  tags?: string[];
}) {
  return (
    <section className="service-hero service-hero-glass education-service-hero">
      <div className="service-hero-grid" aria-hidden="true" />
      <div className="container service-hero-inner">
        <nav className="service-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link><span>/</span>
          <Link href="/pendidikan">Pendidikan</Link><span>/</span>
          <strong>{current}</strong>
        </nav>
        <div className="service-hero-layout">
          <div className="service-hero-copy">
            <p className="service-overline">
              <span /> Pilar Pendidikan Kabupaten Konawe Selatan
            </p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <aside className="service-hero-aside" aria-label="Informasi pendidikan daerah">
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
  "education-levels": "01",
  "education-curriculum": "02",
  "education-teachers": "03",
};

export function EducationNavigation({ active }: { active: string }) {
  const items =
    navItems.find((item) => item.id === "nav-education")?.children ?? [];

  return (
    <div className="service-nav-wrap quick-glass-nav">
      <nav className="container service-page-nav" aria-label="Navigasi Pendidikan">
        <div className="service-nav-label">
          <small>Direktori</small>
          <strong>Pendidikan</strong>
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

export function EducationHelp() {
  return (
    <section className="service-help edu-help-box">
      <div className="service-help-mark" aria-hidden="true">?</div>
      <div>
        <p className="section-kicker">Pusat Informasi &amp; Konsultasi Pendidikan</p>
        <h2>Membutuhkan informasi teknis atau layanan kedinasan?</h2>
        <p>
          Tim Bidang Pembinaan PAUD, Dikdas, dan Ketenagaan Dikbud Konawe Selatan siap membantu pertanyaan seputar kurikulum, mutasi siswa, Dapodik, dan PPG.
        </p>
      </div>
      <Link className="service-help-action" href="/tentang-kami/kontak">
        <span><small>Layanan resmi</small>Hubungi Dikbud Konsel</span><b aria-hidden="true">→</b>
      </Link>
    </section>
  );
}
