"""Mapping of SIMDA KIB rows into inventory items (no database or SQL Server needed)."""

from datetime import date, datetime
from decimal import Decimal

from scripts.import_simda_inventaris import LOKASI_KOSONG, map_all, map_row

UNITS = {(1, 1): "upb-dinas"}
CODES = {"01.03.02.06.03.47.05": "PLTS", "01.03.01.01.01.04.01": "Tanah Bangunan Pendidikan"}
CONDITIONS = {1, 2, 3}


def row(**changes):
    base = {
        "IDPemda": "0801001001001",
        "Kd_Sub": 1,
        "Kd_UPB": 1,
        "Kd_Aset8": 1,
        "Kd_Aset80": 3,
        "Kd_Aset81": 2,
        "Kd_Aset82": 6,
        "Kd_Aset83": 3,
        "Kd_Aset84": 47,
        "Kd_Aset85": 5,
        "No_Reg8": 12,
        "Tgl_Perolehan": datetime(2021, 6, 23),
        "Harga": Decimal("7250000.4252"),
        "Asal_usul": "BOS/JKN",
        "Keterangan": "Plts  Sedang-SMPN SATAP 16",
        "Kd_Hapus": False,
        "kondisi": "3",
        "merk": "Merk",
        "tipe": "X1",
        "seri": None,
    }
    return {**base, **changes}


def test_map_row_builds_inventory_item():
    item, reason = map_row("B", row(), UNITS, CODES, CONDITIONS)
    assert reason is None
    assert item == {
        "simda_id": "0801001001001",
        "kib": "B",
        "upb_id": "upb-dinas",
        "kode_barang": "01.03.02.06.03.47.05",
        "nomor_register": "000012",
        "nama": "PLTS",
        "merk": "Merk X1",
        "nomor_seri": None,
        "tahun_perolehan": 2021,
        "tanggal_perolehan": date(2021, 6, 23),
        "nilai_perolehan": Decimal("7250000.43"),
        "lokasi": LOKASI_KOSONG,
        "kondisi_kode": 3,
        "keterangan": "Plts Sedang-SMPN SATAP 16 · Asal-usul: BOS/JKN",
    }


def test_map_row_land_has_default_condition_and_address():
    land = row(Kd_Aset81=1, Kd_Aset82=1, Kd_Aset83=1, Kd_Aset84=4, Kd_Aset85=1, lokasi="Jl. Poros")
    del land["kondisi"]
    item, _ = map_row("A", land, UNITS, CODES, CONDITIONS)
    assert item["kondisi_kode"] == 1 and item["lokasi"] == "Jl. Poros" and item["kib"] == "A"


def test_map_row_rejections():
    cases = {
        "ditandai hapus di SIMDA": {"Kd_Hapus": True},
        "kode barang Permendagri 108 kosong": {"Kd_Aset85": None},
        "kode barang tidak ada di Master Aset": {"Kd_Aset85": 99},
        "UPB tidak ada di Referensi Unit & UPB SIMDA": {"Kd_UPB": 9},
        "nomor register kosong": {"No_Reg8": None},
        "kondisi tidak dikenal": {"kondisi": "9"},
        "nilai perolehan negatif": {"Harga": Decimal("-1")},
    }
    for expected, changes in cases.items():
        assert map_row("B", row(**changes), UNITS, CODES, CONDITIONS) == (None, expected)
    assert (
        map_row("C", row(), UNITS, CODES, CONDITIONS)[1] == "kode barang tidak sesuai kelompok KIB"
    )


def test_map_all_accepts_a_register_once():
    source = {"B": [row(), row(IDPemda="0801001001002"), row(IDPemda="0801001001003", No_Reg8=13)]}
    items, rejects = map_all(source, UNITS, CODES, CONDITIONS)
    assert [item["simda_id"] for item in items] == ["0801001001001", "0801001001003"]
    assert [reject["IDPemda"] for reject in rejects] == ["0801001001002"]
