"""Operational models package exporting all entities outside Data Master."""

from app.models.operational.sarpras import (
    SarprasTanah,
    SarprasBangunan,
    SarprasRuang,
    SarprasPeralatan,
)
from app.models.operational.usulan import (
    UsulanTunjanganGuru,
    UsulanPipPendukung,
    UsulanPipPenerima,
    UsulanAssessment,
    UsulanRekonsiliasiBosp,
)
from app.models.operational.rombel import (
    RombelPaud,
    RombelSd,
    RombelSmp,
)
from app.models.operational.kegiatan import (
    KegiatanSekolah,
    KomunitasBelajar,
    PiagamSertifikat,
)
from app.models.operational.jurnal import (
    JurnalGuruKelas,
    JurnalKepalaSekolah,
    JurnalPengawas,
    JurnalBk,
)
from app.models.operational.gallery import (
    GallerySekolahPenggerak,
    GalleryGuruPenggerak,
    GalleryOrganisasiPenggerak,
    GalleryKegiatanKepalaSekolah,
    GalleryKegiatanKkgSd,
    GalleryKegiatanGuruMgmp,
    GalleryKegiatanTkPaud,
    GalleryKegiatanPengawas,
    GalleryVideoTestimoni,
)
from app.models.operational.verifikasi import (
    VerifikasiTunjanganGuru,
    VerifikasiRekonsiliasiBosp,
)
from app.models.operational.regulasi_gtk import (
    GtkPengumuman,
    GtkModulPelatihan,
    GtkRegulasi,
)
from app.models.operational.ppdb import (
    PpdbPaud,
    PpdbSd,
    PpdbSmp,
    KuotaPpdb,
)
from app.models.operational.profile import (
    ProfileRenstra,
    ProfileTugasFungsi,
    ProfileVisiMisi,
)
from app.models.operational.berita import (
    Berita,
    PengumumanPublish,
    LayananPublik,
    PesanKontak,
    BannerSlide,
    KebudayaanItem,
    PendidikanProgram,
    ProfilSection,
    StatistikItem,
)

__all__ = [
    # Sarpras
    "SarprasTanah",
    "SarprasBangunan",
    "SarprasRuang",
    "SarprasPeralatan",
    # Usulan
    "UsulanTunjanganGuru",
    "UsulanPipPendukung",
    "UsulanPipPenerima",
    "UsulanAssessment",
    "UsulanRekonsiliasiBosp",
    # Rombel
    "RombelPaud",
    "RombelSd",
    "RombelSmp",
    # Kegiatan
    "KegiatanSekolah",
    "KomunitasBelajar",
    "PiagamSertifikat",
    # Jurnal
    "JurnalGuruKelas",
    "JurnalKepalaSekolah",
    "JurnalPengawas",
    "JurnalBk",
    # Gallery
    "GallerySekolahPenggerak",
    "GalleryGuruPenggerak",
    "GalleryOrganisasiPenggerak",
    "GalleryKegiatanKepalaSekolah",
    "GalleryKegiatanKkgSd",
    "GalleryKegiatanGuruMgmp",
    "GalleryKegiatanTkPaud",
    "GalleryKegiatanPengawas",
    "GalleryVideoTestimoni",
    # Verifikasi
    "VerifikasiTunjanganGuru",
    "VerifikasiRekonsiliasiBosp",
    # Regulasi GTK
    "GtkPengumuman",
    "GtkModulPelatihan",
    "GtkRegulasi",
    # PPDB
    "PpdbPaud",
    "PpdbSd",
    "PpdbSmp",
    "KuotaPpdb",
    # Profile
    "ProfileRenstra",
    "ProfileTugasFungsi",
    "ProfileVisiMisi",
    # Berita & Publish
    "Berita",
    "PengumumanPublish",
    "LayananPublik",
    "PesanKontak",
    "BannerSlide",
    "KebudayaanItem",
    "PendidikanProgram",
    "ProfilSection",
    "StatistikItem",
]
