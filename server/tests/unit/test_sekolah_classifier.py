"""Unit tests for school categorization heuristics and kecamatan extraction."""

import pytest

from app.utils.school_classifier import classify_school, extract_kecamatan


@pytest.mark.parametrize(
    ("raw_name", "expected_jenjang", "expected_status"),
    [
        ("SDN 1 KONDA", "SD", "NEGERI"),
        ("SD NEGERI 4 RANOMEETO", "SD", "NEGERI"),
        ("SD ISLAM TERPADU INSANUL FAIZ (SWASTA)", "SD", "SWASTA"),
        ("SMPN 1 KONAWE SELATAN", "SMP", "NEGERI"),
        ("SMP NEGERI 22 KONAWE SELATAN", "SMP", "NEGERI"),
        ("SMP ISLAM TERPADU (SWASTA)", "SMP", "SWASTA"),
        ("TK HARAPAN BUNDA (SWASTA)", "TK", "SWASTA"),
        ("TKN PEMBINA RANOMEETO", "TK", "NEGERI"),
        ("PAUD AR-RAHMAN", "PAUD", "SWASTA"),
        ("SKB TINANGGEA", "PKBM", "NEGERI"),
        ("SKB MORAMO", "PKBM", "NEGERI"),
        ("SD-SMPN SATAP 2 KONSEL", "SATAP", "NEGERI"),
        ("SDN SATAP 14 KONSEL", "SD", "NEGERI"),
        ("SMPN SATAP 14 KONSEL", "SMP", "NEGERI"),
        ("DHARMA WANITA", "TK", "SWASTA"),
        ("MEKAR JAYA", "TK", "SWASTA"),
        ("TUNAS HARAPAN", "TK", "SWASTA"),
        ("KORWIL KEC.ANGATA", None, "STRUKTURAL"),
        ("DINAS PENDIDIKAN DAN KEBUDAYAAN", None, "STRUKTURAL"),
    ],
)
def test_classify_school(
    raw_name: str,
    expected_jenjang: str | None,
    expected_status: str,
) -> None:
    """Ensure all school name variants are accurately classified."""
    jenjang, status = classify_school(raw_name)
    assert jenjang == expected_jenjang
    assert status == expected_status


@pytest.mark.parametrize(
    ("name", "alamat", "expected_kec"),
    [
        ("SD NEGERI 1 RANOMEETO", "Jl. Poros Bandara Haluoleo", "Ranomeeto"),
        ("PAUD AR-RAHMAN", "Kec. Konda", "Konda"),
        ("TK NUR ANNISA (SWASTA)", "KEC. LAONTI", "Laonti"),
        (
            "SD-SMPN SATAP 2 KONSEL",
            "Jl. Poros Desa Sindangkasih, Kec. Ranomeeto Barat",
            "Ranomeeto Barat",
        ),
        ("SMPN 22 KONAWE SELATAN", "Jl. Pendidikan Buke", "Buke"),
        ("SD NEGERI 11 ANDOOLO", "Blok E", "Andoolo"),
    ],
)
def test_extract_kecamatan(name: str, alamat: str, expected_kec: str) -> None:
    """Ensure subdistrict is properly extracted from name and address."""
    kec = extract_kecamatan(name, alamat)
    assert kec == expected_kec
