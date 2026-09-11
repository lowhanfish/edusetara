import Image from "next/image";

import { cultureLinks } from "./home-data";
import { SectionHeading } from "./shared";

export function CultureSection() {
  return (
    <section className="card culture" id="kebudayaan">
      <SectionHeading
        icon="♬"
        title="Kebudayaan Konawe Selatan"
        action=""
      />
      <p>Jaga warisan budaya, kuatkan jati diri daerah.</p>
      <div className="culture-body">
        <div>
          {cultureLinks.map(({ icon, label }) => (
            <a href="#" key={label}>
              <span>{icon}</span>
              {label}
            </a>
          ))}
        </div>
        <div className="culture-photo">
          <Image
            src="/img/hero-konsel.png"
            alt="Seni budaya Konawe Selatan"
            fill
            sizes="300px"
          />
          <a className="culture-button" href="#">
            Jelajahi Kebudayaan <b>→</b>
          </a>
        </div>
      </div>
    </section>
  );
}
