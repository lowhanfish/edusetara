"""Master data models package."""

from app.models.master.aset import (
    MasterAsetAlasanPenghapusan,
    MasterAsetKapitalisasiMasaManfaat,
    MasterAsetKodeBarang,
    MasterAsetKondisiBarang,
    MasterAsetMasaManfaat,
    MasterAsetMetodePenyusutan,
    MasterAsetNilaiMinimumKapitalisasi,
    MasterAsetStatusPemilik,
    MasterAsetUnit,
)
from app.models.master.auth_rbac import AuthGroup, AuthGroupPermission, AuthMenu
from app.models.master.base_master import MasterBaseMixin
from app.models.master.jenjang import MasterJenjang
from app.models.master.jurnal import (
    MasterJurnalBahanAjar,
    MasterJurnalKelas,
    MasterJurnalMataPelajaran,
    MasterJurnalMateriAjar,
)
from app.models.master.pelengkap import (
    MasterBkJenisLayanan,
    MasterBkKegiatanLayanan,
    MasterKategori,
    MasterModelPembelajaran,
    MasterPendampingan,
    MasterTugas,
)
from app.models.master.ppdb import (
    MasterPpdbAgama,
    MasterPpdbPekerjaan,
    MasterPpdbPendidikan,
    MasterPpdbPenghasilan,
    MasterPpdbTempatTinggal,
    MasterPpdbTransportasi,
)
from app.models.master.sarpras import (
    MasterSarprasBangunan,
    MasterSarprasJenisBantuan,
    MasterSarprasKepemilikan,
    MasterSarprasKondisiAlat,
    MasterSarprasSumberDana,
)
from app.models.master.sekolah import MasterSekolah
from app.models.master.siswa import MasterSiswa
from app.models.master.usulan import (
    MasterUsulanJenisPenerima,
    MasterUsulanKelasPenerima,
    MasterUsulanTriwulan,
)

__all__ = [
    "MasterBaseMixin",
    "MasterSekolah",
    # Usulan
    "MasterUsulanTriwulan",
    "MasterUsulanJenisPenerima",
    "MasterUsulanKelasPenerima",
    # Jurnal
    "MasterJurnalBahanAjar",
    "MasterJurnalMateriAjar",
    "MasterJurnalKelas",
    "MasterJurnalMataPelajaran",
    # Jenjang
    "MasterJenjang",
    # PPDB
    "MasterPpdbAgama",
    "MasterPpdbTempatTinggal",
    "MasterPpdbTransportasi",
    "MasterPpdbPendidikan",
    "MasterPpdbPekerjaan",
    "MasterPpdbPenghasilan",
    # Sarpras
    "MasterSarprasBangunan",
    "MasterSarprasKepemilikan",
    "MasterSarprasSumberDana",
    "MasterSarprasKondisiAlat",
    "MasterSarprasJenisBantuan",
    # Aset
    "MasterAsetAlasanPenghapusan",
    "MasterAsetNilaiMinimumKapitalisasi",
    "MasterAsetUnit",
    "MasterAsetKodeBarang",
    "MasterAsetMetodePenyusutan",
    "MasterAsetMasaManfaat",
    "MasterAsetKapitalisasiMasaManfaat",
    "MasterAsetKondisiBarang",
    "MasterAsetStatusPemilik",
    # Pelengkap
    "MasterBkJenisLayanan",
    "MasterBkKegiatanLayanan",
    "MasterModelPembelajaran",
    "MasterPendampingan",
    "MasterTugas",
    "MasterKategori",
    # Siswa
    "MasterSiswa",
    # Auth RBAC
    "AuthMenu",
    "AuthGroup",
    "AuthGroupPermission",
]
