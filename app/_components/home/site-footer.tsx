import Image from "next/image";
import Link from "next/link";

import {
  footerQuickLinks,
  footerServices,
  type FooterLink,
} from "./home-data";

export function SiteFooter() {
  return (
    <footer id="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div>
            <Image
              src="/img/logo_loght.png"
              width={70}
              height={70}
              alt="Logo Konawe Selatan"
            />
            <strong>
              Dinas Pendidikan dan Kebudayaan
              <small>Kabupaten Konawe Selatan</small>
            </strong>
          </div>
          <p>
            Jl. Poros Andoolo – Kendari, Kompleks Perkantoran Bupati
            <br />
            Kabupaten Konawe Selatan, Sulawesi Tenggara
          </p>
          <p>☎ (0408) 123 4567　 ✉ dikbud@konaweselatankab.go.id</p>
        </div>
        <FooterLinkGroup title="Tautan Cepat" links={footerQuickLinks} />
        <FooterLinkGroup title="Layanan" links={footerServices} />
        <div className="social">
          <h4>Ikuti Kami</h4>
          <div>
            <a href="#">f</a>
            <a href="#">◎</a>
            <a href="#">▶</a>
            <a href="#">♪</a>
          </div>
          <strong>
            Konawe Selatan
            <br />
            <em>Maju Bersama</em>
          </strong>
        </div>
      </div>
      <div className="container copyright">
        <span>
          © 2026 Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan. All
          rights reserved.
        </span>
        <span>Kebijakan Privasi　|　Syarat & Ketentuan　|　Peta Situs</span>
      </div>
    </footer>
  );
}

function FooterLinkGroup({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4>{title}</h4>
      {links.map(({ id, label, href }) => (
        <Link href={href} key={id}>
          › {label}
        </Link>
      ))}
    </div>
  );
}
