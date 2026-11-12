import menuData from "./admin-menu.json";

export type MenuItem = {
  title: string;
  path: string | null;
  icon: string;
  /** Halaman tetap ada dan bisa dibuka lewat URL, tetapi tidak tampil di sidebar. */
  hidden?: boolean;
  children?: MenuItem[] | null;
};

const visible = (items: MenuItem[]): MenuItem[] =>
  items
    .filter((item) => !item.hidden)
    .map((item) => (item.children ? { ...item, children: visible(item.children) } : item));

export const adminMenu: MenuItem[] = visible(menuData as MenuItem[]);
