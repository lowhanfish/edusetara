import { SiteHeader, SiteFooter } from "../_components";
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <SiteHeader activeSection="about" />
      {children}
      <SiteFooter />
    </main>
  );
}
