"use client";
import { usePublicProfiles } from "../tentang-kami/hooks/useAbout";
import { SectionHeading } from "./shared";

export function ServiceStandardsSection() {
  const { data: profiles = [] } = usePublicProfiles();
  const serviceStandards = profiles.filter((item) => /standar|maklumat|pelayanan/i.test(item.kategori || item.judul)).map((item) => ({id: item.id, title: item.judul, size: item.file ? "Dokumen layanan" : "Informasi layanan", href: item.file || `/tentang-kami/standar-pelayanan#${item.id}`}));
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
