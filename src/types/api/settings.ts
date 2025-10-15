import { UploadFile } from 'antd';
import { Dayjs } from 'dayjs';
import { z } from 'zod';
import {
  resAllAudiosSchema,
  resAudioListSchema,
  resAudioSchema,
  resDeviceInspectionListSchema,
  resDeviceInspectionSchema,
  resDeviceListSchema,
  resDeviceManagerListAllSchema,
  resDeviceManagerListSchema,
  resDeviceManagerSchema,
  resDeviceManualListSchema,
  resDeviceManualSchema,
  resDeviceSchema,
  resDeviceTypesByDepthSchema,
  resEventListSchema,
  resEventSchema,
  resL2SwitchListSchema,
  resManagementListSchema,
  resManagementSchema,
  resPhoneListScanSchema,
  resPhoneListSchema,
  resPhoneSchema,
  resPhoneTypeListSchema,
  resPortKeyListSchema,
  resProcessListSchema,
  resProcessSchema,
  resRoleGroupListSchema,
  resRoleListSchema,
  resRoleSchema,
  resSshDeviceListSchema,
  resTerminalListSchema,
  resTerminalSchema,
  resThresholdListSchema,
  resThresholdSchema,
  resUserListSchema,
  resUserSchema,
  resValidateUserIdSchema,
} from '@/services/validation/settings';
import { ResBoolean, ResManageYn } from '../enum';

export type OpenedModalType = 'create' | 'update' | 'clone' | null;

// --------------------- 소속 관리 ---------------------
export type ResManagement = z.infer<typeof resManagementSchema>;
export type ResManagementList = z.infer<typeof resManagementListSchema>;
export interface CreateManagementFormValues {
  parentNodes: (number | null)[];
  managementNm: string;
  managementId: string;
}

export interface UpdateManagementFormValues {
  managementCd: number;
  parentNode: number | null;
  managementNm: string;
  managementId: string;
}

// --------------------- 장비 관리 ---------------------
export type ResDevice = z.infer<typeof resDeviceSchema>;
export type ResDeviceList = z.infer<typeof resDeviceListSchema>;
export type ResDeviceTypesByDepth = z.infer<typeof resDeviceTypesByDepthSchema>;
export interface DeviceListFilters {
  managementCd1?: number;
  managementCd2?: number;
  managementCd3?: number;
  deviceType?: number;
  search?: string;
  page: number;
}
export interface DeviceFormValues {
  managementCd: number;
  device1Depth: number;
  device2Depth: number;
  deviceNm: string;
  pstnNm: string;
  deviceIp: string;
  installCompany?: string | null;
  productCompany?: string | null;
  installDate?: Dayjs | null;
  modelNm?: string | null;
  managerA?: number | null;
  managerB?: number | null;
  manageYn?: ResBoolean;
}

// --------------------- 단말 관리 ---------------------
export type ResTerminalList = z.infer<typeof resTerminalListSchema>;
export type ResTerminal = z.infer<typeof resTerminalSchema>;
export interface TerminalFormValues {
  managementCd: number;
  device1Depth: number;
  device2Depth: number;
  deviceKindNm?: string;
  switchPortNm: string;
  pstnNm: string;
  deviceIp: string;
  installCompany?: string | null;
  modelNm?: string | null;
  productCompany?: string | null;
  installDate?: Dayjs | null;
  managerA?: number | null;
  managerB?: number | null;
  manageYn?: ResBoolean;
  switchIp: string;
  switchPortKey: number;
  // switchPortMacAddr: string;
}
export interface TerminalListFilters {
  managementCd1?: number;
  managementCd2?: number;
  managementCd3?: number;
  search?: string;
  page: number;
}

export type ResL2SwitchList = z.infer<typeof resL2SwitchListSchema>;
export type ResPortKeyList = z.infer<typeof resPortKeyListSchema>;

// --------------------- 전화기 관리 ---------------------
export type ResPhoneList = z.infer<typeof resPhoneListSchema>;
export type ResPhoneListScan = z.infer<typeof resPhoneListScanSchema>;
export type ResPhoneTypeList = z.infer<typeof resPhoneTypeListSchema>;
export interface PhoneListFilters {
  managementCd?: number;
  phoneType?: number;
  search?: string;
  page: number;
}
export type ResPhone = z.infer<typeof resPhoneSchema>;
export interface PhoneFormValues {
  managementCd: number;
  phoneNm: string;
  phoneType: number;
  internalNum: string;
  phoneLocation: string | null;
  externalNum: string | null;
  manageYn: ResManageYn;
}

// --------------------- 장애 관리 ---------------------
export type ResEventList = z.infer<typeof resEventListSchema>;
export type ResEvent = z.infer<typeof resEventSchema>;
export interface EventFormValues {
  fDes: string;
  manageYn: ResBoolean;
  fLv: number;
  audioKey: number | null;
  isAudible: ResBoolean;
}

// --------------------- 프로세스 관리 ---------------------
export type ResProcessList = z.infer<typeof resProcessListSchema>;
export type ResProcess = z.infer<typeof resProcessSchema>;
export type ResSshDeviceList = z.infer<typeof resSshDeviceListSchema>;
export interface ProcessListFilters {
  deviceType?: number;
  search?: string;
  page: number;
}
export interface ProcessFormValues {
  deviceKind: number;
  deviceKey: number;
  procNm: string;
  procPath: string;
  procParam: string | null;
}

// --------------------- 매뉴얼 관리 ---------------------
export type ResDeviceManualList = z.infer<typeof resDeviceManualListSchema>;
export type ResDeviceManual = z.infer<typeof resDeviceManualSchema>;
export interface DeviceManualListFilters {
  deviceType?: number;
  search?: string;
  page: number;
}
export interface DevicesManualFormValues {
  depth1: number;
  depth2: number;
  deviceKey?: number | null;
  manualNm: string;
  modelNm: string;
  version?: string | null;
  fileList: UploadFile[];
}

// --------------------- 설비점검 관리 ---------------------
export type ResDeviceInspectionList = z.infer<
  typeof resDeviceInspectionListSchema
>;
export type ResDeviceInspection = z.infer<typeof resDeviceInspectionSchema>;
export interface DeviceInspectionListFilters {
  deviceType?: number;
  search?: string;
  page: number;
}
export interface DeviceInspectionFormValues {
  deviceType: number;
  deviceKey: number;
  type: string;
  checkDt: Dayjs;
  companyNm: string;
  managerNm?: string;
  reportFileList?: UploadFile[];
  photoFileList?: UploadFile[];
}

// --------------------- 오디오 관리 ---------------------
export type ResAudioList = z.infer<typeof resAudioListSchema>;
export type ResAudio = z.infer<typeof resAudioSchema>;
export type ResAllAudios = z.infer<typeof resAllAudiosSchema>;
export interface AudioFormValues {
  soundNm: string; // 오디오명
  type: number; // 오디오타입(1: 장애 알림 오디오)
  file: File; // 오디오파일
}

// --------------------- 임계치 관리 ---------------------
export type ResThresholdList = z.infer<typeof resThresholdListSchema>;
export type ResThreshold = z.infer<typeof resThresholdSchema>;
export interface ThresholdFormValues {
  deviceNm: string;
  cpuThr: number;
  memThr: number;
  fsThr: number;
}

// --------------------- 권한 관리 ---------------------
export type ResRoleList = z.infer<typeof resRoleListSchema>;
export type ResRoleGroupList = z.infer<typeof resRoleGroupListSchema>;
export type ResRole = z.infer<typeof resRoleSchema>;
export interface RoleFormValues {
  roleNm: string;
  roleGroupId: number;
  managementCd: number | null;
}

// --------------------- 사용자 관리 ---------------------
export type ResUserList = z.infer<typeof resUserListSchema>;
export type ResUser = z.infer<typeof resUserSchema>;
export interface UserFormValues {
  userId: string;
  userNm: string;
  passwd: string;
  roleId: number;
}
export type ResValidateUserId = z.infer<typeof resValidateUserIdSchema>;

// --------------------- 장비관리자 관리 ---------------------
export type ResDeviceManagerList = z.infer<typeof resDeviceManagerListSchema>;
export type ResDeviceManager = z.infer<typeof resDeviceManagerSchema>;
export type ResDeviceManagerListAll = z.infer<
  typeof resDeviceManagerListAllSchema
>;
export interface DeviceManagerFormValues {
  managerNm: string;
  department: string;
  tel: string;
  email: string;
  manageYn: ResBoolean;
}
