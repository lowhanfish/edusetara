import Link from "next/link";

const aboutNavigation = [
  {
    id: "profile",
    label: "Profil Dinas",
    description: "Arah, peran, dan nilai kerja",
    href: "/tentang-kami",
    icon: "⌂",
  },
  {
    id: "standards",
    label: "Standar Pelayanan",
    description: "Komitmen layanan publik",
    href: "/tentang-kami/standar-pelayanan",
    icon: "▤",
  },
  {
    id: "contact",
    label: "Kontak & Alamat",
    description: "Kanal komunikasi resmi",
    href: "/tentang-kami/kontak",
    icon: "⌖",
  },
] as const;

type AboutPage = (typeof aboutNavigation)[number]["id"];

const aboutSectionNumbers: Record<AboutPage, string> = {
  profile: "01",
  standards: "02",
  contact: "03",
};

export function AboutHero({
  eyebrow,
  title,
  description,
  current,
  section = { label: "Tentang Kami", href: "/tentang-kami" },
}: {
  eyebrow: string;
  title: string;
  description: string;
  current: string;
  section?: { label: string; href: string };
}) {
  return (
    <section className="about-hero">
      <div className="about-hero-orb about-orb-one" />
      <div className="about-hero-orb about-orb-two" />
      <div className="container about-hero-inner">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link>
          <span aria-hidden="true">›</span>
          <Link href={section.href}>{section.label}</Link>
          <span aria-hidden="true">›</span>
          <strong>{current}</strong>
        </nav>
        <div className="about-hero-copy">
          <p className="about-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="about-hero-mark" aria-hidden="true">
          <span>DIKBUD</span>
          <strong>KONSEL</strong>
          <i>✦</i>
        </div>
      </div>
    </section>
  );
}

export function AboutPageNavigation({ active }: { active: AboutPage }) {
  return (
    <nav className="container about-page-nav" aria-label="Navigasi Tentang Kami">
      {aboutNavigation.map((item) => (
        <Link
          className={item.id === active ? "active" : ""}
          href={item.href}
          key={item.id}
          aria-current={item.id === active ? "page" : undefined}
        >
          <span aria-hidden="true">{item.icon}</span>
          <span>
            <strong>{item.label}</strong>
            <small>{item.description}</small>
          </span>
          <b aria-hidden="true">→</b>
        </Link>
      ))}
    </nav>
  );
}

export function AboutServiceNavigation({ active }: { active: AboutPage }) {
  return (
    <div className="service-nav-wrap quick-glass-nav">
      <nav className="container service-page-nav" aria-label="Navigasi Tentang Kami">
        <div className="service-nav-label">
          <small>Direktori</small>
          <strong>Tentang Kami</strong>
        </div>
        {aboutNavigation.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={item.id === active ? "active" : ""}
            aria-current={item.id === active ? "page" : undefined}
          >
            <span className="service-nav-number" aria-hidden="true">
              {aboutSectionNumbers[item.id]}
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

export function AboutServiceHero({
  title,
  description,
  current,
}: {
  title: string;
  description: string;
  current: string;
}) {
  return (
    <section className="service-hero service-hero-glass contact-service-hero">
      <div className="service-hero-grid" aria-hidden="true" />
      <div className="container service-hero-inner">
        <nav className="service-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link><span>/</span>
          <Link href="/tentang-kami">Tentang Kami</Link><span>/</span>
          <strong>{current}</strong>
        </nav>
        <div className="service-hero-layout">
          <div className="service-hero-copy">
            <p className="service-overline"><span /> Pusat Informasi &amp; Komunikasi</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <aside className="service-hero-aside" aria-label="Informasi pelayanan kontak">
            <div className="service-status">
              <span className="service-status-dot" />
              <div><small>Status pelayanan</small><strong>Petugas siap membantu</strong></div>
            </div>
            <div className="service-hero-meta">
              <span>Kanal resmi</span><span>Responsif &amp; terbuka</span><span>Sesuai jam layanan</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
