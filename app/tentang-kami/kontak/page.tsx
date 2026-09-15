import type { Metadata } from "next";
import Link from "next/link";

import { AboutServiceHero, AboutServiceNavigation } from "../_components/about-shell";

export const metadata: Metadata = {
  title: "Kontak & Alamat | Dikbud Konawe Selatan",
  description: "Alamat kantor dan kanal komunikasi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan.",
};

const channels = [
  { icon: "☎", label: "Telepon", value: "(0408) 123 4567", note: "Hubungi petugas pada jam layanan kantor.", href: "tel:+624081234567", action: "Hubungi sekarang" },
  { icon: "✉", label: "Email", value: "dikbud@konaweselatankab.go.id", note: "Untuk informasi, konsultasi, dan persuratan resmi.", href: "mailto:dikbud@konaweselatankab.go.id", action: "Kirim email" },
  { icon: "⌖", label: "Kunjungan", value: "Kompleks Perkantoran Bupati", note: "Andoolo, Kabupaten Konawe Selatan.", href: "#lokasi-kantor", action: "Lihat lokasi kantor" },
];

export default function ContactPage() {
  return (
    <>
      <AboutServiceHero
        title="Terhubung lebih dekat dengan Dikbud Konawe Selatan."
        description="Temukan alamat kantor dan kanal komunikasi yang dapat digunakan untuk informasi, konsultasi, maupun pengaduan layanan."
        current="Kontak & Alamat"
      />
      <AboutServiceNavigation active="contact" />

      <div className="container service-content quick-glass-content contact-glass-content">
        <section className="contact-grid" id="lokasi-kantor">
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

        <section className="service-section contact-channel-section">
          <div className="service-section-heading">
            <div><p className="section-kicker">Kanal Komunikasi</p><h2>Pilih cara yang paling nyaman</h2></div>
            <p>Sertakan identitas dan pokok kebutuhan agar kami dapat membantu dengan tepat.</p>
          </div>
          <div className="public-quick-grid contact-channel-grid">
            {channels.map((channel, index) => (
              <article className="quick-service-card" key={channel.label}>
                <div className="quick-card-rail">
                  <span>0{index + 1}</span>
                  <i aria-hidden="true">{channel.icon}</i>
                </div>
                <div className="quick-card-body">
                  <span className="public-card-label">{channel.label}</span>
                  <h3>{channel.value}</h3>
                  <p>{channel.note}</p>
                  <Link className="public-card-action" href={channel.href}>
                    <span className="public-action-row">
                      <span>{channel.action}</span><span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </div>
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
