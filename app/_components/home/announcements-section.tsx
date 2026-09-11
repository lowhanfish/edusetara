import { announcements } from "./home-data";
import { Arrow, SectionHeading } from "./shared";

export function AnnouncementsSection() {
  return (
    <section className="card announcements" id="pengumuman">
      <SectionHeading icon="♟" title="Pengumuman" />
      <div>
        {announcements.map(({ date, month, title }) => (
          <a className="announcement" href="#" key={title}>
            <time>
              <b>{date}</b>
              <small>{month}</small>
            </time>
            <strong>{title}</strong>
            <Arrow />
          </a>
        ))}
      </div>
    </section>
  );
}
