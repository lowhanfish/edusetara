import { SiteFooter } from "../_components/home/site-footer";
import { SiteHeader } from "../_components/home/site-header";

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="education-layout">
      <SiteHeader activeSection="education" />
      {children}
      <SiteFooter />
    </main>
  );
}
