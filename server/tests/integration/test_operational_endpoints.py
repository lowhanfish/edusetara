"""Integration tests for operational endpoints (non-master modules)."""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.mark.asyncio
async def test_sarpras_tanah_crud(client: AsyncClient, db_session: AsyncSession) -> None:
    # 1. Read
    res = await client.get("/api/v1/admin/sarpras/tanah/read")
    assert res.status_code == 200
    body = res.json()
    assert "data" in body
    assert "total" in body

    # 2. Create
    payload = {
        "title": "5.000 m²",
        "file": "sertifikat_test.pdf",
        "file_type": "pdf",
        "unit_kerja": "SD TEST",
    }
    create_res = await client.post("/api/v1/admin/sarpras/tanah/create", json=payload)
    assert create_res.status_code == 201
    created_item = create_res.json()
    assert created_item["title"] == "5.000 m²"
    item_id = created_item["id"]

    # 3. Get by ID
    get_res = await client.get(f"/api/v1/admin/sarpras/tanah/{item_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == item_id

    # 4. Update
    update_res = await client.put(
        f"/api/v1/admin/sarpras/tanah/update/{item_id}",
        json={"title": "5.500 m²"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "5.500 m²"

    # 5. Delete
    del_res = await client.delete(f"/api/v1/admin/sarpras/tanah/delete/{item_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True


@pytest.mark.asyncio
async def test_jurnal_guru_kelas_crud(client: AsyncClient, db_session: AsyncSession) -> None:
    payload = {
        "sekolah": "SDN TEST",
        "tema": "Tema Uji",
        "materi_pokok": "Materi Uji",
        "pertemuan_ke": 2,
        "siswa_hadir": 25,
        "persentase": 100,
    }
    create_res = await client.post("/api/v1/admin/jurnal/guru-kelas/create", json=payload)
    assert create_res.status_code == 201
    item = create_res.json()
    assert item["tema"] == "Tema Uji"

    read_res = await client.get("/api/v1/admin/jurnal/guru-kelas/read?search=Tema Uji")
    assert read_res.status_code == 200
    assert read_res.json()["total"] >= 1

    # Cleanup
    await client.delete(f"/api/v1/admin/jurnal/guru-kelas/delete/{item['id']}")


@pytest.mark.asyncio
async def test_berita_crud(client: AsyncClient, db_session: AsyncSession) -> None:
    payload = {
        "judul": "Berita Integrasi Frontend-Backend Sukses",
        "slug": "integrasi-frontend-backend-sukses",
        "sumber": "Tim IT",
        "kategori": "Pendidikan",
        "deskripsi": "Pengujian integrasi otomatis",
        "isi": "<p>Integrasi berjalan sempurna</p>",
    }
    create_res = await client.post("/api/v1/admin/berita/create", json=payload)
    assert create_res.status_code == 201
    item = create_res.json()
    assert item["judul"] == payload["judul"]

    # Option test
    opt_res = await client.get("/api/v1/admin/berita/option?search=Integrasi")
    assert opt_res.status_code == 200
    assert isinstance(opt_res.json(), list)

    # Cleanup
    await client.delete(f"/api/v1/admin/berita/delete/{item['id']}")


@pytest.mark.asyncio
async def test_publish_endpoints_read(client: AsyncClient, db_session: AsyncSession) -> None:
    endpoints = [
        "/api/v1/admin/pengumuman/read",
        "/api/v1/admin/layanan/read",
        "/api/v1/admin/kontak/read",
        "/api/v1/admin/banner/read",
        "/api/v1/admin/kebudayaan/read",
        "/api/v1/admin/pendidikan/read",
        "/api/v1/admin/profil/read",
        "/api/v1/admin/statistik/read",
    ]
    for url in endpoints:
        res = await client.get(url)
        assert res.status_code == 200, f"Failed on {url}"
        data = res.json()
        assert "data" in data
        assert "total" in data


@pytest.mark.asyncio
async def test_rombel_all_levels_crud(client: AsyncClient, db_session: AsyncSession) -> None:
    # 1. PAUD
    res_paud = await client.post(
        "/api/v1/admin/rombel/paud/create",
        json={"nama": "Rombel PAUD Melati", "unit_kerja": "TK Pembina"},
    )
    assert res_paud.status_code == 201
    paud_item = res_paud.json()
    assert paud_item["nama"] == "Rombel PAUD Melati"

    # 2. SD
    res_sd = await client.post(
        "/api/v1/admin/rombel/sd/create",
        json={"nama": "Kelas 1A", "unit_kerja": "SDN 1 Unaaha"},
    )
    assert res_sd.status_code == 201
    sd_item = res_sd.json()
    assert sd_item["nama"] == "Kelas 1A"

    # 3. SMP
    res_smp = await client.post(
        "/api/v1/admin/rombel/smp/create",
        json={"nama": "Kelas 7A", "unit_kerja": "SMPN 1 Unaaha"},
    )
    assert res_smp.status_code == 201
    smp_item = res_smp.json()
    assert smp_item["nama"] == "Kelas 7A"

    # Clean up
    await client.delete(f"/api/v1/admin/rombel/paud/delete/{paud_item['id']}")
    await client.delete(f"/api/v1/admin/rombel/sd/delete/{sd_item['id']}")
    await client.delete(f"/api/v1/admin/rombel/smp/delete/{smp_item['id']}")


@pytest.mark.asyncio
async def test_usulan_and_verifikasi_crud(client: AsyncClient, db_session: AsyncSession) -> None:
    # 1. Usulan Tunjangan Guru
    res_utg = await client.post(
        "/api/v1/admin/usulan/tunjangan-guru/create",
        json={"unit_kerja": "SDN 2 Konawe", "nominal": 3500000, "nip": "198001012005011001"},
    )
    assert res_utg.status_code == 201
    utg = res_utg.json()
    assert utg["unit_kerja"] == "SDN 2 Konawe"

    # 2. Verifikasi Tunjangan Guru
    res_vtg = await client.post(
        "/api/v1/admin/verifikasi/tunjangan-guru/create",
        json={"usulan_id": utg["id"], "status": "Disetujui", "pesan": "Berkas lengkap"},
    )
    assert res_vtg.status_code == 201
    vtg = res_vtg.json()
    assert vtg["status"] == "Disetujui"

    # Clean up
    await client.delete(f"/api/v1/admin/usulan/tunjangan-guru/delete/{utg['id']}")
    await client.delete(f"/api/v1/admin/verifikasi/tunjangan-guru/delete/{vtg['id']}")


@pytest.mark.asyncio
async def test_kegiatan_and_gallery_crud(client: AsyncClient, db_session: AsyncSession) -> None:
    # 1. Kegiatan Sekolah
    res_keg = await client.post(
        "/api/v1/admin/kegiatan/kegiatan-sekolah/create",
        json={"judul": "Upacara Hari Pendidikan", "tahun": "2026"},
    )
    assert res_keg.status_code == 201
    keg = res_keg.json()

    # Direct alias test
    res_keg_read = await client.get("/api/v1/admin/kegiatan-sekolah/read")
    assert res_keg_read.status_code == 200

    # 2. Gallery Sekolah Penggerak
    res_gal = await client.post(
        "/api/v1/admin/gallery/sekolah-penggerak/create",
        json={"judul": "Pameran Karya Inovasi", "kategori": "SD"},
    )
    assert res_gal.status_code == 201
    gal = res_gal.json()

    # Clean up
    await client.delete(f"/api/v1/admin/kegiatan/kegiatan-sekolah/delete/{keg['id']}")
    await client.delete(f"/api/v1/admin/gallery/sekolah-penggerak/delete/{gal['id']}")


@pytest.mark.asyncio
async def test_regulasi_gtk_and_ppdb_crud(client: AsyncClient, db_session: AsyncSession) -> None:
    # 1. Regulasi GTK
    res_reg = await client.post(
        "/api/v1/admin/regulasi-gtk/pengumuman/create",
        json={"judul": "Pengumuman UKG 2026", "deskripsi": "Pelaksanaan UKG"},
    )
    assert res_reg.status_code == 201
    reg = res_reg.json()

    # 2. PPDB Kuota
    res_kuota = await client.post(
        "/api/v1/admin/ppdb/kuota/create",
        json={"nama_sekolah": "SMPN 1 Unaaha", "total_daya_tampung": 200},
    )
    assert res_kuota.status_code == 201
    kuota = res_kuota.json()

    # Direct alias test
    res_kuota_read = await client.get("/api/v1/admin/kuota-ppdb/read")
    assert res_kuota_read.status_code == 200

    # Clean up
    await client.delete(f"/api/v1/admin/regulasi-gtk/pengumuman/delete/{reg['id']}")
    await client.delete(f"/api/v1/admin/ppdb/kuota/delete/{kuota['id']}")

