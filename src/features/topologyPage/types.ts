import { Edge, Node } from 'reactflow';
import { z } from 'zod';
import {
  networkNodeDataSchema,
  sectionNodeDataSchema,
} from '@/services/validation/topology';
import { ResTopologyTreeNode, TreeNode } from '@/types/common';
import { ResUnhandledEventDetailsList } from '../eventsPage/types';

export interface TopologySliceState {
  isLoading: boolean;
  isEditMode: boolean;
  isFullScreenMode: boolean;
  tree: {
    resDeviceTree: ResTopologyTreeNode[];
    selectedTreeNode: TreeNode | null;
    expandedKeys: string[];
  };
  content: {
    isLoading: boolean;
    isChecking: boolean;
    nodesSaved: Node[];
    edgesSaved: Edge[];
    selectedNode: Node | null;
    selectedNodes: Node[];
    selectedEdge: Edge | null;
    deviceTypeOptions: ResDeviceTypeOption[];
    deviceOptions: ResDeviceOption[];
    nodeDeviceDetails: ResNodeDeviceDetails | null;
    unhandledEventDetailsList: ResUnhandledEventDetailsList | null;
    unhandledEventMap: Record<number, ResTopologyEvent>;
  };
  canvasOptions: {
    hasGrid: boolean;
    hasMiniMap: boolean;
    hasStream: boolean;
    updateInterval: number;
  };
}

// export type NetworkNodeData = {
//   // label: undefined;
//   important: number;
//   managementYn: ResManageYn;
//   deviceTypeId: number;
//   totalCnt: number;
//   eventList: {
//     eventLv: EventTypeEn;
//   }[];
//   minor: number;
//   deviceTypeName: string;
//   manualYn: ResBoolean;
//   urgent: number;
//   deviceId: number;
//   deviceName: string;
// };

export type NetworkNodeData = z.infer<typeof networkNodeDataSchema>;
export type NetworkNode = Node<NetworkNodeData>;

export type SectionNodeData = z.infer<typeof sectionNodeDataSchema>;
export type SectionNode = Node<SectionNodeData>;

export type TopologyNode = Node<NetworkNodeData | SectionNodeData>;

export interface ResTopologyContent {
  edgeNode: Edge[];
  topologyNm: string;
  dataNode: TopologyNode[];
  key: string;
  events: ResTopologyEvent[];
}

export interface ResDeviceOption {
  deviceKey: number;
  stationCd: string;
  deviceNm: string;
  os: string;
  deviceIp: string;
}

export interface DeviceTypeSelectOptions {
  label: string;
  value: number | string;
  isLeaf: boolean;
  children?: DeviceOption[];
}
export interface DeviceOption {
  label: string;
  value: number;
  disabled?: boolean;
}

export interface ResDeviceTypeOption {
  seqNum: number;
  deviceKind: number;
  deviceKindNm: string;
  deviceKindEnNm: string;
}

export interface ResNodeDeviceDetails {
  cpuUtil: number;
  deviceIp: string;
  deviceKey: number;
  deviceKindNm: string;
  deviceNm: string;
  fsNm: string | null;
  installCompany: string;
  installDate: string;
  manageYnNm: string;
  managementNm: string;
  managerANm: string;
  managerBNm: string;
  memUtil: number;
  modelNm: string;
  os: string;
  productCompany: string;
  sysUptime: string;
  usageUtil: number | null;
}

export interface ResTopologyEvent {
  deviceKey: number;
  urgent: number;
  important: number;
  minor: number;
  managementYn: number;
}

export interface ResPing {
  ping: string;
  cmd: string;
}

export interface ResSnmp {
  snmp: string;
  cmd: string;
}

export const isNetworkNode = (
  node: TopologyNode | null | undefined,
): node is NetworkNode => node?.type === 'network';

export const isSectionNode = (
  node: TopologyNode | null | undefined,
): node is SectionNode => node?.type === 'section';
