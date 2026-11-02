"use client";

import { useHomeStats } from "../hooks/useHomeData";
import Link from "next/link";

export function StatisticsSection() {
  const { data: liveStats } = useHomeStats();
  const items = liveStats ?? [];

  return (
    <section className="card stats" id="data-statistik">
      <div className="section-heading">
        <span className="heading-icon" aria-hidden="true">▥</span>
        <h3>Statistik Pendidikan</h3>
        <Link href="/data-statistik">
          Lihat Detail →
        </Link>
      </div>
      <div className="stats-grid">
        {items.map((stat: any) => (
          <div className={`stat ${stat.tone || "sapphire"}`} key={stat.id}>
            <span>{stat.icon || "📊"}</span>
            <b>{stat.value}</b>
            <small>{stat.label || stat.sub}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
