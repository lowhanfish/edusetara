// Static navigation and audience shortcuts: no corresponding admin content menu.
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
export const footerQuickLinks = data.footerQuickLinks as FooterLink[];
export const footerServices = data.footerServices as FooterLink[];
