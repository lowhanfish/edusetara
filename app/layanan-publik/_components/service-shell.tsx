import Link from "next/link";
import { AboutHero } from "../../tentang-kami/_components/about-shell";
import { navItems } from "../../_components/home/home-data";

export function ServiceHero({
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
      section={{ label: "Layanan Publik", href: "/layanan-publik" }}
    />
  );
}

export function ServiceNavigation({ active }: { active: string }) {
  const items =
    navItems.find((item) => item.id === "nav-public-services")?.children ?? [];

  return (
    <nav className="container about-page-nav" aria-label="Navigasi Layanan Publik">
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

export function ServiceHelp() {
  return (
    <section className="about-cta service-cta">
      <div>
        <p className="section-kicker">Butuh bantuan?</p>
        <h2>Temukan arahan untuk kebutuhan Anda.</h2>
        <p>Hubungi petugas untuk informasi persyaratan, dokumen, dan kanal pelayanan.</p>
      </div>
      <Link className="button primary" href="/tentang-kami/kontak">
        Kontak & Alamat <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
