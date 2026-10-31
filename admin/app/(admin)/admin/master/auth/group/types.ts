export type GroupRecord = {
  id: string;
  title: string;
  level: number;
  member_count?: number;
  created_at: string;
  created_by?: string;
};

export type ResponseInterface = GroupRecord;

export type ResponseListInterface = {
  success: boolean;
  statusCode: number;
  message: string;
  total: number;
  data: GroupRecord[];
};

export type PermissionRule = {
  menu_id: string;
  menu_title?: string;
  menu_path?: string;
  menu_icon?: string;
  parent_id?: string | null;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type GroupPermissionsResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    group_id: string;
    group_title: string;
    group_level: number;
    permissions: PermissionRule[];
  };
};
