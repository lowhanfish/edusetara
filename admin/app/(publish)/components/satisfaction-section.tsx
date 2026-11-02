"use client";
import { usePublicStats } from "../data-statistik/hooks/useStats";
import { SectionHeading } from "./shared";

export function SatisfactionSection() {
  const { data: indicators = [] } = usePublicStats();
  const satisfactionTrend = indicators.filter((item) => /kepuasan|\bIKM\b/i.test(`${item.indikator} ${item.kategori || ""}`)).map((item) => ({id: item.id, value: item.nilai, year: item.tahun, height: Math.max(0, Math.min(100, Number(String(item.nilai).replace(",", "."))))})).sort((a, b) => Number(a.year) - Number(b.year));
  const latest = satisfactionTrend.at(-1);
  return (
    <section className="card satisfaction" id="kepuasan-masyarakat">
      <SectionHeading
        icon="▥"
        title="Indeks Kepuasan Masyarakat"
        action="Lihat Detail"
      />
      <div className="satisfaction-body">
        <div className="score">
          <span>Nilai IKM Terbaru</span>
          <b>
            {latest?.value ?? "—"}<small>%</small>
          </b>
          <p>{latest ? `Tahun ${latest.year}` : "Belum ada data IKM yang dipublikasikan"}</p>
        </div>
        <div className="chart">
          <strong>Grafik Tren IKM</strong>
          <div className="bars">
            {satisfactionTrend.map(({ id, value, year, height }) => (
              <div key={id}>
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
