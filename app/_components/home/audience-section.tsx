import Image from "next/image";

import { audiences } from "./home-data";
import { Arrow } from "./shared";

export function AudienceSection() {
  return (
    <section className="audience-panel" id="layanan">
      <div className="audience-list">
        {audiences.map(({ id, icon, label, tone, href }) => (
          <a className={`audience ${tone}`} href={href} key={id}>
            <span>{icon}</span>
            <strong>
              {label.split("\n").map((line, index) => (
                <span key={`${id}-${index}`}>{line}</span>
              ))}
            </strong>
            <Arrow />
          </a>
        ))}
      </div>
      <a className="welcome-card" href="#tentang-kami" id="tentang-kami">
        <div className="welcome-image">
          <Image
            src="/img/hero-konsel.png"
            alt="Pemandangan Konawe Selatan"
            fill
            sizes="300px"
          />
        </div>
        <strong>
          Bersama Mewujudkan
          <br />
          Pendidikan dan Kebudayaan
          <br />
          Konawe Selatan yang Unggul
        </strong>
        <Arrow />
      </a>
    </section>
  );
}
