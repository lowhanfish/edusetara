import { announcements } from "./home-data";
import { Arrow, SectionHeading } from "./shared";

export function AnnouncementsSection() {
  return (
    <section className="card announcements" id="pengumuman">
      <SectionHeading icon="♟" title="Pengumuman" />
      <div>
        {announcements.map(({ id, date, month, title }) => (
          <a className="announcement" href="#pengumuman" key={id}>
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
