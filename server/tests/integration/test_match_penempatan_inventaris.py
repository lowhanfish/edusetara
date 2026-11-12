"""Matching free-text asset descriptions to school UPBs (no database needed)."""

from scripts.match_penempatan_inventaris import build_index, match_text

INDEX = build_index(
    [
        ("upb-a", "SDN 2 PALANGGA"),
        ("upb-b", "SDN 3 PALANGGA"),
        ("upb-b", "SDN 2 PALANGGA"),  # nama lama UPB lain
        ("upb-c", "SDN 12 KONDA"),
        ("upb-c", "SDN POMBULAA JAYA"),
        ("upb-d", "SDN 1 KONDA"),
        ("upb-e", "SMPN SATAP 16 KONAWE SELATAN"),
        ("upb-f", "TK"),  # terlalu pendek, diabaikan
    ]
)


def test_match_unique_school_in_free_text():
    assert match_text("Meja Siswa (SDN 12 konda) · Asal-usul: Pembelian", INDEX) == (
        "cocok",
        "upb-c",
    )
    assert match_text("Plts Sedang-SMPN SATU ATAP 16 KONSEL", INDEX) == ("cocok", "upb-e")
    # nomor sekolah tidak boleh cocok sebagian: SDN 1 KONDA bukan SDN 12 KONDA
    assert match_text("Kursi SD Negeri 1 Konda", INDEX) == ("cocok", "upb-d")
    # nama baru dan nama lama UPB yang sama muncul bersama
    assert match_text("Mobiler SDN 12 Konda ( SDN Pombulaa Jaya )", INDEX) == ("cocok", "upb-c")


def test_match_leaves_uncertain_text_unassigned():
    assert match_text("Kursi Siswa (SDN 2 PALANGGA)", INDEX) == ("ambigu", None)
    assert match_text("SDN 12 Konda dan SDN 1 Konda", INDEX) == ("ambigu", None)
    assert match_text("Mobiler TK Anak Ceria", INDEX) == ("tak_dikenal", None)
    assert match_text("Tali Pramuka · Asal-usul: SDN 12 KONDA", INDEX) == ("tanpa_sekolah", None)
    assert match_text(None, INDEX) == ("tanpa_sekolah", None)
