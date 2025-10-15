import { ResPaginationMeta, ResTreeNode } from '@/types/common';

export interface ConfigPerfSliceState {
  isLoading: boolean;
  selectedTab: 'config' | 'perf';
  selectedBranch: ResTreeNode | null;
  resDeviceTree: ResTreeNode[];
  config: {
    search: string;
    resDeviceList: ResConfigDeviceList | null;
    resDeviceDetails: ResConfigDeviceDetails | null;
    resPortList: ResPort[] | null;
  };
  perf: {
    search: string;
    resDeviceList: ResPerfDeviceList | null;
    resUsageTop5: ResPerfUsageRankTop5 | null;
    resDeviceDetails: ResPerfDeviceDetails | null;
  };
}

export interface ResConfigDeviceList {
  deviceList: ResConfigDevice[];
  page: ResPaginationMeta;
}
export interface ResPerfDeviceList {
  devicePerformanceList: ResPerfDevice[];
  page: ResPaginationMeta;
}

export interface ResConfigDevice {
  no: number;
  managementNm: string;
  managementCd: number;
  stationNm: string;
  stationCd: string;
  os: string;
  deviceKindNm: string;
  deviceNm: string;
  deviceKey: number;
  deviceIp: string;
  manageYnNm: string;
  installCompany: string;
  productCompany: string;
  installDate: string;
  modelNm: string;
  managerA: string;
  managerB: string;
  pstnNm: string;
}
export interface ResPerfDevice {
  no: number;
  managementNm: string;
  managementCd: number;
  stationNm: string;
  stationCd: string;
  deviceKindNm: string;
  deviceNm: string;
  deviceKey: number;

  deviceIp: string;
  os: string;
  fsNm: string;
  cpuUtil: number;
  memUtil: number;
  usageUtil: number;
  inBpsPortNum: number;
  inBps: number;
  outBpsPortNum: number;
  outBps: number;
}

export type ResConfigDeviceDetails = ResServerDetails | ResNetworkDeviceDetails;

export interface ResPerfDeviceDetails {
  deviceNm: string;
  cpuPerformanceList: { date: string; cpuUtil: number }[];
  memPerformanceList: { date: string; memUtil: number }[];
  fsPerformanceList: { date: string; size: number }[];
  networkPerformanceList: { date: string; inBps: number; outBps: number }[];
}

export interface ResPerfUsageRankTop5 {
  cpuUsageUtilList: ResUsageRank[];
  memUsageUtilList: ResUsageRank[];
  fsUsageUtilList: ResUsageRank[];
  gpuUsageUtilList: ResUsageRank[];
  innetworkUsageUtilList: ResUsageRank[];
  outnetworkUsageUtilList: ResUsageRank[];
}

export interface ResUsageRank {
  ranking: number;
  managementCd: string;
  stationNm: string;
  deviceKey: number;
  deviceNm: string;
  usageUtil: number;
}

export interface ResCommonDeviceDetails {
  deviceKey: number;

  managementNm: string;
  stationNm: string;
  deviceKindNm: string;
  deviceNm: string;
  manageYnNm: string;
  installCompany: string;
  productCompany: string;
  installDate: string;
  modelNm: string;
  pstnNm: string;
  managerA: string;
  managerB: string;
}

export type ResServerDetails = {
  deviceIp: string;
  sysUptime: string;
  os: string;
  fsNm: string;
  cpuUtil: number;
  memUtil: number;
  usageUtil: number;
} & ResCommonDeviceDetails;

export type ResNetworkDeviceDetails = {
  deviceIp: string;
  sysUptime: string;
  os: string;
  fsNm: string;
  cpuUtil: number;
  memUtil: number;
  usageUtil: number;
} & ResCommonDeviceDetails;

export const isServerDetails = (
  obj: ResConfigDeviceDetails,
): obj is ResServerDetails => {
  return 'os' in obj;
};

export interface ResPort {
  no: number;
  deviceKey: number;
  portKey: number;
  deviceNm: string;
  deviceIp: string;
  fault: string;
}
