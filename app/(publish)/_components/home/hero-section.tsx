import Image from "next/image";

export function HeroSection() {
  return (
    <section className="hero" id="beranda">
      <Image
        className="hero-photo"
        src="/img/hero-konsel.png"
        alt="Pelajar dan penari tradisional dengan latar alam Sulawesi Tenggara"
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <p className="eyebrow">Kabupaten Konawe Selatan</p>
        <h1>
          Pendidikan
          <br />
          <span>Berkualitas</span>
        </h1>
        <h2>
          untuk Generasi Konawe Selatan
          <br />
          yang Lebih Maju
        </h2>
        <p className="hero-description">
          Bersama kita wujudkan layanan pendidikan yang inklusif,
          <br />
          berkarakter, dan berdaya saing, serta melestarikan
          <br />
          kebudayaan daerah untuk masa depan yang lebih baik.
        </p>
        <div className="hero-buttons">
          <a className="button primary" href="#layanan">
            Jelajahi Layanan <span>→</span>
          </a>
          <a className="button secondary" href="#tentang-kami">
            Tentang Kami <span>→</span>
          </a>
        </div>
        <div className="hero-dots" aria-hidden="true">
          <b />
          <i />
          <i />
          <i />
        </div>
      </div>
    </section>
  );
}
