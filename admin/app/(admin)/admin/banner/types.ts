export interface CreateInterface {
  title: string | null;
  subtitle?: string | null;
  badge_text?: string | null;
  primary_button_label?: string | null;
  primary_button_link?: string | null;
  image?: string | null;
  order?: number | null;
  status: string | null;
}

export interface ResponseInterface extends CreateInterface {
  id: string;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ResponseListInterface {
  skip: number;
  limit: number;
  total: number;
  data: ResponseInterface[];
}

export type PublishBannerRecord = ResponseInterface;
