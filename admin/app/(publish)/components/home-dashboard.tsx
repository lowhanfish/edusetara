import { AnnouncementsSection } from "./announcements-section";
import { CultureSection } from "./culture-section";
import { NewsSection } from "./news-section";
import { QuickLinksSection } from "./quick-links-section";
import { SatisfactionSection } from "./satisfaction-section";
import { SchoolFinderSection } from "./school-finder-section";
import { ServiceStandardsSection } from "./service-standards-section";
import { StatisticsSection } from "./statistics-section";

export function HomeDashboard() {
  return (
    <>
      <div className="dashboard-grid top-grid">
        <NewsSection />
        <AnnouncementsSection />
        <QuickLinksSection />
      </div>
      <div className="dashboard-grid mid-grid">
        <SchoolFinderSection />
        <StatisticsSection />
        <CultureSection />
      </div>
      <div className="dashboard-grid bottom-grid">
        <SatisfactionSection />
        <ServiceStandardsSection />
      </div>
    </>
  );
}
