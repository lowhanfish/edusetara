import data from "./home-data.json";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  children?: {
    id: string;
    label: string;
    description: string;
    href: string;
    icon: string;
  }[];
};

export type FooterLink = {
  id: string;
  label: string;
  href: string;
};

export const navItems = data.navItems as NavItem[];
export const audiences = data.audiences;
export const latestNews = data.latestNews;
export const announcements = data.announcements;
export const quickLinks = data.quickLinks;
export const educationStats = data.educationStats;
export const cultureLinks = data.cultureLinks;
export const satisfactionTrend = data.satisfactionTrend;
export const serviceStandards = data.serviceStandards;
export const footerQuickLinks = data.footerQuickLinks as FooterLink[];
export const footerServices = data.footerServices as FooterLink[];
