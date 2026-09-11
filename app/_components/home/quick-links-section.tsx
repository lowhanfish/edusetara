import { quickLinks } from "./home-data";
import { Arrow, SectionHeading } from "./shared";

export function QuickLinksSection() {
  return (
    <section className="card quick" id="layanan-cepat">
      <SectionHeading icon="ϟ" title="Layanan Cepat" action="" />
      <div>
        {quickLinks.map(({ icon, title, description, tone }) => (
          <a className="quick-link" href="#" key={title}>
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
