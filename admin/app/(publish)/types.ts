export interface HomeBanner {
  id: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  primaryButtonLabel?: string;
  primaryButtonLink?: string;
  image?: string;
  order?: number;
  status?: string;
}

export interface HomeNewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  date: string;
  image: string;
}

export interface HomeAnnouncementItem {
  id: string;
  title: string;
  date: string;
  category: string;
  attachmentName?: string;
}

export interface HomeStatisticItem {
  id: string;
  label: string;
  value: string;
  sub: string;
  trend?: string;
}
