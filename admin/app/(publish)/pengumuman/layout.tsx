import { SiteHeader, SiteFooter } from "../_components";
export const metadata = {
  title: "Pusat Pengumuman & Surat Edaran Resmi - Kab. Konawe Selatan",
  description:
    "Pemberitahuan, surat edaran, juknis asesmen, seleksi kepegawaian, dan informasi resmi kedinasan Dinas Pendidikan dan Kebudayaan Kabupaten Konawe Selatan.",
};

export default function AnnouncementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pengumuman-page-layout">
      <SiteHeader activeSection="announcements" />
      {children}
      <SiteFooter />
    </main>
  );
}
