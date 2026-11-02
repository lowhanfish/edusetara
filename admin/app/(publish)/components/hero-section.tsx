"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useHomeBanners } from "../hooks/useHomeData";

export function HeroSection() {
  const { data: banners } = useHomeBanners();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeBanner = banners && banners.length > 0 ? banners[activeIndex] : null;

  useEffect(() => {
    if (banners && banners.length > 1) {
      const timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % banners.length);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  const title = activeBanner?.title || "Pendidikan Berkualitas";
  const subtitle = activeBanner?.subtitle || "untuk Generasi Konawe Selatan yang Lebih Maju";
  const badgeText = activeBanner?.badgeText || "Kabupaten Konawe Selatan";
  const primaryButtonLabel = activeBanner?.primaryButtonLabel || "Jelajahi Layanan";
  const primaryButtonLink = activeBanner?.primaryButtonLink || "#layanan";
  const imageSrc = activeBanner?.image || "/img/hero-konsel.png";

  return (
    <section className="hero" id="beranda">
      <Image
        key={imageSrc}
        className="hero-photo transition-opacity duration-700 object-cover"
        src={imageSrc}
        alt={title}
        fill
        priority
        sizes="100vw"
        unoptimized={imageSrc.startsWith("http")}
      />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <p className="eyebrow">{badgeText}</p>
        <h1>
          {title}
        </h1>
        <h2>
          {subtitle}
        </h2>
        <p className="hero-description">
          Bersama kita wujudkan layanan pendidikan yang inklusif, berkarakter,
          dan berdaya saing, serta melestarikan kebudayaan daerah untuk masa depan yang lebih baik.
        </p>
        <div className="hero-buttons">
          <Link className="button primary" href={primaryButtonLink}>
            {primaryButtonLabel} <span>→</span>
          </Link>
          <Link className="button secondary" href="/tentang-kami">
            Tentang Kami <span>→</span>
          </Link>
        </div>

        {banners && banners.length > 1 && (
          <div className="hero-dots flex items-center gap-2 mt-4 cursor-pointer" aria-hidden="true">
            {banners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === activeIndex ? "bg-white w-7" : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
