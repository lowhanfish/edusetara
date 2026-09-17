export interface AnnouncementItem {
  id: string;
  number: string;
  day: string;
  month: string;
  year: string;
  category: "Akademik & ANBK" | "Kepegawaian / PPPK" | "Pendataan & Dapodik" | "Kebudayaan & Event";
  title: string;
  summary: string;
  attachmentName: string;
  attachmentSize: string;
  important?: boolean;
  tone: "sapphire" | "emerald" | "amber" | "ruby" | "purple";
  targetAudience: string;
  deadline: string;
  signatory: string;
  keyPoints: string[];
}

export const announcementsData: AnnouncementItem[] = [
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
    important: true,
    tone: "ruby",
    targetAudience: "Kepala Satuan Pendidikan SD/SMP & Proktor/Teknisi Sekolah",
    deadline: "Sinkronisasi Server: 25 – 28 September 2026",
    signatory: "Kepala Dinas Pendidikan dan Kebudayaan Kab. Konawe Selatan",
    keyPoints: [
      "Pelaksanaan gladi bersih gelombang I dan II wajib diikuti seluruh sekolah mandiri maupun menumpang.",
      "Penetapan moda pelaksanaan (daring penuh atau semi-daring) dikunci melalui portal ANBK Pusat.",
      "Dukungan cadangan daya (UPS/genset) dan jaringan internet cadangan disiapkan oleh satuan pendidikan.",
      "Posko helpdesk teknis Dikbud Konsel beroperasi penuh 24 jam selama periode sinkronisasi data.",
    ],
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
    important: true,
    tone: "emerald",
    targetAudience: "Pelamar CASN / PPPK Jabatan Fungsional Guru se-Konsel",
    deadline: "Masa Sanggah: 06 – 08 September 2026 (Pukul 23.59 WITA)",
    signatory: "Ketua Panitia Seleksi Pengadaan ASN Dikbud Konawe Selatan",
    keyPoints: [
      "Pelamar yang berstatus Tidak Memenuhi Syarat (TMS) berhak mengajukan sanggah tanpa mengunggah dokumen baru.",
      "Tanggapan sanggah oleh panitia seleksi daerah diumumkan secara terbuka pada 12 September 2026.",
      "Seluruh tahapan seleksi pengadaan PPPK Guru 100% Bebas Biaya (Gratis) tanpa perantara.",
      "Waspadai nomor WhatsApp atau oknum yang menjanjikan kelulusan dengan imbalan materi.",
    ],
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
    tone: "amber",
    targetAudience: "Operator Dapodik SD/SMP/PKBM & Pengawas Sekolah Wilayah",
    deadline: "Cut-Off Sinkronisasi: 31 Agustus 2026 (Pukul 23.59 WIB)",
    signatory: "Sekretaris Dinas Pendidikan dan Kebudayaan Kab. Konawe Selatan",
    keyPoints: [
      "Pembaruan data peserta didik baru (rombongan belajar) wajib tervalidasi NISN dari Kemendikdasmen.",
      "Validasi beban mengajar guru minimal 24 jam tatap muka untuk kelancaran penerbitan Info GTK/SKTP.",
      "Kelengkapan profil sarana sanitasi sekolah dan ketersediaan buku kurikulum nasional.",
      "Klinik pendataan teknis dibuka di Aula Pertemuan Dikbud Konsel bagi sekolah dengan kendala jaringan.",
    ],
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
    tone: "purple",
    targetAudience: "Pembina Ekstrakurikuler Kesenian & Pelaku Budaya Daerah",
    deadline: "Pendaftaran Kontingen: 15 September 2026",
    signatory: "Kepala Bidang Kebudayaan Dikbud Konawe Selatan",
    keyPoints: [
      "Kompetisi terbuka bagi sanggar seni sekolah tingkat SD dan SMP di 25 kecamatan.",
      "Cabang lomba meliputi Tari Tradisi Tolaki kreasi baru, Vokal Solo Lagu Daerah, dan Gambar Cerita.",
      "Dewan juri terdiri dari budayawan, akademisi seni, dan maestro kesenian tradisi daerah.",
      "Pemberian sertifikat resmi bupati dan trofi apresiasi pembinaan bakat seni bagi sanggar unggulan.",
    ],
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
    tone: "sapphire",
    targetAudience: "Kepala Satuan Pendidikan & Bendahara Bantuan Sekolah",
    deadline: "Batas Aktivasi Bank: 30 September 2026",
    signatory: "Kepala Bidang Pendidikan Dasar Dikbud Konawe Selatan",
    keyPoints: [
      "Penerbitan surat rekomendasi aktivasi secara kolektif oleh kepala sekolah untuk memudahkan siswa.",
      "Bank penyalur resmi: BRI (untuk jenjang SD/SMP) dan BNI (untuk jenjang lanjutan).",
      "Bantuan PIP 100% utuh diterima peserta didik tanpa ada potongan dalam bentuk apa pun.",
      "Sekolah wajib melaporkan tanda terima aktivasi melalui sistem pelaporan bantuan Dikbud Konsel.",
    ],
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
    tone: "sapphire",
    targetAudience: "Guru ASN & Non-ASN Terdaftar SIMPKB / Info GTK",
    deadline: "Konfirmasi Kesediaan: 20 Agustus 2026",
    signatory: "Kepala Bidang Guru dan Tenaga Kependidikan (GTK)",
    keyPoints: [
      "Kandidat peserta wajib memeriksa notifikasi akun SIMPKB masing-masing secara berkala.",
      "Unggah berkas fakta integritas bermaterai dan scan ijazah S-1/D-IV yang linier dengan bidang studi.",
      "Pelaksanaan pembelajaran PPG dilakukan secara mandiri melalui platform Ruang Kerja Guru Kemendikdasmen.",
      "Layanan fasilitasi verifikasi berkas oleh Tim GTK Dikbud Konsel tidak dipungut biaya.",
    ],
  },
  {
    id: "announcement-bosp-kinerja-2026",
    number: "420/915/Dikbud/VIII/2026",
    day: "05",
    month: "AGT",
    year: "2026",
    category: "Pendataan & Dapodik",
    title: "Pemberitahuan Penetapan Satuan Pendidikan Penerima Dana BOSP Kinerja Berkemajuan Terbaik 2026",
    summary:
      "Daftar sekolah dasar dan menengah pertama negeri maupun swasta yang meraih alokasi dana BOSP Kinerja atas capaian peningkatan mutu Rapor Pendidikan tertinggi di Kabupaten Konawe Selatan.",
    attachmentName: "SK_Penerima_BOSP_Kinerja_2026.pdf",
    attachmentSize: "1.6 MB",
    tone: "amber",
    targetAudience: "Kepala Sekolah & Bendahara BOSP Satuan Pendidikan",
    deadline: "Penyusunan RKAS Perubahan: 25 Agustus 2026",
    signatory: "Kepala Dinas Pendidikan dan Kebudayaan Kab. Konawe Selatan",
    keyPoints: [
      "Penetapan alokasi dana berdasarkan penilaian otomatis indikator Rapor Pendidikan oleh Kemendikdasmen.",
      "Dana BOSP Kinerja wajib dialokasikan untuk program peningkatan literasi, numerasi, dan pelatihan guru.",
      "Penginputan lembar kerja rencana anggaran belanja sekolah dilakukan melalui aplikasi ARKAS versi terbaru.",
      "Tim pendamping dana BOS dinas membuka sesi asistensi verifikasi SPJ setiap hari kerja.",
    ],
  },
  {
    id: "announcement-beasiswa-berprestasi-2026",
    number: "422/689/Dikbud/VIII/2026",
    day: "01",
    month: "AGT",
    year: "2026",
    category: "Akademik & ANBK",
    title: "Pembukaan Pendaftaran Program Bantuan Beasiswa Prestasi Sains & Olahraga Pelajar 2026",
    summary:
      "Fasilitasi beasiswa pembinaan bagi peserta didik berprestasi tingkat provinsi dan nasional sebagai wujud komitmen apresiasi dan pemajuan talenta unggul daerah Konawe Selatan.",
    attachmentName: "Panduan_Beasiswa_Prestasi_Pelajar_2026.pdf",
    attachmentSize: "1.1 MB",
    tone: "sapphire",
    targetAudience: "Peserta Didik Berprestasi SD/SMP se-Konawe Selatan",
    deadline: "Pengumpulan Berkas: 20 Agustus 2026",
    signatory: "Kepala Bidang Pembinaan Pendidikan Dasar",
    keyPoints: [
      "Terbuka bagi juara 1, 2, dan 3 ajang resmi OSN, O2SN, dan FLS2N tingkat kabupaten maupun provinsi.",
      "Lampirkan salinan sertifikat juara yang dilegalisasi pejabat berwenang dan surat rekomendasi kepala sekolah.",
      "Penyaluran beasiswa ditransfer langsung ke rekening SimPel siswa penerima tanpa perantara.",
      "Pendaftaran dan pengunggahan berkas administrasi dilakukan secara daring bebas biaya.",
    ],
  },
];
