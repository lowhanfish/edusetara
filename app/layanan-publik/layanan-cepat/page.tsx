import type { Metadata } from "next";
import Link from "next/link";
import { ServiceHero, ServiceNavigation, ServiceHelp } from "../_components/service-shell";

export const metadata: Metadata = {
  title: "Layanan Cepat | Dikbud Konawe Selatan",
  description:
    "Akses Dapodik, regulasi pendidikan, panduan unduhan, informasi pengaduan, dan tanya jawab layanan Dikbud Konawe Selatan.",
};

interface QuickServiceItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  text: string;
  href: string;
  action: string;
  external: boolean;
}

const services: QuickServiceItem[] = [
  {
    id: "dapodik",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    label: "Pendataan",
    title: "Dapodik",
    text: "Akses portal Data Pokok Pendidikan untuk informasi aplikasi, pemutakhiran data sekolah, dan sinkronisasi berkala.",
    href: "https://dapo.kemendikdasmen.go.id/",
    action: "Buka portal Dapodik",
    external: true,
  },
  {
    id: "spm",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    label: "Pelayanan",
    title: "Standar Pelayanan",
    text: "Kenali komitmen, jenis layanan, persyaratan, dan alur permohonan sebelum menghubungi petugas dinas.",
    href: "/tentang-kami/standar-pelayanan",
    action: "Lihat standar pelayanan",
    external: false,
  },
  {
    id: "pengaduan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: "Aspirasi & Bantuan",
    title: "Pengaduan Layanan",
    text: "Temukan kanal komunikasi resmi untuk menyampaikan kendala, saran perbaikan, atau pertanyaan layanan publik.",
    href: "/tentang-kami/kontak",
    action: "Lihat kanal komunikasi",
    external: false,
  },
  {
    id: "regulasi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    label: "Kebijakan",
    title: "Regulasi Pendidikan",
    text: "Telusuri produk hukum, keputusan menteri, dan peraturan perundangan bidang pendidikan melalui JDIH Kemendikdasmen.",
    href: "https://jdih.kemendikdasmen.go.id/",
    action: "Telusuri JDIH",
    external: true,
  },
  {
    id: "unduhan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    label: "Dokumen & Aplikasi",
    title: "Unduhan dan Panduan",
    text: "Installer aplikasi resmi, patch perbaikan, serta buku manual teknis Dapodik. Untuk formulir dinas, hubungi petugas.",
    href: "https://dapo.kemendikdasmen.go.id/unduhan",
    action: "Buka unduhan Dapodik",
    external: true,
  },
  {
    id: "bantuan-dapodik",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    label: "Pusat Bantuan",
    title: "Tanya Jawab Dapodik",
    text: "Penjelasan resmi dari pusat bantuan kementerian seputar panduan akun, registrasi, dan pemecahan kendala umum pendataan.",
    href: "https://pusatinformasi.ult.kemendikdasmen.go.id/hc/id/articles/57615116576793-Tanya-Jawab-Tentang-Dapodik",
    action: "Baca panduan bantuan",
    external: true,
  },
];

const questions = [
  {
    title: "Bagaimana memilih layanan yang tepat?",
    text: "Buka halaman Layanan Berdasarkan Pengguna, kemudian pilih kelompok dan kebutuhan Anda. Jika belum menemukan informasi yang sesuai, gunakan halaman Kontak & Alamat untuk meminta arahan langsung kepada petugas dinas.",
  },
  {
    title: "Apa saja yang perlu disiapkan saat berkonsultasi?",
    text: "Siapkan uraian kebutuhan secara ringkas, identitas pemohon, nama satuan pendidikan, serta nomor surat dinas atau NPSN bila terkait sekolah. Dokumen persyaratan mengikuti jenis layanan yang dituju.",
  },
  {
    title: "Bagaimana cara menyampaikan pengaduan atau aspirasi?",
    text: "Gunakan kanal resmi pada halaman Kontak & Alamat. Uraikan kejadian, waktu, nama layanan terkait, dan detail permasalahan yang dialami secara objektif agar dapat segera ditindaklanjuti.",
  },
  {
    title: "Apakah permohonan dapat diajukan langsung melalui situs ini?",
    text: "Portal ini menyajikan direktori informasi, panduan teknis, dan tautan rujukan resmi. Pengajuan berkas fisik atau verifikasi sistem dilakukan melalui loket pelayanan Dikbud Konawe Selatan atau aplikasi resmi kementerian.",
  },
  {
    title: "Di mana saya bisa memperoleh formulir pelayanan dinas daerah?",
    text: "Hubungi loket pelayanan Dikbud Konawe Selatan untuk mendapatkan blanko resmi daerah. Tautan unduhan pada halaman ini difokuskan pada installer aplikasi serta buku pedoman teknis Dapodik kementerian.",
  },
];

export default function QuickServicesPage() {
  return (
    <>
      <ServiceHero
        current="Layanan Cepat"
        title="Enam akses penting. Tanpa pencarian panjang."
        description="Portal pendataan, standar pelayanan, kanal pengaduan, regulasi, unduhan, dan pusat bantuan yang telah dirangkum dalam satu halaman."
        variant="glass"
      />
      <ServiceNavigation active="service-quick-access" />

      <div className="container service-content quick-glass-content">
        <section className="service-section" aria-labelledby="quick-heading">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Akses langsung</p>
              <h2 id="quick-heading">Pilih, periksa, lalu lanjutkan.</h2>
            </div>
            <p>Tanda ↗ menunjukkan portal resmi di luar situs Dikbud Konawe Selatan.</p>
          </div>

          <div className="public-quick-grid">
            {services.map((service, index) => (
              <article className="quick-service-card" id={service.id} key={service.id}>
                <div className="quick-card-rail"><span>0{index + 1}</span><i aria-hidden="true">{service.icon}</i></div>
                <div className="quick-card-body">
                  <span className="public-card-label">{service.label}</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                <Link
                  className="public-card-action"
                  href={service.href}
                  target={service.external ? "_blank" : undefined}
                  rel={service.external ? "noopener noreferrer" : undefined}
                >
                  <span className="public-action-row">
                    <span>{service.action}</span>
                    <span aria-hidden="true">
                      {service.external ? "↗" : "→"}
                    </span>
                  </span>
                  {service.external && <small>Portal eksternal · tab baru</small>}
                </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="service-section service-faq-section" id="faq">
          <div className="service-section-heading">
            <div>
              <p className="section-kicker">Pertanyaan Umum</p>
              <h2>Informasi sebelum menggunakan layanan</h2>
            </div>
            <p>Klik salah satu pertanyaan di bawah untuk membaca ulasan dan penjelasannya.</p>
          </div>

          <div className="public-faq">
            {questions.map((question) => (
              <details key={question.title}>
                <summary>{question.title}</summary>
                <p>{question.text}</p>
              </details>
            ))}
          </div>
        </section>

        <ServiceHelp />
      </div>
    </>
  );
}
