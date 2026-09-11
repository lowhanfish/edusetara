export function Arrow() {
  return <span className="round-arrow">→</span>;
}

export function SectionHeading({
  icon,
  title,
  action = "Lihat Semua",
}: {
  icon: string;
  title: string;
  action?: string;
}) {
  return (
    <div className="section-heading">
      <span className="heading-icon">{icon}</span>
      <h3>{title}</h3>
      <a href="#">
        {action} <span>→</span>
      </a>
    </div>
  );
}
