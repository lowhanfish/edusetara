"use client";

import Image from "next/image";
import Link from "next/link";

import { useHomeCulture } from "../hooks/useHomeData";
import { SectionHeading } from "./shared";

export function CultureSection() {
  const { data: cultureData } = useHomeCulture();

  const heroCulture = cultureData && cultureData.length > 0 ? cultureData[0] : null;

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
          {cultureData && cultureData.length > 0 ? (
            cultureData.slice(0, 4).map((item) => (
              <Link href={`/kebudayaan#${item.id}`} key={item.id} className="block py-1 hover:text-blue-600 transition-colors">
                <span className="mr-2">🏛️</span>
                {item.nama}
              </Link>
            ))
          ) : (
            <p>Belum ada data kebudayaan yang dipublikasikan.</p>
          )}
        </div>
        <div className="culture-photo relative overflow-hidden rounded">
          <Image
            src={heroCulture?.foto || "/img/hero-konsel.png"}
            alt={heroCulture?.nama || "Seni budaya Konawe Selatan"}
            fill
            sizes="300px"
            className="object-cover"
            unoptimized={heroCulture?.foto?.startsWith("http")}
          />
          <Link className="culture-button" href="/kebudayaan">
            Jelajahi Kebudayaan <b>→</b>
          </Link>
        </div>
      </div>
    </section>
  );
}
