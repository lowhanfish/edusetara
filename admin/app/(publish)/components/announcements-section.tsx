"use client";

import Link from "next/link";
import { useHomeAnnouncements } from "../hooks/useHomeData";
import { Arrow, SectionHeading } from "./shared";

export function AnnouncementsSection() {
  const { data: liveAnnouncements } = useHomeAnnouncements();
  const items = liveAnnouncements ?? [];

  return (
    <section className="card announcements" id="pengumuman">
      <SectionHeading icon="♟" title="Pengumuman" />
      <div>
        {items.map((item: any) => (
          <Link
            className="announcement"
            href={`/pengumuman#${item.id}`}
            key={item.id}
            aria-label={`Buka pengumuman: ${item.title}`}
          >
            <time>
              <b>{item.date}</b>
              <small>{item.month}</small>
            </time>
            <div className="flex-1 pr-2">
              <strong className="block line-clamp-2">{item.title}</strong>
              {item.category && (
                <span className="text-xs text-blue-600 block mt-0.5">{item.category}</span>
              )}
            </div>
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
