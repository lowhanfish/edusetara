import type { Metadata } from "next";
import Link from "next/link";
import { DataHero, DataNavigation, DataHelp } from "../_components/data-shell";
import { AnnouncementsFeed, type AnnouncementItem } from "./_components/announcements-feed";

export const metadata: Metadata = {
  title: "Pengumuman Resmi | Dikbud Konawe Selatan",
  description:
    "Pemberitahuan resmi dan surat edaran kedinasan Dikbud Konawe Selatan: jadwal ANBK 2026, seleksi PPPK, Dapodik, dan agenda daerah.",
};

const announcementsList: AnnouncementItem[] = [
  {
    id: "announcement-anbk-2026",
    number: "421.2/342/Dikbud/IX/2026",
    day: "05",
    month: "SEP",
    year: "2026",
    category: "Akademik & ANBK",
    title: "Pemberitahuan Jadwal dan Petunjuk Teknis Pelaksanaan ANBK Jenjang SD & SMP Tahun 2026",
    summary:
      "Dinas Pendidikan dan Kebudayaan menyampaikan timeline gladi bersih, sinkronisasi server semi-daring, dan jadwal pelaksanaan utama Asesmen Nasional Berbasis Komputer (ANBK) bagi seluruh satuan pendidikan se-Kabupaten Konawe Selatan.",
    attachmentName: "Surat_Edaran_Juknis_ANBK_2026.pdf",
    attachmentSize: "1.2 MB",
  },
  {
    id: "announcement-pppk-2026",
    number: "800/198/Dikbud/IX/2026",
    day: "03",
    month: "SEP",
    year: "2026",
    category: "Kepegawaian / PPPK",
    title: "Pengumuman Hasil Verifikasi Berkas Administrasi Pengadaan PPPK Guru Tahap II 2026",
    summary:
      "Daftar nama pelamar formasi jabatan fungsional guru yang dinyatakan Memenuhi Syarat (MS) dan panduan pengajuan sanggah melalui portal resmi SSCASN BKN.",
    attachmentName: "Hasil_Seleksi_Admin_PPPK_Guru_2026.pdf",
    attachmentSize: "3.4 MB",
  },
  {
    id: "announcement-dapodik-2026",
    number: "420/872/Dikbud/VIII/2026",
    day: "28",
    month: "AGT",
    year: "2026",
    category: "Pendataan & Dapodik",
    title: "Undangan Bimbingan Teknis dan Sinkronisasi Aplikasi Dapodik Versi 2027 Semester Ganjil",
    summary:
      "Pemberitahuan kepada kepala satuan pendidikan dan operator sekolah mengenai batas akhir cut-off pendataan Dapodik untuk penyaluran dana Bantuan Operasional Satuan Pendidikan (BOSP).",
    attachmentName: "Undangan_Bimtek_Dapodik_2026.pdf",
    attachmentSize: "850 KB",
  },
  {
    id: "announcement-cultural-festival-2026",
    number: "430/512/Dikbud/VIII/2026",
    day: "25",
    month: "AGT",
    year: "2026",
    category: "Kebudayaan & Event",
    title: "Petunjuk Teknis Pelaksanaan Pekan Kebudayaan dan Festival Seni Pelajar Konawe Selatan 2026",
    summary:
      "Pedoman cabang perlombaan seni tari daerah Tolaki, seni musik tradisional, dan pameran karya budaya pelajar dalam rangka memperingati Hari Jadi Kabupaten Konawe Selatan.",
    attachmentName: "Juknis_Festival_Seni_Pelajar_2026.pdf",
    attachmentSize: "2.8 MB",
  },
  {
    id: "announcement-pip-2026",
    number: "422/704/Dikbud/VIII/2026",
    day: "18",
    month: "AGT",
    year: "2026",
    category: "Akademik & ANBK",
    title: "Instruksi Aktivasi Rekening SimPel dan Penyaluran Bantuan PIP Fase II Tahun 2026",
    summary:
      "Instruksi kepada kepala sekolah dasar dan menengah pertama untuk mendampingi peserta didik penerima SK Nominasi Program Indonesia Pintar (PIP) melakukan aktivasi buku tabungan di bank penyalur.",
    attachmentName: "Instruksi_Aktivasi_Rekening_PIP_2026.pdf",
    attachmentSize: "920 KB",
  },
  {
    id: "announcement-ppg-2026",
    number: "821/231/Dikbud/VIII/2026",
    day: "10",
    month: "AGT",
    year: "2026",
    category: "Kepegawaian / PPPK",
    title: "Sosialisasi Pemanggilan Peserta Program Pendidikan Profesi Guru (PPG) Guru Tertentu 2026",
    summary:
      "Mekanisme konfirmasi kesediaan dan verifikasi ijazah bagi guru non-sertifikasi yang terpanggil mengikuti program sertifikasi pendidik melalui platform kementerian.",
    attachmentName: "Edaran_Pemanggilan_PPG_Guru_Tertentu.pdf",
    attachmentSize: "1.4 MB",
  },
];

export default function AnnouncementsPage() {
  return (
    <>
      <DataHero
        current="Pengumuman Resmi"
        title="Pemberitahuan, surat edaran, dan agenda kedinasan."
        description="Akses siaran resmi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan untuk memastikan keabsahan informasi dan petunjuk teknis layanan."
      />
      <DataNavigation active="data-announcements" />

      <div className="container about-content">
        <section aria-labelledby="announcements-heading">
          <div className="about-section-heading">
            <div>
              <p className="section-kicker">Warta Kedinasan</p>
              <h2 id="announcements-heading">Pengumuman & Surat Edaran</h2>
            </div>
            <p>Seluruh dokumen yang diterbitkan merupakan rujukan resmi Dikbud Konawe Selatan.</p>
          </div>

          <AnnouncementsFeed announcements={announcementsList} />
        </section>

        {/* Verification Note */}
        <section className="contact-note" style={{ marginTop: "40px" }}>
          <span aria-hidden="true">i</span>
          <div>
            <strong>Pemberitahuan Keabsahan dan Anti-Pungutan Liar</strong>
            <p>
              Seluruh proses seleksi, pengurusan administrasi beasiswa, pendataan, dan layanan kedinasan Dikbud Konawe Selatan <strong>tidak memungut biaya apapun (Gratis)</strong>. Waspadai penipuan yang mengatasnamakan pejabat dinas. Verifikasi keaslian surat edaran dapat dilakukan melalui <Link href="/tentang-kami/kontak" style={{ color: "#0b3b73", fontWeight: 700, textDecoration: "underline" }}>Kanal Layanan Resmi Dikbud Konsel</Link>.
            </p>
          </div>
        </section>

        <DataHelp />
      </div>
    </>
  );
}
