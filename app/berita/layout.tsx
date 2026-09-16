import { SiteFooter } from "../_components/home/site-footer";
import { SiteHeader } from "../_components/home/site-header";

export const metadata = {
  title: "Warta & Berita Pendidikan dan Kebudayaan - Kab. Konawe Selatan",
  description:
    "Portal berita resmi Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan. Update kegiatan, kebijakan, inovasi, dan prestasi dunia pendidikan dan kebudayaan daerah.",
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="news-page-layout">
      <SiteHeader activeSection="news" />
      {children}
      <SiteFooter />
    </main>
  );
}
