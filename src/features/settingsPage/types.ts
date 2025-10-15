import { RcFile } from 'antd/es/upload';
import { Dayjs } from 'dayjs';
import { EventTypeEn, ResPaginationMeta } from '@/types/common';
import { SettingsTab } from '@/types/enum';

// settingSlice에 두고 import하면 circular dependency issue 생김
export const SETTINGS_SLICE = 'settings';
export interface SettingsSliceState {
  isLoading: boolean;
  // selectedTab: (typeof tabItems)[0]['key'];
  selectedTab: SettingsTab;
  businessUnitsTab: {
    businessUnits: ResBusinessUnits | null;
    businessUnit: ResBusinessUnit | null;
  };
  stationsTab: {
    stations: ResStations | null;
    station: ResStation | null;
  };
  deviceTypesTab: {
    deviceTypes: ResDeviceType[] | null;
    deviceType: ResDeviceType | null;
    lv1Categories: ResDeviceTypeCategory[] | null;
    lv2Categories: ResDeviceTypeCategory[] | null;
  };
  deviceImagesTab: {
    deviceImages: ResDeviceImages | null;
    deviceImage: ResSingleDeviceImage | null;
  };
  devicesTab: {
    devices: ResDevices | null;
    device: ResDevice | null;
  };
  terminalsTab: {
    terminals: ResTerminals | null;
    terminal: ResTerminal | null;
    cameraTypes: ResCameraTypes | null;
    switches: ResSwitch[] | null;
    switchPortKeys: ResSwitchPortKey[] | null;
  };
  sensorsTab: {
    sensors: ResSensors | null;
    sensor: ResSensor | null;
  };
  rolesTab: {
    roles: ResRole[] | null;
    role: ResRoleDetails | null;
    roleGroups: ResRoleGroup[] | null;
  };
  usersTab: {
    users: ResUsers | null;
    user: ResSingleUser | null;
  };
  thresholdsTab: {
    thresholds: ResThresholds | null;
    threshold: ResSingleThreshold | null;
  };
  eventsTab: {
    events: ResEvents | null;
    event: ResSingleEvent | null;
  };
  loginHistoryTab: {
    loginHistory: ResLoginHistory | null;
    loginHistoryRecord: ResLoginHistoryRecord | null;
  };
}

export interface ResBusinessUnits {
  managementList: ResBusinessUnit[];
  // page: ResPaginationMeta;
}

export interface ResBusinessUnit {
  managementCd: number;
  managementId: string;
  managementNm: string;
}

export interface ResStations {
  stationList: ResStation[];
  page?: ResPaginationMeta;
}

export interface ResStation {
  no: number;
  stationCd: string;
  managementNm: string;
  stationNm: string;
}

export interface ResDeviceType {
  id: number;
  depth1Cd: number;
  depth2Cd: number;
  depth1Nm: string;
  depth2Nm: string;
}

export interface ResDeviceTypeCategory {
  deviceKindNm: string;
  deviceKind: number;
  seqNum: number;
}

export interface ResDeviceImages {
  listDeviceImage: ResDeviceImage[];
  page: ResPaginationMeta;
}

export interface ResDeviceImage {
  no: number;
  seqNum: number;
  deviceKindNm: string;
  deviceFileNm: string;
  fileNm: string;
  unit: 1 | 2;
}
export interface ResSingleDeviceImage {
  deviceKind: number;
  seqNum: number;
  deviceKindNm: string;
  deviceFileNm: string;
  fileNm: string;
}

export interface DeviceImageFormValues {
  deviceFileNm: string;
  deviceKind: number;
  file: RcFile;
  unit: 1 | 2;
}

export interface ResDevices {
  deviceList: ResDevice[];
  page: ResPaginationMeta;
}
export interface ResDevice {
  no: number;
  deviceKey: number;
  deviceNm: string;
  managementCd: number;
  managementNm: string;
  stationCd: string;
  stationNm: string;
  deviceIp: string;
  manageYn: number;
  manageYnNm: string;
  deviceKindNm: string;
  os: string;
  installCompany: string;
  productCompany: string;
  installDate: string;
  modelNm: string;
  managerA: string;
  managerB: string;
  device1Depth: number;
  device2Depth: number;
}

export interface DeviceFormValues {
  deviceKey?: number;
  managementCd: number;
  stationCd: string;
  device1Depth: number;
  device2Depth: number;
  deviceNm: string;
  deviceIp: string;
  manageYn: boolean;
  installCompany: string;
  productCompany: string;
  installDate: Dayjs;
  modelNm: string;
  managerA: string;
  managerB: string;
}
export interface ResTerminals {
  cameraList: ResTerminal[];
  page: ResPaginationMeta;
}

export interface ResTerminal {
  no: number;
  deviceKey: number;
  cameraTypeNm: string;
  deviceNm: string;
  managementCd: number;
  managementNm: string;
  stationCd: string;
  stationNm: string;
  deviceIp: string;
  manageYn: number;
  manageYnNm: string;
  installCompany: string;
  productCompany: string;
  installDate: string;
  modelNm: string;
  managerA: string;
  managerB: string;

  device1Depth: number;
  device2Depth: number;
  deviceKindNm: string;
  pstnNm: string;
  switchIp: string;
  switchPortKey: number;
  switchPortMacAddr: null;
}

export interface TerminalFormValues {
  deviceKey?: number;
  managementCd: number;
  stationCd: string;
  device1Depth: number;
  device2Depth: number;
  // switchPortNm: string;
  deviceNm: string;
  deviceIp: string;
  manageYn?: number;
  installCompany?: string;
  productCompany?: string;
  installDate?: Dayjs;
  modelNm?: string;
  managerA?: string;
  managerB?: string;
  switchPortKey: number;
  deviceKindNm: string;
}

export interface ResCameraTypes {
  cameraKindList: ResCameraType[];
}
export interface ResCameraType {
  seq: number;
  camTypeNm: string;
}

export interface ResSwitch {
  switchNm: string;
  switchIp: string;
}

export interface ResSwitchPortKey {
  portKey: number;
}

export interface ResSensors {
  sensorList: ResSensor[];
  page: ResPaginationMeta;
}

export interface ResSensor {
  no: number;
  deviceKey: number;
  deviceNm: string;
  sensorNum: number;
  managementCd: number;
  managementNm: string;
  stationCd: string;
  stationNm: string;
  deviceIp: string;
  gender: number;
  genderNm: string;
  manageYn: number;
  manageYnNm: string;
  installCompany: string;
  productCompany: string;
  installDate: string;
  modelNm: string | undefined;
  managerA: string;
  managerB: string;

  deviceKindNm: string;
  device1Depth: number;
  device2Depth: number;
  pstnNm: string;
}

export interface SensorFormValues {
  deviceKey?: number;
  managementCd: number;
  stationCd: string;
  device1Depth: number;
  device2Depth: number;
  // sensorNm: string;
  deviceNm: string;
  deviceIp: string;
  manageYn?: number;
  installCompany?: string;
  productCompany?: string;
  installDate?: Dayjs;
  modelNm?: string;
  managerA?: string;
  managerB?: string;
  gender?: number;
  sensorNum: number;
}

export interface ResRole {
  roleGroupId: number;
  roleId: number;
  roleGroupKrNm: string;
  roleNm: string;
  station: string[] | null;
  stationNm: string;
  // stationCdArr: null;
}

export interface ResRoleDetails {
  roleId: number;
  // roleGroupId: number;
  roleGroupKrNm: string;
  roleNm: string;
  station: string[] | null;
}

export interface ResRoleGroup {
  roleGroupId: number;
  roleGroupNm: string;
  roleGroupKrNm: string;
}

export interface RoleFormValues {
  roleGroupId: number;
  roleNm: string;
  station: string[];
}

export interface ResUsers {
  userList: ResUser[];
  // page: ResPaginationMeta;
}

export interface ResUser {
  userId: string;
  userNm: string;
  roleId: number;
  roleNm: string;
  alarmYn: number;
  alarmYnNm: string;
  audibleYn: number;
  audibleYnNm: string;
  lockYn: number;
  lockYnNm: string;
}

export interface ResSingleUser {
  audibleYnNm: string;
  userNm: string;
  roleNm: string;
  alarmYn: number;
  LOCK_YN: number;
  roleId: number;
  AUDIBLE_YN: number;
  alarmYnNm: string;
  DEPARTMENT: string | null;
  userId: string;
  lockYnNm: string;
}

export interface UserFormValues {
  userId: string;
  confirm: string;
  passwd: string;
  userNm: string;
  roleId: number;
}

export interface ResThresholds {
  listDeviceThr: ResThreshold[];
  page: ResPaginationMeta;
}

export interface ResThreshold {
  no: number;
  managementNm: string;
  stationNm: string;
  deviceKey: number;
  deviceNm: string;
  deviceIp: string;
  cpuThr: number;
  memThr: number;
  fsThr: number;
  gpu1Thr: number;
  gpu2Thr: number;
  gpu3Thr: number;
  gpu4Thr: number;

  device1Depth: number;
  deviceKindNm: string;
  managementCd: number;
  stationCd: string;
}

export type ResSingleThreshold = {
  NO: number;
  cpuThr: number;
  depth1: number;
  depth2: number;
  deviceIp: string;
  deviceKey: number;
  deviceNm: string;
  fsThr: number;
  gpu1Thr: number;
  gpu2Thr: number;
  gpu3Thr: number;
  gpu4Thr: number;
  managementNm: string;
  memThr: number;
  stationNm: string;
};

export type ThresholdFormValues = Omit<
  ResSingleThreshold,
  'no' | 'managementNm' | 'stationNm' | 'deviceIp'
>;

export interface ResEvents {
  eventList: ResEvent[];
  page: ResPaginationMeta;
}

export interface ResEvent {
  no: number;
  fCd: string;
  fDes: string;
  fDiv: string;
  fLv: number;
  fLvNm: EventTypeEn;
  soundFileNm: string;
  displayYn: number;
  manageYn: number;
  complexFaultYn: number;
}

export type ResSingleEvent = Omit<ResEvent, 'no'>;

export type EventFormValues = Omit<
  ResSingleEvent,
  'fDiv' | 'fLvNm' | 'displayYn' | 'soundFileNm'
>;
export interface ResLoginHistory {
  loginHistList: ResLoginHistoryRecord[];
  page: ResPaginationMeta;
}

export interface ResLoginHistoryRecord {
  no: number;
  userId: string;
  loginDate: string;
  logoutDate: string | null;
  userIp: string;
}

export interface DevicesFilters {
  businessUnitId?: number;
  stationId?: string;
  deviceTypeId?: number;
}

export interface DevicesQueryParams {
  search?: string;
  filters?: DevicesFilters;
  page: number;
}
