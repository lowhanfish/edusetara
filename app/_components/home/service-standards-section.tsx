import { serviceStandards } from "./home-data";
import { SectionHeading } from "./shared";

export function ServiceStandardsSection() {
  return (
    <section className="card standards" id="standar-pelayanan">
      <SectionHeading icon="♟" title="Standar Pelayanan" />
      <div>
        {serviceStandards.map(({ id, title, size, href }) => (
          <a href={href} key={id}>
            <span className="doc-icon">▤</span>
            <strong>
              {title}
              <small>{size}</small>
            </strong>
            <span className="download">↓</span>
          </a>
        ))}
      </div>
    </section>
  );
}
