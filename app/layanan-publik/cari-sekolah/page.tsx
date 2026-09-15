import type { Metadata } from "next";
import Link from "next/link";
import { ServiceHero, ServiceNavigation, ServiceHelp } from "../_components/service-shell";
import { SchoolDirectory } from "./_components/school-directory";
import schoolsData from "./schools.json";

export const metadata: Metadata = {
  title: "Cari Sekolah | Dikbud Konawe Selatan",
  description:
    "Direktori dan pencarian data satuan pendidikan SD dan SMP di 25 kecamatan Kabupaten Konawe Selatan.",
};

export default function SchoolFinderPage() {
  const schools = schoolsData.schools;
  const totalSchools = schools.length;
  const sdCount = schools.filter((s) => s.level === "SD").length;
  const smpCount = schools.filter((s) => s.level === "SMP").length;
  const negeriCount = schools.filter((s) => s.status === "NEGERI").length;
  const swastaCount = schools.filter((s) => s.status === "SWASTA").length;
  const districtsCount = new Set(schools.map((s) => s.district)).size;

  return (
    <>
      <ServiceHero
        current="Cari Sekolah"
        title="Temukan sekolah dari nama, NPSN, atau wilayah."
        description={`Telusuri ${totalSchools} satuan pendidikan SD dan SMP di ${districtsCount} kecamatan, lalu buka data referensi resminya langsung dari hasil pencarian.`}
        variant="glass"
      />
      <ServiceNavigation active="service-school-finder" />

      <div className="container service-content school-service-content quick-glass-content school-glass-content">
        {/* Quick Stats Grid */}
        <section className="service-section school-summary-section">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Data Kelembagaan</p>
              <h2>Ringkasan Satuan Pendidikan</h2>
            </div>
            <p>Data terintegrasi dari referensi Dapodik Kemendikdasmen RI.</p>
          </div>

          <div className="school-stats-row">
            <article className="school-stat-card">
              <span className="school-stat-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </span>
              <div>
                <strong>{totalSchools}</strong>
                <small>Total SD & SMP</small>
              </div>
            </article>

            <article className="school-stat-card">
              <span className="school-stat-icon" aria-hidden="true" style={{ background: "#fef3c7", color: "#b45309" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </span>
              <div>
                <strong>{sdCount}</strong>
                <small>Sekolah Dasar (SD)</small>
              </div>
            </article>

            <article className="school-stat-card">
              <span className="school-stat-icon" aria-hidden="true" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              </span>
              <div>
                <strong>{smpCount}</strong>
                <small>SMP Negeri & Swasta</small>
              </div>
            </article>

            <article className="school-stat-card">
              <span className="school-stat-icon" aria-hidden="true" style={{ background: "#f1f5f9", color: "#0f766e" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div>
                <strong>{districtsCount}</strong>
                <small>Kecamatan Terdata</small>
              </div>
            </article>

            <article className="school-stat-card">
              <span className="school-stat-icon" aria-hidden="true" style={{ background: "#d1fae5", color: "#047857" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <div>
                <strong>{negeriCount} / {swastaCount}</strong>
                <small>Negeri / Swasta</small>
              </div>
            </article>
          </div>
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

          <SchoolDirectory schools={schools} />
        </section>

        {/* Data Information & Disclaimer */}
        <section className="contact-note" style={{ marginTop: "40px" }}>
          <span aria-hidden="true">i</span>
          <div>
            <strong>Informasi Pembaruan Data Referensi</strong>
            <p>
              Data direktori satuan pendidikan ini dihimpun dari portal referensi resmi Kementerian Pendidikan Dasar dan Menengah RI (Pembaruan: September 2026).
              Bagi satuan pendidikan atau operator yang ingin melakukan pemutakhiran data (nama kepala sekolah, alamat, titik koordinat, atau sarana prasarana), silakan melakukan sinkronisasi melalui aplikasi <strong>Dapodik</strong> atau menghubungi <Link href="/tentang-kami/kontak" style={{ color: "#0b3b73", fontWeight: 700, textDecoration: "underline" }}>Kanal Layanan Resmi Dikbud Konawe Selatan</Link>.
            </p>
          </div>
        </section>

        <ServiceHelp />
      </div>
    </>
  );
}
