import Link from "next/link";
import { AboutHero } from "../../tentang-kami/_components/about-shell";
import { navItems } from "../../_components/home/home-data";

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
    <AboutHero
      eyebrow={current}
      title={title}
      description={description}
      current={current}
      section={{ label: "Data & Statistik", href: "/data-statistik" }}
    />
  );
}

export function DataNavigation({ active }: { active: string }) {
  const items =
    navItems.find((item) => item.id === "nav-data")?.children ?? [];

  return (
    <nav className="container about-page-nav" aria-label="Navigasi Data dan Statistik">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={active === item.id ? "active" : ""}
          aria-current={active === item.id ? "page" : undefined}
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

export function DataHelp() {
  return (
    <section className="about-cta service-cta">
      <div>
        <p className="section-kicker">Layanan Satu Data Pendidikan</p>
        <h2>Butuh permohonan data atau informasi statistik khusus?</h2>
        <p>
          Ajukan permohonan data agregat resmi untuk kebutuhan riset, kebijakan, atau kemitraan melalui layanan PPID dan persuratan dinas.
        </p>
      </div>
      <Link className="button primary" href="/tentang-kami/kontak">
        Hubungi Tim Data <span>→</span>
      </Link>
    </section>
  );
}
