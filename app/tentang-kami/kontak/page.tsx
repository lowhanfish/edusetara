import type { Metadata } from "next";

import { AboutHero, AboutPageNavigation } from "../_components/about-shell";

export const metadata: Metadata = {
  title: "Kontak & Alamat | Dikbud Konawe Selatan",
  description: "Alamat kantor dan kanal komunikasi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan.",
};

const channels = [
  { icon: "☎", label: "Telepon", value: "(0408) 123 4567", note: "Pada jam layanan" },
  { icon: "✉", label: "Email", value: "dikbud@konaweselatankab.go.id", note: "Untuk informasi dan persuratan" },
  { icon: "⌖", label: "Kunjungan", value: "Kompleks Perkantoran Bupati", note: "Andoolo, Konawe Selatan" },
];

export default function ContactPage() {
  return (
    <>
      <AboutHero
        eyebrow="Kontak & Alamat"
        title="Terhubung lebih dekat dengan Dikbud Konawe Selatan."
        description="Temukan alamat kantor dan kanal komunikasi yang dapat digunakan untuk informasi, konsultasi, maupun pengaduan layanan."
        current="Kontak & Alamat"
      />
      <AboutPageNavigation active="contact" />

      <div className="container about-content">
        <section className="contact-grid">
          <div className="contact-main">
            <p className="section-kicker">Kantor Dinas</p>
            <h2>Kami siap membantu kebutuhan informasi Anda.</h2>
            <p className="contact-address">
              Jl. Poros Andoolo – Kendari<br />
              Kompleks Perkantoran Bupati<br />
              Kabupaten Konawe Selatan, Sulawesi Tenggara
            </p>
            <div className="contact-hours">
              <div><span>Senin – Kamis</span><strong>08.00 – 16.00 WITA</strong></div>
              <div><span>Jumat</span><strong>08.00 – 15.00 WITA</strong></div>
              <small>* Jam layanan dapat berubah pada hari libur nasional atau kebijakan khusus.</small>
            </div>
          </div>
          <div className="contact-map" aria-label="Ilustrasi lokasi kantor Dikbud Konawe Selatan">
            <div className="map-road road-one" /><div className="map-road road-two" />
            <div className="map-water" />
            <span className="map-pin">⌖</span>
            <div className="map-label"><small>Lokasi Kantor</small><strong>Dikbud Konawe Selatan</strong></div>
          </div>
        </section>

        <section className="about-section contact-channel-section">
          <div className="about-section-heading">
            <div><p className="section-kicker">Kanal Komunikasi</p><h2>Pilih cara yang paling nyaman</h2></div>
            <p>Sertakan identitas dan pokok kebutuhan agar kami dapat membantu dengan tepat.</p>
          </div>
          <div className="channel-grid">
            {channels.map((channel) => (
              <article key={channel.label}>
                <span aria-hidden="true">{channel.icon}</span>
                <small>{channel.label}</small>
                <strong>{channel.value}</strong>
                <p>{channel.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-note">
          <span aria-hidden="true">i</span>
          <div><strong>Sebelum menghubungi kami</strong><p>Siapkan nomor surat, nama satuan pendidikan, atau detail layanan bila ada. Informasi tersebut membantu petugas menelusuri kebutuhan Anda lebih cepat.</p></div>
        </section>
      </div>
    </>
  );
}
