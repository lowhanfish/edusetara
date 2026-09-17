import { SiteFooter } from "../_components/home/site-footer";
import { SiteHeader } from "../_components/home/site-header";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <SiteHeader activeSection="about" />
      {children}
      <SiteFooter />
    </main>
  );
}
