import { SiteHeader, SiteFooter } from "../_components";
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
