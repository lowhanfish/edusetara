import type { Metadata } from "next";
import Link from "next/link";

import { AboutHero, AboutPageNavigation } from "../_components/about-shell";

export const metadata: Metadata = {
  title: "Standar Pelayanan | Dikbud Konawe Selatan",
  description: "Prinsip, jenis, dan alur pelayanan publik Dikbud Konawe Selatan.",
};

const principles = [
  { icon: "◇", title: "Mudah", text: "Persyaratan dan alur disampaikan dengan bahasa yang jelas." },
  { icon: "◷", title: "Tepat waktu", text: "Setiap permohonan diproses sesuai standar waktu layanan." },
  { icon: "◎", title: "Transparan", text: "Status, biaya, serta hasil layanan dapat diketahui pemohon." },
  { icon: "♿", title: "Inklusif", text: "Layanan diberikan setara dan memperhatikan kebutuhan aksesibilitas." },
];

const services = [
  { number: "01", title: "Informasi & konsultasi pendidikan", user: "Masyarakat / satuan pendidikan", time: "Sesuai jenis konsultasi" },
  { number: "02", title: "Administrasi kelembagaan sekolah", user: "Satuan pendidikan", time: "Sesuai kelengkapan berkas" },
  { number: "03", title: "Layanan data pendidikan", user: "Sekolah / operator", time: "Sesuai jenis permohonan" },
  { number: "04", title: "Fasilitasi kebudayaan", user: "Pelaku budaya / komunitas", time: "Sesuai agenda layanan" },
];

export default function ServiceStandardsPage() {
  return (
    <>
      <AboutHero
        eyebrow="Standar Pelayanan"
        title="Pelayanan publik yang jelas, setara, dan dapat dipercaya."
        description="Ketahui komitmen, jenis layanan, dan langkah yang perlu ditempuh sebelum mengajukan permohonan kepada Dikbud Konawe Selatan."
        current="Standar Pelayanan"
      />
      <AboutPageNavigation active="standards" />

      <div className="container about-content">
        <section className="service-promise">
          <div className="promise-mark" aria-hidden="true">✦</div>
          <div>
            <p className="section-kicker">Maklumat Pelayanan</p>
            <h2>Kami siap melayani dengan sepenuh hati.</h2>
            <p>
              Seluruh jajaran berkomitmen menyelenggarakan pelayanan sesuai
              standar, melakukan perbaikan secara berkelanjutan, serta menerima
              saran dan pengaduan sebagai bahan evaluasi.
            </p>
          </div>
          <span className="promise-seal">Melayani<br /><strong>Setara</strong></span>
        </section>

        <section className="about-section">
          <div className="about-section-heading">
            <div><p className="section-kicker">Prinsip Pelayanan</p><h2>Pengalaman layanan yang lebih baik</h2></div>
            <p>Prinsip yang menjadi pedoman di setiap titik pelayanan.</p>
          </div>
          <div className="principle-grid">
            {principles.map((item) => (
              <article key={item.title}><span>{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p></article>
            ))}
          </div>
        </section>

        <section className="about-section" id="jenis-layanan">
          <div className="about-section-heading">
            <div><p className="section-kicker">Jenis Pelayanan</p><h2>Temukan layanan yang dibutuhkan</h2></div>
            <p>Waktu penyelesaian mengikuti jenis layanan dan kelengkapan dokumen.</p>
          </div>
          <div className="service-table" role="table" aria-label="Daftar jenis pelayanan">
            <div className="service-table-head" role="row">
              <span role="columnheader">Layanan</span><span role="columnheader">Pengguna</span><span role="columnheader">Estimasi</span>
            </div>
            {services.map((service) => (
              <div className="service-row" role="row" key={service.number}>
                <div role="cell"><span>{service.number}</span><strong>{service.title}</strong></div>
                <p role="cell">{service.user}</p><p role="cell">{service.time}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="process-section" id="alur-pelayanan">
          <div>
            <p className="section-kicker">Alur Pelayanan</p>
            <h2>Empat langkah sederhana</h2>
            <p>Siapkan dokumen dengan lengkap agar permohonan dapat diproses lebih cepat.</p>
          </div>
          <ol className="process-list">
            <li><span>1</span><div><strong>Siapkan persyaratan</strong><small>Periksa dokumen sesuai jenis layanan.</small></div></li>
            <li><span>2</span><div><strong>Ajukan permohonan</strong><small>Sampaikan melalui loket atau kanal yang tersedia.</small></div></li>
            <li><span>3</span><div><strong>Verifikasi & proses</strong><small>Petugas memeriksa dan memproses permohonan.</small></div></li>
            <li><span>4</span><div><strong>Terima hasil layanan</strong><small>Hasil disampaikan melalui kanal yang disepakati.</small></div></li>
          </ol>
        </section>

        <section className="about-cta service-cta">
          <div><p className="section-kicker">Ada kendala pelayanan?</p><h2>Sampaikan pertanyaan atau pengaduan.</h2><p>Tim kami siap membantu mengarahkan kebutuhan layanan Anda.</p></div>
          <Link className="button primary" href="/tentang-kami/kontak">Hubungi Kami <span>→</span></Link>
        </section>
      </div>
    </>
  );
}
