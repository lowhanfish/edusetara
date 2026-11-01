import { SiteHeader, SiteFooter } from "../_components";
export default function CultureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="culture-layout">
      <SiteHeader activeSection="culture" />
      {children}
      <SiteFooter />
    </main>
  );
}
