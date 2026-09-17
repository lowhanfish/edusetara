import Link from "next/link";
import { announcements } from "./home-data";
import { Arrow, SectionHeading } from "./shared";

export function AnnouncementsSection() {
  return (
    <section className="card announcements" id="pengumuman">
      <SectionHeading icon="♟" title="Pengumuman" />
      <div>
        {announcements.map(({ id, date, month, title }) => (
          <Link
            className="announcement"
            href={`/pengumuman#${id}`}
            key={id}
            aria-label={`Buka pengumuman: ${title}`}
          >
            <time>
              <b>{date}</b>
              <small>{month}</small>
            </time>
            <strong>{title}</strong>
            <Arrow />
          </Link>
        ))}
      </div>
      <div className="announcements-footer-action">
        <Link href="/pengumuman" className="view-all-link">
          <span>Lihat Semua Pengumuman &amp; Edaran</span>
          <Arrow />
        </Link>
      </div>
    </section>
  );
}

