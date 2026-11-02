"use client";
import { usePublicServices } from "../layanan-publik/hooks/useServices";
import { Arrow, SectionHeading } from "./shared";

export function QuickLinksSection() {
  const { data: services = [] } = usePublicServices();
  const quickLinks = services.slice(0, 6).map((item) => ({id: item.id, icon: "▤", title: item.nama_layanan, description: item.deskripsi, tone: "sapphire", href: `/layanan-publik/layanan-cepat#${item.id}`}));
  return (
    <section className="card quick" id="layanan-cepat">
      <SectionHeading icon="ϟ" title="Layanan Cepat" action="" />
      <div>
        {quickLinks.map(({ id, icon, title, description, tone, href }) => (
          <a className="quick-link" href={href} key={id}>
            <span className={`quick-icon ${tone}`}>{icon}</span>
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <Arrow />
          </a>
        ))}
      </div>
    </section>
  );
}
