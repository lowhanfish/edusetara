import { AudienceSection } from "./_components/home/audience-section";
import { HeroSection } from "./_components/home/hero-section";
import { HomeDashboard } from "./_components/home/home-dashboard";
import { SiteFooter } from "./_components/home/site-footer";
import { SiteHeader } from "./_components/home/site-header";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <div className="content-shell container">
        <AudienceSection />
        <HomeDashboard />
      </div>
      <SiteFooter />
    </main>
  );
}
