import { educationStats } from "./home-data";
import { SectionHeading } from "./shared";

export function StatisticsSection() {
  return (
    <section className="card stats" id="data-&-statistik">
      <SectionHeading
        icon="▥"
        title="Statistik Pendidikan"
        action="Lihat Detail"
      />
      <div className="stats-grid">
        {educationStats.map(({ icon, value, label, tone }) => (
          <div className={`stat ${tone}`} key={label}>
            <span>{icon}</span>
            <b>{value}</b>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
