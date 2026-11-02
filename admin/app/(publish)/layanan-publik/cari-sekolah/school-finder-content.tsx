"use client";
import Link from "next/link";
import styles from "./school-summary.module.css";
import { ServiceHero, ServiceNavigation, ServiceHelp } from "../components/service-shell";
import { SchoolDirectory } from "./components/school-directory";
import { usePublicSchools } from "./hooks/useSchools";

export function SchoolFinderContent() {
  const { data: schools = [], isLoading, isError } = usePublicSchools();
  const totalSchools = schools.length;
  const counts = schools.reduce<Record<string, number>>((result, school) => {
    const level = school.level || "Belum diklasifikasikan";
    result[level] = (result[level] || 0) + 1;
    return result;
  }, {});
  const order = ["TK", "KB", "RA", "SPS", "SD", "MI", "SMP", "MTS", "SMA", "MA", "SMK", "SLB", "PKBM", "SKB", "KURSUS"];
  const levelCounts = Object.entries(counts).sort(([a], [b]) => {
    const ai = order.indexOf(a), bi = order.indexOf(b);
    return (ai < 0 ? order.length : ai) - (bi < 0 ? order.length : bi) || a.localeCompare(b, "id");
  });
  const negeriCount = schools.filter((s) => s.status === "NEGERI").length;
  const swastaCount = schools.filter((s) => s.status === "SWASTA").length;
  const districtsCount = new Set(schools.map((s) => s.district)).size;

  return (
    <>
      <ServiceHero
        current="Cari Sekolah"
        title="Temukan sekolah dari nama, NPSN, atau wilayah."
        description={`Telusuri ${totalSchools} satuan pendidikan seluruh jenjang di ${districtsCount} kecamatan, lalu buka data referensi resminya langsung dari hasil pencarian.`}
        variant="glass"
      />
      <ServiceNavigation active="service-school-finder" />

      <div className="container service-content school-service-content quick-glass-content school-glass-content">
        {/* Quick Stats Grid */}
        <section className={`service-section school-summary-section ${styles.summary}`}>
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Data Kelembagaan</p>
              <h2>Ringkasan Satuan Pendidikan</h2>
            </div>
            <p>Data Master Sekolah mencakup seluruh bentuk pendidikan, termasuk PAUD, madrasah, pendidikan menengah, dan nonformal.</p>
          </div>

          <div className={styles.totals}>
            <span className={styles.totalPrimary}><strong>{isLoading || isError ? "—" : totalSchools}</strong> satuan pendidikan</span>
            <span><strong>{isLoading || isError ? "—" : districtsCount}</strong> kecamatan</span>
            <span><i className={styles.negeri} /><strong>{isLoading || isError ? "—" : negeriCount}</strong> negeri</span>
            <span><i className={styles.swasta} /><strong>{isLoading || isError ? "—" : swastaCount}</strong> swasta</span>
          </div>
          {isLoading ? <p>Memuat ringkasan sekolah…</p> : isError ? <p role="alert">Ringkasan belum dapat dimuat.</p> : (
            <div className={styles.grid} aria-label="Jumlah satuan pendidikan per jenjang">
              {levelCounts.map(([level, count], index) => (
                <article className={`${styles.card} ${styles[`tone${index % 5}`]}`} key={level}>
                  <div className={styles.cardTop}>
                    <span className={styles.icon} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        {index % 3 === 0 ? <><path d="M3 9l9-6 9 6v11H3V9Z" /><path d="M9 20v-7h6v7M10 8h4" /></> : index % 3 === 1 ? <><path d="M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4V4Zm16 0h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-3h3V4Z" /></> : <><path d="m2 9 10-5 10 5-10 5-10-5Zm4 3v5c3 3 9 3 12 0v-5M22 9v7" /></>}
                      </svg>
                    </span>
                    <span className={styles.label}>{level}</span>
                  </div>
                  <div className={styles.cardBottom}><strong>{count}</strong><span>satuan pendidikan</span></div>
                </article>
              ))}
            </div>
          )}
          <p className={styles.note}>Data Master Sekolah · Seluruh jenjang · Ringkasan sebelum filter diterapkan</p>
        </section>

        {/* Interactive Directory Section */}
        <section className="service-section school-directory-section" id="direktori-sekolah">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Pencarian & Filter</p>
              <h2>Direktori Sekolah Konawe Selatan</h2>
            </div>
            <p>Filter berdasarkan nama, NPSN, kecamatan, jenjang, atau status kelembagaan.</p>
          </div>

          {isLoading ? <p>Memuat data sekolah…</p> : isError ? <p role="alert">Data sekolah belum dapat dimuat. Silakan coba kembali.</p> : <SchoolDirectory schools={schools} />}
        </section>

        {/* Data Information & Disclaimer */}
        <section className="contact-note" style={{ marginTop: "40px" }}>
          <span aria-hidden="true">i</span>
          <div>
            <strong>Informasi Pembaruan Data Referensi</strong>
            <p>
              Data direktori ini menggunakan Master Sekolah yang dikelola Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan.
              Bagi satuan pendidikan atau operator yang ingin melakukan pemutakhiran data (nama kepala sekolah, alamat, titik koordinat, atau sarana prasarana), silakan melakukan sinkronisasi melalui aplikasi <strong>Dapodik</strong> atau menghubungi <Link href="/tentang-kami/kontak" style={{ color: "#0b3b73", fontWeight: 700, textDecoration: "underline" }}>Kanal Layanan Resmi Dikbud Konawe Selatan</Link>.
            </p>
          </div>
        </section>

        <ServiceHelp />
      </div>
    </>
  );
}
