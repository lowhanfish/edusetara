import { satisfactionTrend } from "./home-data";
import { SectionHeading } from "./shared";

export function SatisfactionSection() {
  return (
    <section className="card satisfaction">
      <SectionHeading
        icon="▥"
        title="Indeks Kepuasan Masyarakat"
        action="Lihat Detail"
      />
      <div className="satisfaction-body">
        <div className="score">
          <span>Nilai IKM Terbaru</span>
          <b>
            90.14<small>%</small>
          </b>
          <p>Tahun 2026 (Semester 1)</p>
        </div>
        <div className="chart">
          <strong>Grafik Tren IKM</strong>
          <div className="bars">
            {satisfactionTrend.map(({ value, year, height }) => (
              <div key={year}>
                <b>{value}</b>
                <i style={{ height: `${height}px` }} />
                <span>{year}</span>
              </div>
            ))}
          </div>
          <small>
            <i /> Terkini　 ◯ Sebelumnya
          </small>
        </div>
        <div className="survey-links">
          <a href="#">
            <span>♨</span>
            <strong>
              Isi Survei<small>Beri penilaian Anda</small>
            </strong>
          </a>
          <a href="#">
            <span>▤</span>
            <strong>
              Hasil Survei<small>Lihat analisis lengkap</small>
            </strong>
          </a>
        </div>
      </div>
    </section>
  );
}
