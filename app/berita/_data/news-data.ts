export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: {
    lead: string;
    paragraphs: string[];
    quote?: {
      text: string;
      author: string;
      role: string;
    };
    highlightsTitle?: string;
    highlights?: string[];
  };
  category: "Pendidikan" | "Kebudayaan" | "GTK & Guru" | "Sarana Prasarana" | "Prestasi Siswa";
  date: string;
  publishedAt: string;
  author: string;
  authorRole: string;
  readTime: string;
  image: string;
  imageCaption: string;
  tags: string[];
  featured?: boolean;
}

export const newsArticles: NewsArticle[] = [
  {
    id: "news-tech-learning",
    slug: "teknologi-pembelajaran-sekolah",
    title: "Dikbud Konsel Dorong Pemanfaatan Teknologi & Perangkat Digital dalam Pembelajaran di Sekolah",
    excerpt: "Pemerintah Kabupaten Konawe Selatan melalui Dinas Pendidikan dan Kebudayaan mempercepat digitalisasi ruang kelas dengan mendistribusikan perangkat Chromebook dan pelatihan platform edukasi bagi para guru.",
    category: "Pendidikan",
    date: "05 September 2026",
    publishedAt: "2026-09-05",
    author: "Tim Publikasi & Media",
    authorRole: "Humas Dinas Pendidikan & Kebudayaan",
    readTime: "4 menit baca",
    image: "/img/pendidikan-jenjang.jpg",
    imageCaption: "Peserta didik di salah satu satuan pendidikan Konawe Selatan antusias mengikuti pembelajaran interaktif berbasis perangkat digital.",
    tags: ["Digitalisasi Sekolah", "Kurikulum Merdeka", "Chromebook", "Konawe Selatan"],
    featured: true,
    content: {
      lead: "Pemerintah Kabupaten Konawe Selatan melalui Dinas Pendidikan dan Kebudayaan terus melakukan akselerasi penguatan sarana dan prasarana teknologi informasi di seluruh satuan pendidikan dari jenjang Sekolah Dasar (SD) hingga Sekolah Menengah Pertama (SMP).",
      paragraphs: [
        "Langkah strategis ini diwujudkan melalui pendistribusian bertahap perangkat Chromebook, proyektor interaktif, dan modem internet satelit untuk sekolah-sekolah yang berada di wilayah terpencil, kepulauan, dan perbatasan daerah.",
        "Kepala Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan menegaskan bahwa penguasaan teknologi bukan sekadar pelengkap, melainkan jembatan penting untuk memastikan tidak ada disparitas atau kesenjangan kualitas pembelajaran antara sekolah perkotaan dan sekolah di pelosok desa.",
        "Selain penyediaan sarana fisik, Dikbud Konawe Selatan bekerja sama dengan Komunitas Belajar (Kombel) dan fasilitator teknologi daerah secara berkala menyelenggarakan workshop pemanfaatan platform pembelajaran digital, asesmen mandiri, dan integrasi kecerdasan buatan etis dalam penyusunan modul ajar.",
        "Melalui program ini, capaian literasi digital siswa dan guru di Konawe Selatan menunjukkan peningkatan signifikan pada Rapor Pendidikan daerah tahun 2026, menempatkan kabupaten ini sebagai salah satu rujukan digitalisasi pendidikan di Sulawesi Tenggara.",
      ],
      quote: {
        text: "Pendidikan bermutu harus dapat dinikmati oleh seluruh anak bangsa tanpa terkendala jarak geografis. Dengan teknologi yang tepat guna, ruang kelas di pelosok Konawe Selatan kini terhubung dengan jendela pengetahuan dunia.",
        author: "H. Erawan Supla Yuda, S.Pd., M.Pd.",
        role: "Kepala Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
      },
      highlightsTitle: "Poin Inisiatif Digitalisasi Pendidikan 2026:",
      highlights: [
        "Penyaluran lebih dari 1.200 unit Chromebook untuk laboratorium sekolah.",
        "Penyediaan akses internet satelit di 35 titik satuan pendidikan daerah 3T.",
        "Bimtek berkelanjutan pembuatan media pembelajaran interaktif bagi guru.",
        "Kesiapan 100% penyelenggaraan Asesmen Nasional Berbasis Komputer (ANBK).",
      ],
    },
  },
  {
    id: "news-cultural-festival-2026",
    slug: "festival-budaya-daerah-2026",
    title: "Semarakkan Warisan Leluhur, Konawe Selatan Sukses Gelar Festival Budaya & Seni Tradisi 2026",
    excerpt: "Ratusan seniman dan pelajar dari 25 kecamatan menampilkan kepiawaian seni tari Lulo, Mondotambe, dan alunan perkusi etnik dalam pagelaran tahunan kebudayaan daerah.",
    category: "Kebudayaan",
    date: "04 September 2026",
    publishedAt: "2026-09-04",
    author: "Bidang Kebudayaan",
    authorRole: "Seksi Kesenian & Tradisi Daerah",
    readTime: "5 menit baca",
    image: "/img/kebudayaan-warisan.jpg",
    imageCaption: "Penari tradisional membawakan tari Mondotambe dengan mengenakan busana tenun adat khas daerah pada pembukaan Festival Budaya Konawe Selatan.",
    tags: ["Pekan Kebudayaan", "Tari Lulo", "Kalosara", "Warisan Budaya"],
    featured: false,
    content: {
      lead: "Gelaran tahunan Pekan Seni dan Budaya Tradisional Kabupaten Konawe Selatan tahun 2026 berlangsung meriah dan sukses menyedot ribuan pasang mata masyarakat lokal maupun pemerhati budaya dari berbagai daerah.",
      paragraphs: [
        "Kegiatan yang dipusatkan di panggung terbuka ibu kota kabupaten Andoolo ini melibatkan kontingen seniman, sanggar tari, lembaga adat, serta perwakilan sekolah dari 25 kecamatan se-Kabupaten Konawe Selatan.",
        "Berbagai atraksi seni tradisi ditampilkan dengan memukau, mulai dari parade tari penyambutan Mondotambe, gelaran tari massal Lulo yang melibatkan lebih dari 500 penari pelajar, hingga kompetisi tabuhan instrumen musik etnik Kanda Wuta dan Gong perunggu.",
        "Kepala Bidang Kebudayaan Dikbud Konawe Selatan menyampaikan bahwa festival ini dirancang bukan sekadar sebagai tontonan hiburan rakyat, melainkan sebagai sarana pelestarian aktif, pewarisan nilai luhur falsafah Kalosara, dan penguatan identitas kearifan lokal Tolaki bagi generasi Z.",
        "Selain pementasan seni, festival juga dimeriahkan dengan pameran kerajinan tenun ikat motif khas Konsel, bazar kuliner tradisional Sinonggi dan Kasoami, serta lomba mendongeng sastra lisan Taenua antarsiswa sekolah dasar.",
      ],
      quote: {
        text: "Kebudayaan adalah akar kepribadian bangsa. Melalui panggung festival ini, anak-anak muda kita belajar bangga pada tanah kelahirannya dan menjunjung tinggi adat kesantunan Pombepasere.",
        author: "Dra. Hj. Siti Masitah, M.Si.",
        role: "Kepala Bidang Kebudayaan Dikbud Konawe Selatan",
      },
      highlightsTitle: "Rangkaian Capaian Festival Budaya 2026:",
      highlights: [
        "Partisipasi aktif 42 sanggar seni dan 25 kontingen kecamatan.",
        "Pemecahan rekor pementasan Tari Lulo Harmoni Pelajar terbesar di daerah.",
        "Eksibisi 6 motif tenun khas Konawe Selatan yang telah berhak cipta resmi.",
        "Pemberian piagam apresiasi dan pembinaan bagi maestro seni tradisi lokal.",
      ],
    },
  },
  {
    id: "news-independent-curriculum",
    slug: "sosialisasi-kurikulum-merdeka-guru",
    title: "Tingkatkan Mutu Belajar Mendalam, Dikbud Konsel Gelar Workshop Modul Ajar bagi 500 Pendidik",
    excerpt: "Fokus pada pembelajaran berdiferensiasi dan penguatan literasi numerasi, ratusan guru jenjang SD dan SMP mengikuti bimbingan teknis kurikulum secara bertahap.",
    category: "GTK & Guru",
    date: "03 September 2026",
    publishedAt: "2026-09-03",
    author: "Bidang Pembinaan GTK",
    authorRole: "Seksi Peningkatan Kompetensi Guru",
    readTime: "4 menit baca",
    image: "/img/pendidikan-gtk.jpg",
    imageCaption: "Para pendidik dan perwakilan Komunitas Belajar (Kombel) berdiskusi merancang asesmen diagnostik dan modul ajar berdiferensiasi.",
    tags: ["Kurikulum Merdeka", "GTK", "Pelatihan Guru", "Modul Ajar"],
    featured: false,
    content: {
      lead: "Guna memperkokoh implementasi Kurikulum Merdeka yang berpihak pada murid, Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan menyelenggarakan bimbingan teknis (Bimtek) perencanaan pembelajaran bagi 500 guru perwakilan gugus kecamatan.",
      paragraphs: [
        "Workshop ini menitikberatkan pada penerapan prinsip pembelajaran berdiferensiasi (teaching at the right level), di mana guru dilatih merancang aktivitas kelas yang fleksibel dan responsif terhadap keberagaman gaya belajar serta kecepatan pemahaman siswa.",
        "Narasumber dari Balai Penjaminan Mutu Pendidikan (BPMP) dan Balai Guru Penggerak (BGP) mendampingi para peserta membedah modul ajar, merumuskan tujuan pembelajaran esensial, serta memanfaatkan Platform Merdeka Mengajar (PMM) secara optimal.",
        "Kepala Bidang Pembinaan GTK menegaskan bahwa transformasi pendidikan hanya akan bermakna apabila terjadi perubahan nyata dalam interaksi belajar mengajar di ruang kelas, bukan sekadar penumpukan dokumen administratif.",
        "Setelah menyelesaikan pelatihan tatap muka, para peserta akan menjadi motor penggerak di Komunitas Belajar (Kombel) masing-masing sekolah untuk mengimbaskan praktik baik kepada rekan sejawat di wilayahnya.",
      ],
      quote: {
        text: "Guru yang terus belajar adalah jaminan terbaik bagi lahirnya generasi penerus yang cerdas dan berkarakter. Kami berkomitmen terus memfasilitasi peningkatan kompetensi pendidik se-Konawe Selatan.",
        author: "Asrudin, S.Pd., M.A.",
        role: "Kepala Bidang Ketenagaan & Profesi Pendidik Dikbud Konsel",
      },
      highlightsTitle: "Fokus Pelatihan Pembelajaran Mendalam:",
      highlights: [
        "Teknik asesmen diagnostik awal kognitif dan non-kognitif.",
        "Penyusunan alur tujuan pembelajaran (ATP) berbasis capaian terkini.",
        "Integrasi projek penguatan profil pelajar Pancasila (P5) berbasis kearifan lokal.",
        "Optimalisasi portofolio digital dan refleksi berkala kinerja guru.",
      ],
    },
  },
  {
    id: "news-school-facilities",
    slug: "bantuan-sarana-sekolah-pelosok",
    title: "Dinas Pendidikan Salurkan Bantuan Sarana Prasarana dan Perangkat TIK untuk Sekolah Pedalaman",
    excerpt: "Langkah nyata mengatasi kesenjangan fasilitas belajar, bantuan mebeler, proyektor, dan jaringan internet satelit disalurkan ke sekolah-sekolah di wilayah kepulauan dan pelosok.",
    category: "Sarana Prasarana",
    date: "02 September 2026",
    publishedAt: "2026-09-02",
    author: "Bidang Sarpras Dikdas",
    authorRole: "Seksi Kelembagaan & Sarana Prasarana",
    readTime: "3 menit baca",
    image: "/img/pendidikan-jenjang.jpg",
    imageCaption: "Penyaluran sarana bantuan mebeler dan perangkat pendukung pembelajaran di salah satu sekolah dasar pedalaman Konawe Selatan.",
    tags: ["Sarpras Sekolah", "Bantuan TIK", "Pendidikan Merata", "Konawe Selatan"],
    featured: false,
    content: {
      lead: "Sebagai komitmen nyata dalam mewujudkan keadilan akses pendidikan yang setara, Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan kembali merealisasikan penyaluran paket bantuan sarana dan prasarana sekolah.",
      paragraphs: [
        "Penyaluran bantuan termin kedua tahun anggaran 2026 ini diprioritaskan bagi satuan pendidikan jenjang Sekolah Dasar dan Sekolah Menengah Pertama yang berlokasi di kecamatan kepulauan serta daerah terluar kabupaten.",
        "Paket bantuan mencakup pengadaan mebeler ruang kelas baru (meja kursi ergonomis siswa dan guru), lemari perpustakaan, perangkat proyektor LCD, papan tulis interaktif, dan panel surya cadangan bagi sekolah yang belum teraliri listrik PLN 24 jam.",
        "Tim verifikasi sarpras dinas memastikan setiap unit barang yang dikirimkan memenuhi standar spesifikasi teknis dan langsung dapat dimanfaatkan untuk kelancaran kegiatan belajar mengajar murid.",
        "Kepala sekolah penerima manfaat menyampaikan apresiasi mendalam atas gerak cepat pemerintah daerah yang menjawab kebutuhan mendesak sarana belajar di lingkungan mereka.",
      ],
      quote: {
        text: "Kondisi fisik gedung dan sarana belajar yang nyaman adalah hak setiap anak Konawe Selatan. Kami tidak akan berhenti sebelum seluruh sekolah kita memiliki sarana yang layak dan aman.",
        author: "Ir. Bambang Sudarsono, M.T.",
        role: "Kepala Bidang Sarana & Prasarana Dikbud Konawe Selatan",
      },
      highlightsTitle: "Rincian Distribusi Sarpras Tahap II 2026:",
      highlights: [
        "640 set meja kursi siswa berstandar ergonomis.",
        "45 unit proyektor interaktif dan layar gantung.",
        "18 unit instalasi listrik tenaga surya (solar panel) hibrida.",
        "Pemberian bantuan perbaikan toilet sanitasi layak dan ramah anak.",
      ],
    },
  },
  {
    id: "news-art-studios-youth",
    slug: "regenerasi-seniman-muda-sanggar",
    title: "Kuatkan Jati Diri Pelajar, Sanggar Seni Konawe Selatan Giatkan Regenerasi Musik Perkusi Tradisional",
    excerpt: "Melibatkan generasi muda dalam memainkan instrumen Kanda Wuta dan gong perunggu menjadi sarana penanaman karakter profil pelajar Pancasila yang mencintai kearifan lokal.",
    category: "Kebudayaan",
    date: "28 Agustus 2026",
    publishedAt: "2026-08-28",
    author: "Bidang Kebudayaan",
    authorRole: "Pamong Budaya Ahli Muda",
    readTime: "4 menit baca",
    image: "/img/kebudayaan-sanggar.jpg",
    imageCaption: "Pelajar dan seniman muda di sanggar seni binaan mempraktikkan harmonisasi irama tabuhan gong dan kendang dimba.",
    tags: ["Sanggar Seni", "Musik Tradisional", "Kanda Wuta", "Generasi Muda"],
    featured: false,
    content: {
      lead: "Upaya menjaga keberlangsungan seni musik tradisional di Kabupaten Konawe Selatan mendapatkan angin segar dengan semakin aktifnya sanggar-sanggar seni yang melibatkan pelajar usia dini hingga remaja.",
      paragraphs: [
        "Melalui program pembinaan sanggar berbasis Nomor Induk Kesenian (NIK) yang digulirkan Dikbud Konsel, puluhan sanggar tari dan musik di kecamatan Moramo, Konda, Andoolo, dan Ranomeeto membuka kelas pelatihan gratis bagi anak-anak sekolah setiap akhir pekan.",
        "Para seniman senior dengan sabar mentransfer keterampilan menabuh perangkat Kanda Wuta—alat musik khas Tolaki dari bambu dan kulit hewan—serta ritme rampak gong perunggu dan gendang dimba.",
        "Selain mengasah kepekaan estetika dan musikalitas, latihan kesenian tradisional terbukti efektif menjauhkan generasi muda dari dampak negatif kecanduan gawai dan perilaku menyimpang.",
        "Dinas Pendidikan dan Kebudayaan secara berkesinambungan memberikan fasilitasi bantuan pemeliharaan instrumen musik serta mementaskan kelompok-kelompok seni binaan ini dalam berbagai acara kedinasan dan festival daerah.",
      ],
      quote: {
        text: "Melihat anak-anak muda kita dengan bangga memegang pemukul gong dan menari dengan percaya diri adalah kebahagiaan terbesar. Tradisi ini tidak akan punah selama kita rawat bersama.",
        author: "La Ode Hidayat, S.Sn.",
        role: "Pamong Budaya & Koordinator Pembina Sanggar Daerah",
      },
      highlightsTitle: "Program Pembinaan Sanggar Seni Pelajar:",
      highlights: [
        "Pemberian bantuan perawatan alat musik tradisional untuk 20 sanggar aktif.",
        "Pelaksanaan panggung pentas berkala di ruang terbuka publik.",
        "Integrasi materi musik etnik ke dalam kurikulum intrakurikuler seni budaya.",
        "Fasilitasi beasiswa pembinaan bagi siswa berprestasi di bidang seni tradisi.",
      ],
    },
  },
  {
    id: "news-science-olympiad-winner",
    slug: "prestasi-siswa-smp-olimpiade-sains",
    title: "Membanggakan Daerah, Siswa SMP Asal Konawe Selatan Sabet Medali Emas Olimpiade Sains Provinsi",
    excerpt: "Prestasi gemilang diraih kontingen pelajar Konawe Selatan di bidang IPA dan Matematika, membuktikan kualitas pendidikan daerah mampu bersaing di tingkat regional dan nasional.",
    category: "Prestasi Siswa",
    date: "25 Agustus 2026",
    publishedAt: "2026-08-25",
    author: "Bidang Pembinaan Dikdas",
    authorRole: "Seksi Pembinaan Kesiswaan & Bakat",
    readTime: "3 menit baca",
    image: "/img/pendidikan-jenjang.jpg",
    imageCaption: "Apresiasi dan pengalungan medali bagi siswa berprestasi ajang Olimpiade Sains Nasional jenjang SMP oleh jajaran Dikbud Konsel.",
    tags: ["Olimpiade Sains", "Prestasi Siswa", "SMP Konsel", "Generasi Emas"],
    featured: false,
    content: {
      lead: "Kabar membanggakan datang dari panggung pendidikan nasional. Siswa perwakilan SMP Kabupaten Konawe Selatan berhasil meraih medali emas pada ajang seleksi Olimpiade Sains Nasional (OSN) tingkat Provinsi Sulawesi Tenggara.",
      paragraphs: [
        "Siswa berprestasi bernama Muhammad Fajar Pratama dari SMP Negeri di wilayah Konawe Selatan berhasil mengungguli ratusan peserta dari berbagai kabupaten/kota pada cabang kompetensi Ilmu Pengetahuan Alam (IPA) Terpadu.",
        "Keberhasilan ini merupakan buah manis dari program pembinaan intensif klinik sains yang diselenggarakan oleh Musyawarah Guru Mata Pelajaran (MGMP) IPA bekerja sama dengan Bidang Pembinaan Dikdas Dikbud Konawe Selatan.",
        "Kepala Dinas Pendidikan dan Kebudayaan secara langsung menyambut kedatangan sang juara dan memberikan piagam penghargaan serta bantuan beasiswa pendidikan daerah untuk mendukung persiapannya menuju tingkat nasional.",
        "Pencapaian ini sekaligus menegaskan bahwa anak-anak yang menimba ilmu di daerah memiliki potensi intelektual luar biasa apabila didukung pembinaan yang tepat, dedikasi guru pembimbing, dan motivasi yang kuat.",
      ],
      quote: {
        text: "Prestasi Fajar membuktikan bahwa anak-anak Konawe Selatan memiliki potensi luar biasa untuk bersaing di tingkat tertinggi. Kami bangga dan akan terus mengawal pembinaannya menuju panggung nasional.",
        author: "H. Erawan Supla Yuda, S.Pd., M.Pd.",
        role: "Kepala Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan",
      },
      highlightsTitle: "Catatan Prestasi Kontingen Sains Konsel 2026:",
      highlights: [
        "Medali Emas cabang IPA Terpadu jenjang SMP tingkat Provinsi.",
        "Peringkat 4 besar cabang Matematika jenjang SD tingkat Provinsi.",
        "Pemberian beasiswa berprestasi jaminan kelanjutan studi ke jenjang atas.",
        "Apresiasi pembinaan bagi guru pembimbing olimpiade sekolah.",
      ],
    },
  },
];

export function getAllNews(): NewsArticle[] {
  return newsArticles;
}

export function getFeaturedNews(): NewsArticle {
  return newsArticles.find((item) => item.featured) || newsArticles[0];
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((item) => item.slug === slug);
}

export function getRelatedNews(currentSlug: string, limit = 3): NewsArticle[] {
  const current = getNewsBySlug(currentSlug);
  return newsArticles
    .filter((item) => item.slug !== currentSlug)
    .sort((a, b) => {
      if (current && a.category === current.category) return -1;
      if (current && b.category === current.category) return 1;
      return 0;
    })
    .slice(0, limit);
}
