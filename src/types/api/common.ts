import { z } from 'zod';
import {
  resCheckPwdSchema,
  resDeviceDetailSchema,
  resDeviceTypeDepthListSchema,
  resDeviceTypeListSchema,
  resDeviceTypesByDepthsSchema,
  resLatestTemperatureDataSchema,
  resParentBranchListSchema,
  resParentBranchSchema,
  resPhoneTypeListSchema,
} from '@/services/validation/common';

export interface UserConfig {
  global: {
    colorYn: number;
    title: number;
    topicType: number;
  };
  dashboard: {
    dashboardId: number;
  };
  // 백엔드랑 맞추기
  login: {
    audibleYn: number;
    roleGroupId: number;
    roleId: number;
    userId: string;
    userNm: string;
  };
  devConf: {
    rack: number;
    line: number;
  };
}
export interface OptionType<T = number> {
  label: string;
  value: T;
}
export interface CascaderOption {
  label: string;
  value: number;
  depth: number;
  isLeaf: boolean;
  children?: CascaderOption[];
}

export type SortOption = 'ASC' | 'DESC';

export type ResParentBranch = z.infer<typeof resParentBranchSchema>;
export type ResParentBranchList = z.infer<typeof resParentBranchListSchema>;

export type ResDeviceTypeDepthList = z.infer<
  typeof resDeviceTypeDepthListSchema
>;

export type ResDeviceTypeList = z.infer<typeof resDeviceTypeListSchema>;

export type ResDeviceTypesByDepths = z.infer<
  typeof resDeviceTypesByDepthsSchema
>;

export type ResPhoneTypeList = z.infer<typeof resPhoneTypeListSchema>;

export type ResDeviceDetail = z.infer<typeof resDeviceDetailSchema>;

export type ResLatestTemperatureData = z.infer<typeof resLatestTemperatureDataSchema>;

export type ResCheckPwd = z.infer<typeof resCheckPwdSchema>;
