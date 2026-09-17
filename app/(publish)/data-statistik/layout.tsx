import { SiteFooter } from "../_components/home/site-footer";
import { SiteHeader } from "../_components/home/site-header";

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="data-layout">
      <SiteHeader activeSection="data" />
      {children}
      <SiteFooter />
    </main>
  );
}
