"""Seed comprehensive, realistic publish data with actual uploaded files for EduSetara."""

import asyncio
import os
import shutil
import time
import uuid
from pathlib import Path

from sqlalchemy import delete, select, text
from app.db.session import edusetara_session_factory
from app.models.operational.berita import (
    BannerSlide,
    Berita,
    KebudayaanItem,
    LayananPublik,
    PendidikanProgram,
    PengumumanPublish,
    PesanKontak,
    ProfilSection,
    StatistikItem,
)

SERVER_ROOT = Path(__file__).resolve().parents[2]
UPLOADS_ROOT = SERVER_ROOT / "uploads"
ADMIN_IMG_ROOT = SERVER_ROOT.parent / "admin" / "public" / "img"


def create_minimal_pdf(title: str, subtitle: str) -> bytes:
    clean_title = "".join(c if 32 <= ord(c) < 127 else "_" for c in title)
    clean_sub = "".join(c if 32 <= ord(c) < 127 else "_" for c in subtitle)
    stream = f"BT /F1 16 Tf 50 740 Td ({clean_title}) Tj ET\nBT /F1 11 Tf 50 710 Td ({clean_sub[:90]}) Tj ET\n"
    stream_bytes = stream.encode("latin1")
    length = len(stream_bytes)
    return (
        b"%PDF-1.4\n"
        b"1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n"
        b"2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n"
        b"3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>> endobj\n"
        b"4 0 obj <</Length " + str(length).encode("ascii") + b">> stream\n" + stream_bytes + b"endstream\nendobj\n"
        b"5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj\n"
        b"xref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000244 00000 n \n0000000350 00000 n \n"
        b"trailer <</Size 6 /Root 1 0 R>>\nstartxref\n435\n%%EOF\n"
    )


def ensure_file_exists(module: str, filename: str, source_img: str | None = None, is_pdf: bool = False, pdf_title: str = "") -> str:
    target_dir = UPLOADS_ROOT / module
    target_dir.mkdir(parents=True, exist_ok=True)
    target_file = target_dir / filename

    if not target_file.exists():
        if is_pdf:
            pdf_bytes = create_minimal_pdf(pdf_title or filename, "Pemerintah Kabupaten Konawe Selatan - Dinas Pendidikan dan Kebudayaan")
            with open(target_file, "wb") as f:
                f.write(pdf_bytes)
        elif source_img and (ADMIN_IMG_ROOT / source_img).exists():
            shutil.copyfile(ADMIN_IMG_ROOT / source_img, target_file)
        else:
            # Fallback to any existing image
            first_found = next(ADMIN_IMG_ROOT.glob("*.jpg"), None) or next(ADMIN_IMG_ROOT.glob("*.png"), None)
            if first_found:
                shutil.copyfile(first_found, target_file)

    return f"/uploads/{module}/{filename}"


async def seed_publish():
    print("Preparing uploads directory and sample files...")
    UPLOADS_ROOT.mkdir(parents=True, exist_ok=True)

    # 1. Prepare files for Berita
    file_berita_1 = ensure_file_exists("berita", "berita_digitalisasi_kelas.jpg", "pendidikan-jenjang.jpg")
    file_berita_2 = ensure_file_exists("berita", "berita_seni_tolaki.jpg", "kebudayaan-sanggar.jpg")
    file_berita_3 = ensure_file_exists("berita", "berita_pelatihan_guru_konsel.jpg", "pendidikan-gtk.jpg")
    file_berita_4 = ensure_file_exists("berita", "berita_cagar_budaya_benteng.jpg", "kebudayaan-warisan.jpg")
    file_berita_5 = ensure_file_exists("berita", "berita_anbk_smp_andoolo.jpg", "pendidikan-jenjang.jpg")

    # 2. Prepare files for Pengumuman (PDFs)
    file_pengumuman_1 = ensure_file_exists("pengumuman", "pengumuman_tpg_tw3_2026.pdf", is_pdf=True, pdf_title="Juknis Pemberkasan TPG Triwulan III Tahun 2026")
    file_pengumuman_2 = ensure_file_exists("pengumuman", "jadwal_simulasi_anbk_2026.pdf", is_pdf=True, pdf_title="Jadwal Simulasi dan Gladi Bersih ANBK Jenjang SMP")
    file_pengumuman_3 = ensure_file_exists("pengumuman", "edaran_libur_semester_2026.pdf", is_pdf=True, pdf_title="Surat Edaran Kalender Akademik dan Libur Semester")
    file_pengumuman_4 = ensure_file_exists("pengumuman", "pendaftaran_beasiswa_pip_konsel.pdf", is_pdf=True, pdf_title="Verifikasi Rekening Penerima Bantuan PIP Tahap II")
    file_pengumuman_5 = ensure_file_exists("pengumuman", "seleksi_guru_berprestasi_2026.pdf", is_pdf=True, pdf_title="Pedoman Seleksi Guru dan Kepala Sekolah Berprestasi")

    # 3. Prepare files for Banner
    file_banner_1 = ensure_file_exists("banner", "banner_transformasi_digital.png", "hero-konsel.png")
    file_banner_2 = ensure_file_exists("banner", "banner_budaya_kearifan_lokal.jpg", "kebudayaan-warisan.jpg")
    file_banner_3 = ensure_file_exists("banner", "banner_gtk_merdeka_belajar.jpg", "pendidikan-gtk.jpg")

    # 4. Prepare files for Pendidikan
    file_edu_1 = ensure_file_exists("pendidikan", "modul_kurikulum_merdeka.jpg", "pendidikan-jenjang.jpg")
    file_edu_2 = ensure_file_exists("pendidikan", "panduan_literasi_digital.jpg", "pendidikan-gtk.jpg")
    file_edu_3 = ensure_file_exists("pendidikan", "proyek_p5_lingkungan.jpg", "hero-konsel.png")
    file_edu_4 = ensure_file_exists("pendidikan", "penguatan_numerasi_dasar.jpg", "pendidikan-jenjang.jpg")

    # 5. Prepare files for Kebudayaan
    file_budaya_1 = ensure_file_exists("kebudayaan", "tarian_lulo_tolaki.jpg", "kebudayaan-sanggar.jpg")
    file_budaya_2 = ensure_file_exists("kebudayaan", "situs_makam_raja_kuno.jpg", "kebudayaan-warisan.jpg")
    file_budaya_3 = ensure_file_exists("kebudayaan", "tenun_motif_moronene_konsel.jpg", "kebudayaan-sanggar.jpg")
    file_budaya_4 = ensure_file_exists("kebudayaan", "alat_musik_gamelan_bambu.jpg", "kebudayaan-warisan.jpg")

    # 6. Prepare files for Profil
    file_profil_1 = ensure_file_exists("profil", "struktur_organisasi_dikbud_2026.pdf", is_pdf=True, pdf_title="Bagan Struktur Organisasi Dinas Dikbud Konawe Selatan")
    file_profil_2 = ensure_file_exists("profil", "maklumat_pelayanan_dikbud.pdf", is_pdf=True, pdf_title="Maklumat Standar Pelayanan Publik Terpadu")
    file_profil_3 = ensure_file_exists("profil", "sk_standar_operasional_prosedur.pdf", is_pdf=True, pdf_title="Keputusan Kepala Dinas tentang Standar Operasional Prosedur")

    async with edusetara_session_factory() as session:
        print("Clearing old publish records to ensure fresh, clean, rich datasets...")
        await session.execute(delete(Berita))
        await session.execute(delete(PengumumanPublish))
        await session.execute(delete(BannerSlide))
        await session.execute(delete(KebudayaanItem))
        await session.execute(delete(PendidikanProgram))
        await session.execute(delete(ProfilSection))
        await session.execute(delete(LayananPublik))
        await session.execute(delete(StatistikItem))
        await session.execute(delete(PesanKontak))

        # --- SEED BERITA ---
        berita_records = [
            Berita(
                id=str(uuid.uuid4()),
                judul="Pemerintah Kabupaten Konawe Selatan Salurkan Bantuan Chromebook untuk 45 Sekolah Dasar",
                slug="penyaluran-chromebook-45-sd-konsel",
                sumber="Dinas Pendidikan dan Kebudayaan",
                kategori="Pendidikan",
                author="Tim Media Dikbud",
                deskripsi="Langkah strategis pemerataan fasilitas digitalisasi ruang kelas guna mendukung Asesmen Nasional Berbasis Komputer (ANBK).",
                isi="<p>Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan secara resmi menyalurkan bantuan perangkat digital berupa ratusan unit Chromebook kepada 45 Sekolah Dasar yang tersebar di wilayah kepulauan dan daratan. Program ini didanai melalui DAK Fisik Bidang Pendidikan Tahun Anggaran 2026.</p><p>Kepala Dinas Dikbud menyampaikan bahwa digitalisasi ruang kelas merupakan komitmen Pemkab untuk memastikan tidak ada kesenjangan mutu pendidikan antara sekolah perkotaan dan pelosok desa.</p>",
                foto=file_berita_1,
                status="Terbit",
                featured=True,
                created_by="admin",
            ),
            Berita(
                id=str(uuid.uuid4()),
                judul="Festival Seni Tari Lulo dan Musik Tradisional Tolaki Meriahkan Hari Pendidikan Daerah",
                slug="festival-seni-tari-lulo-tolaki",
                sumber="Bidang Kebudayaan",
                kategori="Kebudayaan",
                author="Humas Kebudayaan",
                deskripsi="Ratusan pelajar dari 25 kecamatan menampilkan tarian kolosal lulo dan musik bambu sebagai wujud pelestarian warisan budaya lokal.",
                isi="<p>Suasana meriah menyelimuti Alun-alun Andoolo saat 500 pelajar SD dan SMP menampilkan tarian kolosal Lulo Tolaki dalam rangka pembukaan Festival Seni dan Budaya Konawe Selatan 2026. Kegiatan ini bertujuan memperkuat rasa cinta generasi muda terhadap identitas kearifan lokal daerah.</p>",
                foto=file_berita_2,
                status="Terbit",
                featured=False,
                created_by="admin",
            ),
            Berita(
                id=str(uuid.uuid4()),
                judul="Lokakarya Peningkatan Kompetensi Guru Penggerak dan Komunitas Belajar Sekolah Angkatan 10",
                slug="lokakarya-guru-penggerak-kombel-angkatan-10",
                sumber="Bidang GTK",
                kategori="Pendidikan",
                author="Seksi Pendidik Dikdas",
                deskripsi="Fokus pendampingan diferensiasi metode ajar dan integrasi asesmen formatif dalam implementasi Kurikulum Merdeka.",
                isi="<p>Sebanyak 120 guru perwakilan dari Komunitas Belajar (Kombel) intra-sekolah mengikuti lokakarya intensif yang difasilitasi oleh Balai Guru Penggerak bekerja sama dengan Dinas Dikbud Konawe Selatan. Pendidik dibekali strategi coaching dan asesmen kelas yang berpusat pada murid.</p>",
                foto=file_berita_3,
                status="Terbit",
                featured=False,
                created_by="admin",
            ),
            Berita(
                id=str(uuid.uuid4()),
                judul="Tim Ahli Cagar Budaya Konsel Verifikasi Situs Sejarah Benteng Kolono dan Makam Kuno",
                slug="verifikasi-cagar-budaya-benteng-kolono",
                sumber="Bidang Kebudayaan",
                kategori="Kebudayaan",
                author="Tim Pelestari Budaya",
                deskripsi="Pencatatan resmi ke dalam Registrasi Nasional Cagar Budaya untuk perlindungan hukum dan destinasi edukasi sejarah.",
                isi="<p>Tim Ahli Cagar Budaya (TACB) Kabupaten Konawe Selatan melakukan ekskavasi dan survei lapangan di wilayah pesisir Kolono guna memverifikasi peninggalan benteng pertahanan tradisional dan makam leluhur untuk diajukan sebagai Cagar Budaya Peringkat Kabupaten.</p>",
                foto=file_berita_4,
                status="Terbit",
                featured=False,
                created_by="admin",
            ),
            Berita(
                id=str(uuid.uuid4()),
                judul="Gladi Bersih ANBK Jenjang SMP se-Konawe Selatan Berjalan Lancar dengan Kesiapan Jaringan 100%",
                slug="gladi-bersih-anbk-smp-konsel",
                sumber="Seksi Kurikulum & Penilaian",
                kategori="Prestasi",
                author="Tim Helpdesk ANBK",
                deskripsi="Monitoring terpadu memastikan server sekolah mandiri maupun menumpang beroperasi optimal tanpa kendala teknis.",
                isi="<p>Pelaksanaan gladi bersih ANBK tingkat SMP yang diikuti oleh 86 satuan pendidikan di Konawe Selatan berjalan sukses. Koordinasi bersama PLN dan penyedia jaringan internet menjamin suplai daya dan stabilitas bandwidth selama asesmen berlangsung.</p>",
                foto=file_berita_5,
                status="Terbit",
                featured=False,
                created_by="admin",
            ),
        ]
        session.add_all(berita_records)

        # --- SEED PENGUMUMAN ---
        pengumuman_records = [
            PengumumanPublish(
                id=str(uuid.uuid4()),
                nomor="420/892/DIKBUD/2026",
                judul="Pemberkasan Usulan Tunjangan Profesi Guru (TPG) dan Tunjangan Khusus Guru (TKG) Triwulan III",
                slug="pemberkasan-tpg-tkg-triwulan-3",
                kategori="Kepegawaian / GTK",
                ringkasan="Seluruh satuan pendidikan negeri dan swasta diwajibkan mengunggah SPTJM dan rekap absensi SIMPEG paling lambat 15 November 2026.",
                isi="Diinstruksikan kepada seluruh Kepala Satuan Pendidikan jenjang PAUD, SD, dan SMP se-Kabupaten Konawe Selatan agar segera menyelesaikan verifikasi berkas usulan TPG dan TKG Triwulan III dengan ketentuan melampirkan SKMT, presensi digital, dan pembagian beban jam mengajar.",
                tanggal="2026-11-01",
                target_audience="Guru ASN & Non-ASN Penerima Tunjangan",
                deadline="2026-11-15",
                lampiran=file_pengumuman_1,
                file=file_pengumuman_1,
                is_important=True,
                status="Aktif",
                created_by="admin",
            ),
            PengumumanPublish(
                id=str(uuid.uuid4()),
                nomor="421.2/740/DIKBUD/2026",
                judul="Jadwal Pelaksanaan Gladi Bersih dan Sinkronisasi ANBK Jenjang SD Gelombang 1 & 2",
                slug="jadwal-gladi-bersih-anbk-sd-2026",
                kategori="Akademik & ANBK",
                ringkasan="Informasi jadwal teknis sinkronisasi VHD, proktor, dan alur pelaksanaan asesmen nasional sekolah dasar.",
                isi="Menindaklanjuti edaran Pusat Asesmen Pendidikan Kemendikbudristek, disampaikan jadwal sinkronisasi server dan gladi bersih ANBK SD Gelombang 1 dan Gelombang 2 tahun ajaran 2026. Proktor wajib memverifikasi kesiapan laboratorium komputer sekolah.",
                tanggal="2026-10-25",
                target_audience="Proktor, Teknisi & Kepala Sekolah SD",
                deadline="2026-11-08",
                lampiran=file_pengumuman_2,
                file=file_pengumuman_2,
                is_important=True,
                status="Aktif",
                created_by="admin",
            ),
            PengumumanPublish(
                id=str(uuid.uuid4()),
                nomor="420/654/DIKBUD/2026",
                judul="Verifikasi Rekening dan Aktivasi Buku Tabungan Penerima Program Indonesia Pintar (PIP) Tahap II",
                slug="aktivasi-rekening-pip-tahap-2",
                kategori="Bantuan & Beasiswa",
                ringkasan="Daftar peserta didik penerima SK nominasi PIP untuk segera melakukan aktivasi rekening di bank penyalur terdekat.",
                isi="Daftar peserta didik jenjang SD dan SMP yang tercantum dalam lampiran SK Nominasi PIP Tahap II Tahun 2026 wajib melakukan aktivasi rekening di Bank BRI / BNI dengan didampingi kepala sekolah atau orang tua.",
                tanggal="2026-10-18",
                target_audience="Siswa Penerima PIP & Orang Tua Siswa",
                deadline="2026-11-30",
                lampiran=file_pengumuman_4,
                file=file_pengumuman_4,
                is_important=False,
                status="Aktif",
                created_by="admin",
            ),
            PengumumanPublish(
                id=str(uuid.uuid4()),
                nomor="425/512/DIKBUD/2026",
                judul="Pedoman Teknis Pemilihan Guru, Kepala Sekolah, dan Pengawas Sekolah Berprestasi Tingkat Kabupaten",
                slug="pedoman-guru-kepsek-berprestasi-2026",
                kategori="Apresiasi & GTK",
                ringkasan="Peluang pengusulan portofolio dan video praktik baik inovasi pembelajaran untuk seleksi apresiasi GTK berprestasi.",
                isi="Dinas Pendidikan dan Kebudayaan membuka pendaftaran seleksi Pendidik dan Tenaga Kependidikan Berprestasi Tahun 2026. Berkas portofolio inovasi pembelajaran dapat diajukan secara daring melalui tautan resmi.",
                tanggal="2026-10-10",
                target_audience="Guru, Kepala Sekolah, dan Pengawas se-Konsel",
                deadline="2026-11-20",
                lampiran=file_pengumuman_5,
                file=file_pengumuman_5,
                is_important=False,
                status="Aktif",
                created_by="admin",
            ),
        ]
        session.add_all(pengumuman_records)

        # --- SEED BANNER ---
        banner_records = [
            BannerSlide(
                id=str(uuid.uuid4()),
                title="Transformasi Digital Pendidikan Konawe Selatan",
                subtitle="Mewujudkan ekosistem belajar yang setara, modern, dan inklusif di seluruh satuan pendidikan Bumi Konawe Selatan.",
                badge_text="Portal Resmi Dikbud Konsel",
                primary_button_label="Jelajahi Layanan",
                primary_button_link="/layanan-publik",
                image=file_banner_1,
                order_num="1",
                status="Aktif",
                created_by="admin",
            ),
            BannerSlide(
                id=str(uuid.uuid4()),
                title="Lestarikan Seni & Budaya Warisan Leluhur Tolaki",
                subtitle="Membangun karakter generasi muda yang berakar kuat pada nilai-nilai kearifan lokal dan adat istiadat daerah.",
                badge_text="Pelestarian Budaya Daerah",
                primary_button_label="Eksplorasi Budaya",
                primary_button_link="/kebudayaan",
                image=file_banner_2,
                order_num="2",
                status="Aktif",
                created_by="admin",
            ),
            BannerSlide(
                id=str(uuid.uuid4()),
                title="Kolaborasi Guru Penggerak & Komunitas Belajar",
                subtitle="Mendorong guru terus berinovasi, berbagi praktik baik, dan menghadirkan pembelajaran yang berpusat pada murid.",
                badge_text="Merdeka Belajar",
                primary_button_label="Warta Pendidikan",
                primary_button_link="/pendidikan",
                image=file_banner_3,
                order_num="3",
                status="Aktif",
                created_by="admin",
            ),
        ]
        session.add_all(banner_records)

        # --- SEED PENDIDIKAN ---
        pendidikan_records = [
            PendidikanProgram(
                id=str(uuid.uuid4()),
                judul="Penerapan Pembelajaran Terdiferensiasi pada Kurikulum Merdeka",
                name="Penerapan Pembelajaran Terdiferensiasi pada Kurikulum Merdeka",
                kategori="Kurikulum Merdeka",
                category="Kurikulum Merdeka",
                penulis="Bidang Pembinaan Ketenagaan",
                konten="Pembelajaran berdiferensiasi dirancang untuk mengakomodasi keberagaman kesiapan belajar, minat, dan profil belajar murid. Guru di Konawe Selatan menerapkan asesmen diagnostik di awal semester untuk memetakan kebutuhan siswa.",
                file=file_edu_1,
                status="Terbit",
                created_by="admin",
            ),
            PendidikanProgram(
                id=str(uuid.uuid4()),
                judul="Panduan Gerakan Literasi Sekolah dan Pojok Baca Kreatif",
                name="Panduan Gerakan Literasi Sekolah dan Pojok Baca Kreatif",
                kategori="Literasi & Numerasi",
                category="Literasi & Numerasi",
                penulis="Pokja Literasi Daerah",
                konten="Membangun kebiasaan membaca 15 menit sebelum pembelajaran dimulai dengan menghadirkan buku-buku bacaan bermutu ramah anak di setiap sudut ruang kelas satuan pendidikan dasar.",
                file=file_edu_2,
                status="Terbit",
                created_by="admin",
            ),
            PendidikanProgram(
                id=str(uuid.uuid4()),
                judul="Praktik Baik Penguatan Profil Pelajar Pancasila (P5) Gaya Hidup Berkelanjutan",
                name="Praktik Baik Penguatan Profil Pelajar Pancasila (P5)",
                kategori="Projek P5",
                category="Projek P5",
                penulis="Fasilitator Sekolah Penggerak",
                konten="Peserta didik diajak mengolah limbah organik di lingkungan sekolah menjadi pupuk kompos dan menanam tanaman obat keluarga (TOGA) sebagai wujud kepedulian lingkungan.",
                file=file_edu_3,
                status="Terbit",
                created_by="admin",
            ),
            PendidikanProgram(
                id=str(uuid.uuid4()),
                judul="Optimalisasi Pemanfaatan Akun Belajar.id dan Chromebook Sekolah",
                name="Pemanfaatan Akun Belajar.id",
                kategori="Teknologi Pendidikan",
                category="Teknologi Pendidikan",
                penulis="Kapten Belajar.id Konsel",
                konten="Tutorial dan tips praktis bagi pendidik untuk membuat kuis interaktif, rubrik asesmen daring di Google Classroom, dan integrasi Canva for Education dalam presentasi kelas.",
                file=file_edu_4,
                status="Terbit",
                created_by="admin",
            ),
        ]
        session.add_all(pendidikan_records)

        # --- SEED KEBUDAYAAN ---
        kebudayaan_records = [
            KebudayaanItem(
                id=str(uuid.uuid4()),
                nama="Tarian Lulo Tradisional Tolaki",
                name="Tarian Lulo Tradisional Tolaki",
                kategori="Seni Pertunjukan / Warisan Budaya Takbenda",
                type="Warisan Budaya Takbenda",
                lokasi="Kecamatan Andoolo, Konawe Selatan",
                location="Kecamatan Andoolo, Konawe Selatan",
                deskripsi="Tarian pergaulan tradisional masyarakat suku Tolaki yang melambangkan semangat persaudaraan, kebersamaan, gotong royong, dan rasa syukur atas panen melimpah.",
                description="Tarian pergaulan tradisional masyarakat suku Tolaki yang melambangkan persaudaraan dan gotong royong.",
                foto=file_budaya_1,
                status="Terverifikasi",
                created_by="admin",
            ),
            KebudayaanItem(
                id=str(uuid.uuid4()),
                nama="Situs Sejarah Benteng Pesisir Kolono",
                name="Situs Sejarah Benteng Pesisir Kolono",
                kategori="Cagar Budaya Kebendaan",
                type="Cagar Budaya",
                lokasi="Kecamatan Kolono, Konawe Selatan",
                location="Kecamatan Kolono, Konawe Selatan",
                deskripsi="Peninggalan benteng pertahanan batu alam masa kerajaan masa lampau yang menjadi saksi sejarah jalur perdagangan maritim di pesisir Selat Tiworo dan Teluk Kolono.",
                description="Benteng pertahanan batu alam peninggalan masa kerajaan maritim tradisional.",
                foto=file_budaya_2,
                status="Terverifikasi",
                created_by="admin",
            ),
            KebudayaanItem(
                id=str(uuid.uuid4()),
                nama="Kerajinan Kain Tenun Motif Khas Tolaki & Moronene",
                name="Kerajinan Kain Tenun Khas",
                kategori="Keterampilan & Kemahiran Tradisional",
                type="Kearifan Lokal",
                lokasi="Kecamatan Lainea & Laeya",
                location="Kecamatan Lainea & Laeya",
                deskripsi="Kain tenun tradisional bermotif ornamen pucuk rebung dan sulur flora lokal yang diwariskan secara turun-temurun oleh para pengrajin wanita di pedesaan.",
                description="Kain tenun tangan dengan motif etnik khas suku lokal Konawe Selatan.",
                foto=file_budaya_3,
                status="Terverifikasi",
                created_by="admin",
            ),
            KebudayaanItem(
                id=str(uuid.uuid4()),
                nama="Alat Musik Bambu 'Dimba-Dimba' & Ore-Ore Nggae",
                name="Alat Musik Bambu Tradisional",
                kategori="Tradisi Musik & Lisan",
                type="Seni Musik",
                lokasi="Kecamatan Buke & Angata",
                location="Kecamatan Buke & Angata",
                deskripsi="Instrumen musik perkusi dan tiup berbahan bambu hutan yang dimainkan secara ansambel dalam upacara adat Mosehe Wonua dan penyambutan tamu kehormatan.",
                description="Instrumen musik perkusi dan tiup bambu tradisional.",
                foto=file_budaya_4,
                status="Terverifikasi",
                created_by="admin",
            ),
        ]
        session.add_all(kebudayaan_records)

        # --- SEED LAYANAN PUBLIK ---
        layanan_records = [
            LayananPublik(
                id=str(uuid.uuid4()),
                nama_layanan="Legalisir Ijazah & Piagam Satuan Pendidikan",
                kategori="Pelayanan Administrasi Sekolah",
                deskripsi="Layanan pengesahan fotokopi ijazah, SKHUN, dan sertifikat pendidikan bagi lulusan SD dan SMP di Kabupaten Konawe Selatan.",
                syarat="1. Membawa ijazah asli\n2. Fotokopi ijazah maksimal 5 lembar\n3. Surat pengantar dari sekolah asal bila diperlukan",
                prosedur="Pemohon menyerahkan berkas ke loket PTSP -> Verifikasi keaslian dokumen oleh staf teknis -> Penandatanganan pejabat berwenang -> Cap stempel dinas -> Dokumen diserahkan kembali.",
                penanggung_jawab="Subbag Umum dan Kepegawaian",
                waktu_layanan="1 Hari Kerja (Maksimal 60 Menit)",
                biaya="Gratis (Tanpa Biaya)",
                kontak="0812-4567-8901 (PTSP Dikbud)",
                status="Aktif",
                created_by="admin",
            ),
            LayananPublik(
                id=str(uuid.uuid4()),
                nama_layanan="Rekomendasi Mutasi & Pindah Sekolah Siswa",
                kategori="Kesiswaan",
                deskripsi="Penerbitan surat rekomendasi kepindahan peserta didik antar kabupaten, antar provinsi, atau dalam wilayah Konawe Selatan.",
                syarat="1. Surat permohonan orang tua\n2. Surat keterangan pindah dari sekolah asal\n3. Surat kesediaan menerima dari sekolah tujuan\n4. Fotokopi rapor terakhir",
                prosedur="Pengajuan berkas melalui loket kesiswaan -> Pengecekan data NISN pada Dapodik -> Penerbitan surat rekomendasi mutasi resmi.",
                penanggung_jawab="Bidang Pembinaan Pendidikan Dasar",
                waktu_layanan="1 Hari Kerja",
                biaya="Gratis (Tanpa Biaya)",
                kontak="0813-8899-7711",
                status="Aktif",
                created_by="admin",
            ),
            LayananPublik(
                id=str(uuid.uuid4()),
                nama_layanan="Penerbitan Rekomendasi Izin Operasional Satuan Pendidikan PAUD/TK",
                kategori="Kelembagaan & Sarpras",
                deskripsi="Layanan verifikasi kelayakan teknis dan administratif pendirian satuan PAUD, KB, dan TK baru di wilayah Konawe Selatan.",
                syarat="1. Akta notaris pendirian yayasan\n2. Proposal pendirian sekolah\n3. Bukti kepemilikan/penguasaan lahan dan gedung\n4. Data daftar calon pendidik dan siswa",
                prosedur="Pengajuan proposal -> Verifikasi berkas administrasi -> Visitasi lapangan oleh tim verifikator -> Rekomendasi teknis diterbitkan.",
                penanggung_jawab="Bidang Pembinaan PAUD dan PNF",
                waktu_layanan="5 Hari Kerja",
                biaya="Gratis (Tanpa Biaya)",
                kontak="0852-1122-3344",
                status="Aktif",
                created_by="admin",
            ),
            LayananPublik(
                id=str(uuid.uuid4()),
                nama_layanan="Pengaduan & Konsultasi Dana Bantuan Operasional Satuan Pendidikan (BOSP)",
                kategori="Pengelolaan Keuangan & BOSP",
                deskripsi="Layanan asistensi pembukuan ARKAS, rekonsiliasi SPJ, serta pelaporan keluhan transparansi dana BOS satuan pendidikan.",
                syarat="1. Identitas pelapor/konsultasi\n2. Buku Kas Umum (BKU) dan bukti belanja terkait bila konsultasi teknis",
                prosedur="Konsultasi langsung di meja helpdesk BOSP atau melalui pengaduan daring WhatsApp resmi tim manajer BOS kabupaten.",
                penanggung_jawab="Tim Manajer BOSP Kabupaten",
                waktu_layanan="Hari Kerja (08.00 - 15.30 WITA)",
                biaya="Gratis (Tanpa Biaya)",
                kontak="0821-9988-7766",
                status="Aktif",
                created_by="admin",
            ),
        ]
        session.add_all(layanan_records)

        # --- SEED STATISTIK ---
        statistik_records = [
            StatistikItem(
                id=str(uuid.uuid4()),
                indikator="Angka Partisipasi Murni (APM) Jenjang SD",
                indicator="Angka Partisipasi Murni (APM) Jenjang SD",
                kategori="Akses Pendidikan",
                category="Akses Pendidikan",
                nilai="98.74",
                value="98.74",
                satuan="%",
                unit="%",
                tahun="2026",
                period="2026",
                trend="Meningkat",
                keterangan="Capaian partisipasi bersekolah usia 7-12 tahun di Konawe Selatan berbasis integrasi data Dapodik & Dukcapil.",
                created_by="admin",
            ),
            StatistikItem(
                id=str(uuid.uuid4()),
                indikator="Angka Partisipasi Murni (APM) Jenjang SMP",
                indicator="Angka Partisipasi Murni (APM) Jenjang SMP",
                kategori="Akses Pendidikan",
                category="Akses Pendidikan",
                nilai="92.15",
                value="92.15",
                satuan="%",
                unit="%",
                tahun="2026",
                period="2026",
                trend="Meningkat",
                keterangan="Capaian partisipasi bersekolah usia 13-15 tahun, naik 2.3% dibanding tahun ajaran sebelumnya.",
                created_by="admin",
            ),
            StatistikItem(
                id=str(uuid.uuid4()),
                indikator="Rasio Guru Bersertifikasi Pendidik",
                indicator="Rasio Guru Bersertifikasi Pendidik",
                kategori="Kualitas Pendidik (GTK)",
                category="Kualitas Pendidik (GTK)",
                nilai="76.80",
                value="76.80",
                satuan="%",
                unit="%",
                tahun="2026",
                period="2026",
                trend="Meningkat",
                keterangan="Persentase guru ASN dan Non-ASN yang telah lulus PPG dan memiliki Sertifikat Pendidik resmi.",
                created_by="admin",
            ),
            StatistikItem(
                id=str(uuid.uuid4()),
                indikator="Sekolah Terkoneksi Internet & Digitalisasi Kelas",
                indicator="Sekolah Terkoneksi Internet & Digitalisasi Kelas",
                kategori="Sarana & Prasarana",
                category="Sarana & Prasarana",
                nilai="94.50",
                value="94.50",
                satuan="%",
                unit="%",
                tahun="2026",
                period="2026",
                trend="Meningkat",
                keterangan="Satuan pendidikan yang telah memiliki perangkat TIK (Chromebook/PC) dan akses jaringan internet stabil.",
                created_by="admin",
            ),
            StatistikItem(
                id=str(uuid.uuid4()),
                indikator="Total Satuan Pendidikan Dasar (SD & SMP)",
                indicator="Total Satuan Pendidikan Dasar",
                kategori="Institusi Sekolah",
                category="Institusi Sekolah",
                nilai="368",
                value="368",
                satuan="Sekolah",
                unit="Sekolah",
                tahun="2026",
                period="2026",
                trend="Stabil",
                keterangan="Terdiri atas 282 Sekolah Dasar (SD) dan 86 Sekolah Menengah Pertama (SMP) se-Kabupaten Konawe Selatan.",
                created_by="admin",
            ),
        ]
        session.add_all(statistik_records)

        # --- SEED PROFIL SECTION ---
        profil_records = [
            ProfilSection(
                id=str(uuid.uuid4()),
                judul="Maklumat Standar Pelayanan Publik",
                title="Maklumat Standar Pelayanan Publik",
                kategori="Standar Integritas & Pelayanan",
                category="Standar Integritas",
                konten="Dengan ini kami seluruh pimpinan dan pegawai Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan menyatakan sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai ketentuan perundang-undangan.",
                content="Maklumat pelayanan prima Dinas Pendidikan dan Kebudayaan Konawe Selatan.",
                file=file_profil_2,
                urutan="1",
                status="Aktif",
                created_by="admin",
            ),
            ProfilSection(
                id=str(uuid.uuid4()),
                judul="Struktur Organisasi dan Tata Kerja Dinas Dikbud",
                title="Struktur Organisasi dan Tata Kerja Dinas Dikbud",
                kategori="Kelembagaan",
                category="Kelembagaan",
                konten="Susunan bagan organisasi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan dipimpin oleh Kepala Dinas, dibantu oleh Sekretariat, Bidang Pembinaan PAUD dan PNF, Bidang Pembinaan Dikdas, Bidang Pembinaan GTK, serta Bidang Kebudayaan.",
                content="Susunan bagan organisasi resmi Dinas Pendidikan dan Kebudayaan.",
                file=file_profil_1,
                urutan="2",
                status="Aktif",
                created_by="admin",
            ),
            ProfilSection(
                id=str(uuid.uuid4()),
                judul="Visi, Misi, dan Nilai Strategis Daerah",
                title="Visi, Misi, dan Nilai Strategis Daerah",
                kategori="Visi Misi",
                category="Visi Misi",
                konten="Visi: Terwujudnya Layanan Pendidikan Konawe Selatan yang Setara, Unggul, Berkarakter, dan Berdaya Saing Global Berlandaskan Nilai Budaya Luhur. Misi meliputi pemerataan akses, peningkatan kompetensi guru, dan pelestarian budaya lokal.",
                content="Visi dan Misi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan.",
                file=file_profil_3,
                urutan="3",
                status="Aktif",
                created_by="admin",
            ),
        ]
        session.add_all(profil_records)

        # --- SEED PESAN KONTAK ---
        kontak_records = [
            PesanKontak(
                id=str(uuid.uuid4()),
                nama="Ahmad Fauzan Pratama",
                email="fauzan.pratama@gmail.com",
                phone="081244556677",
                telepon="081244556677",
                subjek="Permohonan Informasi Jadwal Pencairan Beasiswa PIP",
                kategori="Pertanyaan Umum",
                pesan="Selamat siang admin Dikbud Konsel. Mohon informasi terkait jadwal aktivasi rekening dan pencairan dana bantuan Program Indonesia Pintar untuk jenjang SMP di Kecamatan Ranomeeto. Terima kasih.",
                tanggapan="Halo Bapak Ahmad Fauzan, saat ini aktivasi rekening PIP Tahap II sedang dibuka hingga 30 November 2026 di bank penyalur BRI terdekat dengan membawa surat rekomendasi dari kepala sekolah.",
                status="Sudah Dibalas",
                created_by="public",
            ),
            PesanKontak(
                id=str(uuid.uuid4()),
                nama="Siti Nurhaliza, S.Pd",
                email="siti.nurhaliza@guru.sd.belajar.id",
                phone="085299881122",
                telepon="085299881122",
                subjek="Konsultasi Kendala Sinkronisasi Server ANBK SD",
                kategori="Bantuan Teknis",
                pesan="Mohon arahan dari tim helpdesk IT Dikbud, saat gladi bersih tadi pagi server sekolah kami mengalami kendala status offline pada aplikasi proktor browser. Kami mohon bantuan panduan penanganannya.",
                tanggapan="Terima kasih Bu Siti, tim teknis helpdesk IT telah menghubungi proktor sekolah via WhatsApp untuk melakukan reset virtual machine (VHD). Masalah telah berhasil diselesaikan.",
                status="Sudah Dibalas",
                created_by="public",
            ),
            PesanKontak(
                id=str(uuid.uuid4()),
                nama="H. Syamsuddin",
                email="syamsuddin.tokoh@yahoo.com",
                phone="081377889900",
                telepon="081377889900",
                subjek="Usulan Pelestarian Rumah Adat Tradisional di Moramo",
                kategori="Aspirasi Kebudayaan",
                pesan="Kami atas nama tokoh masyarakat mengusulkan agar situs rumah adat dan makam tua di Desa Moramo Jaya dapat dilakukan peninjauan oleh Tim Ahli Cagar Budaya untuk didaftarkan sebagai cagar budaya daerah.",
                tanggapan="",
                status="Baru",
                created_by="public",
            ),
        ]
        session.add_all(kontak_records)

        await session.commit()
        print("Successfully seeded all 9 publish modules with realistic files and complete datasets!")


if __name__ == "__main__":
    asyncio.run(seed_publish())
