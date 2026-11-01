import { SiteHeader, SiteFooter } from "../_components";
export default function PublicServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="public-services">
      <SiteHeader activeSection="public-services" />
      {children}
      <SiteFooter />
    </main>
  );
}
