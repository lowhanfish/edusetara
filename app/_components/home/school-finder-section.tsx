import { SectionHeading } from "./shared";

export function SchoolFinderSection() {
  return (
    <section className="card school-finder" id="cari-sekolah">
      <SectionHeading
        icon="⌖"
        title="Cari Sekolah di Konawe Selatan"
        action=""
      />
      <p>Temukan informasi sekolah (SD, SMP, PAUD) di seluruh kecamatan.</p>
      <div className="finder-body">
        <form>
          <select aria-label="Pilih jenjang" defaultValue="">
            <option value="" disabled>
              Pilih Jenjang
            </option>
            <option>SD</option>
            <option>SMP</option>
            <option>PAUD</option>
          </select>
          <select aria-label="Pilih kecamatan" defaultValue="">
            <option value="" disabled>
              Pilih Kecamatan
            </option>
            <option>Andoolo</option>
            <option>Laeya</option>
            <option>Palangga</option>
          </select>
          <input placeholder="Ketik nama sekolah..." aria-label="Nama sekolah" />
          <button type="submit">Cari Sekolah</button>
        </form>
        <div className="map-graphic" aria-label="Ilustrasi peta lokasi sekolah">
          <span>●</span>
          <i>●</i>
          <b>●</b>
          <em>●</em>
          <a href="#">Lihat Peta Selengkapnya</a>
        </div>
      </div>
    </section>
  );
}
