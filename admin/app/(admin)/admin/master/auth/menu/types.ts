export type MenuRecord = {
  id: string;
  title: string;
  icon: string;
  path: string;
  index: number;
  parent_id?: string | null;
  is_active: boolean;
  created_at: string;
  created_by?: string;
  children?: MenuRecord[];
};

export type ResponseInterface = MenuRecord;

export type ResponseListInterface = {
  success: boolean;
  statusCode: number;
  message: string;
  total: number;
  data: MenuRecord[];
};

export type MenuTreeResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: MenuRecord[];
};
