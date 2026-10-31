import menuData from "./admin-menu.json";

export type MenuItem = {
  title: string;
  path: string | null;
  icon: string;
  children?: MenuItem[] | null;
};

export const adminMenu: MenuItem[] = menuData as MenuItem[];
