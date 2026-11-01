import { SiteHeader, SiteFooter } from "./_components";
import { AudienceSection } from "./components/audience-section";
import { HeroSection } from "./components/hero-section";
import { HomeDashboard } from "./components/home-dashboard";

export default function Home() {
  return (
    <main>
      <SiteHeader activeSection="home" />
      <HeroSection />
      <div className="content-shell container">
        <AudienceSection />
        <HomeDashboard />
      </div>
      <SiteFooter />
    </main>
  );
}
