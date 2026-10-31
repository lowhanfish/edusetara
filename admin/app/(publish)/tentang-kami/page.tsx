import type { Metadata } from "next";
import Link from "next/link";

import { AboutServiceHero, AboutServiceNavigation } from "./_components/about-shell";

export const metadata: Metadata = {
  title: "Profil Dinas | Dikbud Konawe Selatan",
  description:
    "Profil, arah kerja, tugas, dan nilai pelayanan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan.",
};

const missions = [
  "Memperluas akses pendidikan yang merata, inklusif, dan bermutu.",
  "Menguatkan kompetensi, karakter, serta kesejahteraan ekosistem pendidikan.",
  "Melindungi, mengembangkan, dan memanfaatkan kekayaan budaya daerah.",
  "Mewujudkan tata kelola layanan yang transparan, responsif, dan berbasis data.",
];

const functions = [
  { icon: "◎", title: "Perumusan kebijakan", text: "Menyiapkan arah dan kebijakan teknis bidang pendidikan serta kebudayaan daerah." },
  { icon: "↗", title: "Pelaksanaan program", text: "Menggerakkan program agar manfaat layanan menjangkau sekolah dan masyarakat." },
  { icon: "▥", title: "Pembinaan & evaluasi", text: "Mendampingi satuan pendidikan sekaligus memantau mutu dan capaian layanan." },
  { icon: "✦", title: "Pelestarian budaya", text: "Mendorong perlindungan warisan, ekspresi, pelaku, dan ruang budaya lokal." },
];

export default function AboutPage() {
  return (
    <>
      <AboutServiceHero
        title="Bergerak untuk pendidikan, bertumbuh bersama kebudayaan."
        description="Kami hadir untuk memastikan setiap warga Konawe Selatan memperoleh layanan pendidikan yang bermutu sekaligus ruang untuk menjaga identitas budayanya."
        current="Profil Dinas"
        variant="profile"
      />
      <AboutServiceNavigation active="profile" />

      <div className="container service-content quick-glass-content profile-glass-content">
        <section className="about-intro profile-intro">
          <div>
            <p className="section-kicker">Tentang Dikbud Konsel</p>
            <h2>Melayani hari ini, menyiapkan generasi masa depan.</h2>
          </div>
          <div className="about-intro-copy">
            <p>
              Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan merupakan
              perangkat daerah yang menjalankan urusan pemerintahan di bidang
              pendidikan dan kebudayaan. Kami bekerja bersama sekolah, pendidik,
              peserta didik, keluarga, pelaku budaya, dan masyarakat.
            </p>
            <p>
              Setiap program diarahkan untuk membangun layanan yang mudah
              dijangkau, dapat dipertanggungjawabkan, serta relevan dengan
              kebutuhan wilayah.
            </p>
          </div>
        </section>

        <section className="vision-mission-grid">
          <article className="vision-card">
            <span className="number-mark">01</span>
            <p className="section-kicker">Arah Besar</p>
            <h2>Visi Pelayanan</h2>
            <blockquote>
              “Terwujudnya pendidikan yang bermutu dan berkarakter, serta
              kebudayaan Konawe Selatan yang lestari dan berdaya.”
            </blockquote>
            <div className="vision-tags">
              <span>Bermutu</span><span>Inklusif</span><span>Berkarakter</span>
            </div>
          </article>
          <article className="mission-card">
            <span className="number-mark">02</span>
            <p className="section-kicker">Langkah Bersama</p>
            <h2>Misi Pelayanan</h2>
            <ol>
              {missions.map((mission, index) => (
                <li key={mission}><span>{String(index + 1).padStart(2, "0")}</span>{mission}</li>
              ))}
            </ol>
          </article>
        </section>

        <section className="service-section profile-functions-section">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Ruang Kerja Kami</p>
              <h2>Tugas dan fungsi utama</h2>
            </div>
            <p>Empat peran yang menghubungkan kebijakan dengan pelayanan nyata.</p>
          </div>
          <div className="function-grid">
            {functions.map((item) => (
              <article key={item.title}>
                <span aria-hidden="true">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-cta profile-cta">
          <div>
            <p className="section-kicker">Layanan yang dapat diandalkan</p>
            <h2>Kenali standar pelayanan kami.</h2>
            <p>Lihat prinsip, alur, serta kanal pengaduan untuk setiap layanan publik.</p>
          </div>
          <Link className="button primary" href="/tentang-kami/standar-pelayanan">
            Standar Pelayanan <span>→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
