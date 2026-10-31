import { SiteFooter } from "../_components/home/site-footer";
import { SiteHeader } from "../_components/home/site-header";

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
