"""School classification and subdistrict extraction heuristics."""

import re

KECAMATAN_LIST = [
    "ANDOOLO BARAT",
    "ANDOOLO",
    "ANGATA",
    "BAITO",
    "BASALA",
    "BENUA",
    "BUKE",
    "KOLONO TIMUR",
    "KOLONO",
    "KONDA",
    "LAEYA",
    "LAINEA",
    "LALEMBUU",
    "LANDONO",
    "LAONTI",
    "MORAMO UTARA",
    "MORAMO",
    "MOWILA",
    "PALANGGA SELATAN",
    "PALANGGA",
    "RANOMEETO BARAT",
    "RANOMEETO",
    "SABULAKOA",
    "TINANGGEA",
    "WOLASI",
]


def classify_school(name: str) -> tuple[str | None, str]:
    """
    Classify a unit_kerja string into (jenjang, status_sekolah).
    Returns (None, 'STRUKTURAL') if it is an administrative office (Dinas/Korwil).
    """
    clean = re.sub(r"[\u200c\u200b\s]+", " ", name).strip().upper()

    # 1. Non-school (Skip)
    if clean.startswith("KORWIL") or clean.startswith("DINAS"):
        return None, "STRUKTURAL"

    # 2. SKB / Nonformal / PKBM
    if clean.startswith("SKB"):
        return "PKBM", "NEGERI"

    # 3. SATAP (Satu Atap)
    if "SATAP" in clean or "SD-SMP" in clean or "SD - SMP" in clean or "SDN-SMPN" in clean:
        if clean.startswith("SDN") or clean.startswith("SD "):
            return "SD", "NEGERI"
        elif clean.startswith("SMPN") or clean.startswith("SMP "):
            return "SMP", "NEGERI"
        elif clean.startswith("TKN") or clean.startswith("TK "):
            return "TK", "NEGERI"
        else:
            return "SATAP", "NEGERI"

    # 4. SMP
    if clean.startswith("SMPN") or clean.startswith("SMP "):
        status = "SWASTA" if "SWASTA" in clean else "NEGERI"
        return "SMP", status

    # 5. SD
    if clean.startswith("SDN") or clean.startswith("SD "):
        status = "SWASTA" if "SWASTA" in clean else "NEGERI"
        return "SD", status

    # 6. TK / PAUD
    if (
        clean.startswith("TK")
        or clean.startswith("TKN")
        or clean.startswith("PAUD")
        or clean.startswith("KB")
    ):
        jenjang = "PAUD" if clean.startswith("PAUD") or clean.startswith("KB") else "TK"
        status = "NEGERI" if clean.startswith("TKN") or "NEGERI" in clean else "SWASTA"
        return jenjang, status

    # 7. Known edge cases (TK binaan/yayasan)
    if clean in ["MEKAR JAYA", "DHARMA WANITA", "TUNAS HARAPAN"]:
        return "TK", "SWASTA"

    return "LAINNYA", "NEGERI"


def extract_kecamatan(name: str, alamat: str | None) -> str | None:
    """Extract kecamatan from school name and address text."""
    combined = f"{name} {alamat or ''}".upper()
    for kec in KECAMATAN_LIST:
        if re.search(r"\b" + re.escape(kec) + r"\b", combined):
            return kec.title()
    return None


def resolve_wilayah(
    name: str,
    alamat: str | None,
    kec_data: list[tuple[int, str]],  # (kecamatan_id, nama_kecamatan)
    des_by_kec: dict[int, list[tuple[int, str]]],  # kec_id -> [(des_kel_id, nama_des_kel)]
) -> tuple[int | None, str | None, int | None, str | None]:
    """Resolve kecamatan and desa/kelurahan from egov regional master data."""
    combined = f"{name} {alamat or ''}".upper()

    found_kec_id: int | None = None
    found_kec_name: str | None = None

    for k_id, k_name in kec_data:
        if re.search(r"\b" + re.escape(k_name) + r"\b", combined):
            found_kec_id = k_id
            found_kec_name = k_name.title()
            break

    found_des_id: int | None = None
    found_des_name: str | None = None

    if found_kec_id and found_kec_id in des_by_kec:
        for d_id, d_name in des_by_kec[found_kec_id]:
            if len(d_name) > 3 and re.search(r"\b" + re.escape(d_name) + r"\b", combined):
                found_des_id = d_id
                found_des_name = d_name.title()
                break

    return found_kec_id, found_kec_name, found_des_id, found_des_name
