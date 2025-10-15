export interface GlobalState {
  isLoading: boolean;
  isDarkMode: boolean;
  isAudibleOn: boolean;
  isAlarmPopupOn: boolean;
  isAlarmOn: boolean;
  menuSider: {
    isCollapsed: boolean;
    selectedMenu: string;
  };
  isSettingsOpen: boolean;
  user: {
     global: {
       colorYn: number;
       title: number;
       topicType: number;
     };
    dashboard: {
      dashboardId: number;
    };
    login: {
      alarmYn: number;
      alarmPopupYn: number;
      audibleYn: number;
      roleGroupId: number;
      roleId: number;
      userId: string;
      userNm: string;
    };
    // devConf: {
    //   rack: number;
    //   line: number;
    // };
  } | null;
}

export interface Credentials {
  userId: string;
  password: string;
}

export type ResponseData = any;

export interface ResConfig {
  colorYn: number; // 1 | 0
  dashboardId: number;
  audibleYn: number; // 1 | 0
  alarmPopupYn: number;
  alarmYn: number;
  title: number;
  topicType: number;
}

export enum RoleGroupId {
  ADMIN = 0,
  BUSINESS_UNIT = 1,
  STATION = 2,
  DEVELOPER = 3,
}
