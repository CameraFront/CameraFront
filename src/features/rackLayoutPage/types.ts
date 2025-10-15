import { Node } from 'reactflow';
import { ResTopologyTreeNode, TreeNode } from '@/types/common';
import { ResUnhandledEventDetailsList } from '../eventsPage/types';
import {
  ResDeviceOption,
  ResDeviceTypeOption,
  ResNodeDeviceDetails,
  ResTopologyEvent,
} from '../topologyPage/types';

export interface RackLayoutSliceState {
  isLoading: boolean;
  isEditMode: boolean;
  isFullScreenMode: boolean;
  tree: {
    resDeviceTree: ResTopologyTreeNode[];
    selectedBranch: TreeNode | null;
    expandedKeys: string[];
  };
  content: {
    isLoading: boolean;
    nodesSaved: Node[];
    selectedNode: Node | null;
    nodeDeviceDetails: ResNodeDeviceDetails | null;
    unhandledEventDetailsList: ResUnhandledEventDetailsList | null;
    selectedNodes: Node[];
    deviceTypeOptions: ResDeviceTypeOption[];
    deviceOptions: ResDeviceOption[];
    unhandledEventMap: Record<number, ResTopologyEvent>;
  };
  canvasOptions: {
    hasMiniMap: boolean;
    updateInterval: number;
  };
}

export type RackNodeData = {
  label: string;
};

export type IRackNode = Node<RackNodeData>;

export type RackDisplayItemNodeData = {
  deviceImageId: number;
  unit: number;
  deviceTypeId: number;
  deviceTypeName: string;
};

export type IRackDisplayItemNode = Node<RackDisplayItemNodeData>;

export type RackLayoutNode =
  | Node<RackNodeData>
  | Node<RackItemNodeData>
  | Node<RackDisplayItemNodeData>;

export type RackItemNodeData = {
  deviceImageId: number;
  unit: number;
  deviceTypeId: number;
  deviceTypeName: string;
  deviceId: number;
  deviceName: string;
  events?: {
    urgent: number;
    important: number;
    minor: number;
    total: number;
  };
};

export type IRackItemNode = Node<RackItemNodeData>;
export interface ResRackLayoutContent {
  events: ResTopologyEvent[];
  rackNm: string;
  dataNode: RackLayoutNode[];
}

export const isRackItemNode = (
  node: RackLayoutNode | null | undefined,
): node is IRackItemNode => node?.type === 'rackItem';

export const isRackNode = (
  node: RackLayoutNode | null | undefined,
): node is IRackNode => node?.type === 'rack';

export const isRackDisplayItemNode = (
  node: RackLayoutNode | null | undefined,
): node is IRackDisplayItemNode => node?.type === 'rackDisplayItem';
