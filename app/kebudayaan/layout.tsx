import { SiteFooter } from "../_components/home/site-footer";
import { SiteHeader } from "../_components/home/site-header";

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
