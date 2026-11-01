import { SiteHeader, SiteFooter } from "../_components";
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
