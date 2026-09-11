import { serviceStandards } from "./home-data";
import { SectionHeading } from "./shared";

export function ServiceStandardsSection() {
  return (
    <section className="card standards" id="standar-pelayanan">
      <SectionHeading icon="♟" title="Standar Pelayanan" />
      <div>
        {serviceStandards.map(({ title, size }) => (
          <a href="#" key={title}>
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
