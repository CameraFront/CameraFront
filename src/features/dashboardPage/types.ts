import { Layout } from 'react-grid-layout';
import { Edge, Node } from 'reactflow';
import { ResPerfDeviceDetails } from '@/features/configPerfPage/types';
import { ResStationEvent } from '@/features/railwayMapPage/types';
// FIXME
// eslint-disable-next-line import/no-cycle
import { ResTopologyEvent, TopologyNode } from '@/features/topologyPage/types';
import { WidgetAvailable } from '@/types/api/dashboard';
import {
  EventTypeEn,
  ResPaginationMeta,
  TopologyPathOfBranch,
} from '@/types/common';
import { WidgetDataOrder } from '@/types/enum';

export type LayoutItem = Layout & {
  data: WidgetAvailable & { id?: string };
};

export type LayoutItemWithId = Layout & {
  data: WidgetAvailable & { id: string };
};
export interface DashboardState {
  isLoading: boolean;
  isEditMode: boolean;
  isFullScreenMode: boolean;
  fullScreenTarget: HTMLDivElement | null;
  layoutItems: LayoutItemWithId[];
  droppingItem: { i: string; w: number; h: number } | undefined;
  resWidgets: ResWidget[];
  widgetData: Record<string, WidgetData>;
  selectOptions: {
    device: {
      isLoading: boolean;
      businessUnitList: ResBusinessUnitListItem[];
      stationList: ResStationListItem[];
      deviceList: ResDeviceListItem[];
      selectedValues: (string | number)[];
    };
    topology: {
      isLoading: boolean;
      pathOfTopology: TopologyPathOfBranch | undefined;
      topologyList: (TopologyDeviceOption & { businessUnitId: number })[];
      selectedValues: (string | number)[];
    };
    rackLayout: {
      isLoading: boolean;
      list: RackLayoutOption[];
    };
    railwayMap: {
      isLoading: boolean;
      list: RailwayMapOption[];
    };
  };
}

// export interface WidgetAvailable {
//   type: WidgetType;
//   title: string;
//   group: WidgetGroup;
//   dimension: Dimension;
//   thumbnail?: string;
//   apiUrl: string;
//   options: WidgetOptions;
// }

export interface WidgetOptions {
  updateInterval: UpdateInterval;
  rankCount?: RankCount;
  chartType?: ChartType;
  selectedMap?: number;
  selectedResource?: ResourceType;
  selectedDevice?: number;
  order?: WidgetDataOrder;
  dateRage?: string;
}

export interface ResWidget {
  widgetConf: WidgetOptions;
  seqNum: number;
  widgetId: number;
  actionUrl: string;
  widgetInfo: LayoutItemWithId;
}

export interface CommonWidgetData {
  id: string;
  type: WidgetType;
}

export type WidgetData = CommonWidgetData & {
  page?: ResPaginationMeta;
  faultcnt?: ResNumOfEvents[];
  faultList?:
    | ResEventStatus[]
    | ResEventStatusByDeviceType[]
    | ResNumOfEventsByDate[]
    | ResEventStatusByStation[]
    | ResStationRankingsByEvent[];
  rsrcCd?: ResourceType;
  usageUtil?: ResDeviceRankingsChartByResource[];
};

export type NumOfEventsWidgetData = ResNumOfEvents & CommonWidgetData;

export const isNumOfEventData = (
  data: WidgetData,
): data is NumOfEventsWidgetData => data.type === WidgetType.NumOfEvents;
export type EventStatusWidgetData = {
  faultList: ResEventStatus[];
  page: ResPaginationMeta;
} & CommonWidgetData;

export const isEventsStatusData = (
  data: WidgetData,
): data is EventStatusWidgetData => data.type === WidgetType.EventStatus;

export type EventTrendsWidgetData = {
  faultList: ResNumOfEventsByDate[];
} & CommonWidgetData;

export const isEventTrendsData = (
  data: WidgetData,
): data is EventTrendsWidgetData => data.type === WidgetType.EventTrends;

export type EventStatusByDeviceTypeWidgetData = {
  faultList: ResEventStatusByDeviceType[];
} & CommonWidgetData;

export const isEventStatusByDeviceTypeData = (
  data: WidgetData,
): data is EventStatusByDeviceTypeWidgetData =>
  data.type === WidgetType.EventStatusByDeviceType;

export type EventStatusByStationWidgetData = {
  faultList: ResEventStatusByStation[];
  page: ResPaginationMeta;
} & CommonWidgetData;

export const isEventStatusByStationData = (
  data: WidgetData,
): data is EventStatusByStationWidgetData =>
  data.type === WidgetType.EventStatusByStation;

export type DeviceRankingsByResourceWidgetData = {
  rsrcCd: ResourceType;
  usageUtil: ResDeviceRankingsChartByResource[];
} & CommonWidgetData;

export const isDeviceRankingsByResourceData = (
  data: WidgetData,
): data is DeviceRankingsByResourceWidgetData =>
  data.type === WidgetType.DeviceRankingsChartByResource ||
  data.type === WidgetType.DeviceRankingsListByResource;

export type StationRankingsByEventWidgetData = {
  faultList: ResStationRankingsByEvent[];
} & CommonWidgetData;

export const isStationRankingsByEventData = (
  data: WidgetData,
): data is StationRankingsByEventWidgetData =>
  data.type === WidgetType.StationRankingsByEvent;

export type DevicePerformanceTrendsWidgetData = Omit<
  ResPerfDeviceDetails,
  'memPerformanceList'
> & {
  memoryPerformanceList: ResPerfDeviceDetails['memPerformanceList'];
} & CommonWidgetData;

export const isDevicePerformanceTrendsData = (
  data: WidgetData,
): data is DevicePerformanceTrendsWidgetData =>
  data.type === WidgetType.DevicePerformanceTrends;

export type TopologyWidgetData = {
  dataNode: TopologyNode[];
  edgeNode: Edge[];
  topologyFaultList: ResTopologyEvent[];
  // widgetConf: {
  //   updtCycleCd: 300;
  //   seqNum: '1002';
  // };
} & CommonWidgetData;

export const isTopologyData = (data: WidgetData): data is TopologyWidgetData =>
  data.type === WidgetType.Topology;

interface RackDeviceNodeData {
  deviceTypeId: number;
  deviceTypeName: string;
  deviceImageId: number;
  deviceId: number;
  deviceName: string;
}

interface RackNodeData {
  label: string;
}

export type RackLayoutWidgetData = {
  dataNode: (Node<RackDeviceNodeData> | Node<RackNodeData>)[];
  widgetConf: {
    updtCycleCd: number;
    seqNum: string;
  };
  rackFaultList: Omit<ResTopologyEvent, 'managementYn'>[];
} & CommonWidgetData;

export const isRackLayoutData = (
  data: WidgetData,
): data is RackLayoutWidgetData => data.type === WidgetType.RackLayout;

export const isRackWidgetItemNode = (
  node: Node<RackDeviceNodeData> | Node<RackNodeData>,
): node is Node<RackDeviceNodeData> => node?.type === 'rackItem';

interface StationNodeData {
  stationName: string;
  stationId: string;
}

export type RailwayMapWidgetData = {
  dataNode: (Node | Node<StationNodeData>)[];
  lineMapFaultList: ResStationEvent[];
  widgetConf: {
    updtCycleCd: number;
    seqNum: string;
  };
} & CommonWidgetData;

export const isRailwayMapData = (
  data: WidgetData,
): data is RailwayMapWidgetData => data.type === WidgetType.RailwayMap;

export interface ResWidgetsWithData {
  resWidgets: ResWidget[];
  resWidgetData: (WidgetData | null)[];
}

export interface ResNumOfEvents {
  urgent: number;
  important: number;
  minor: number;
  total: number;
}

export interface ResEventStatus {
  NO: number;
  deviceKey: number;
  deviceNm: string;
  eventKey: number;
  eventLvNm: EventTypeEn;
  eventMsg: string;
  ocDate: string;
  stationNm: string;
}
export interface ResEventStatusByDeviceType {
  deviceNm: DeviceTypeDivision1;
  urgent: number;
  important: number;
  minor: number;
  total: number;
  manageTotalCnt: number;
}
export interface ResEventStatusByStation {
  stationNm: string;
  no: number;
  urgent: number;
  important: number;
  minor: number;
}

export interface ResNumOfEventsByDate {
  ocDate: string;
  urgent: number;
  important: number;
  minor: number;
}

export interface ResDeviceRankingsChartByResource {
  ranking: number;
  managementCd: string;
  managementNm: string;
  deviceKind: string;
  deviceKindNm: string;
  deviceKey: number;
  deviceNm: string;
  usageUtil: string;
}

export interface ResStationRankingsByEvent {
  important: number;
  minor: number;
  ranking: number;
  stationCd: string;
  stationNm: string;
  total: number;
  urgent: number;
}

export interface ResBusinessUnitListItem {
  managementCd: number;
  managementNm: string;
  isLeaf: false;
}
export interface ResStationListItem {
  stationCd: string;
  stationNm: string;
  parentId: number;
  isLeaf: false;
}
export interface ResDeviceListItem {
  deviceKey: number;
  deviceNm: string;
  parentId: string;
  isLeaf: true;
}

export interface DeviceSelectOptions {
  label: string;
  value: number | string;
  isLeaf: boolean;
  children?: DeviceSelectOptions[];
}

export interface TopologyDeviceOption {
  key: number;
  topologyNm: string;
}
export interface RackLayoutOption {
  key: number;
  rackNm: string;
}
export interface RailwayMapOption {
  key: number;
  lineNm: string;
}

export enum UpdateInterval {
  Min2 = 120,
  Min5 = 300,
  Min10 = 600,
  Min30 = 1800,
}

export enum WidgetType {
  NumOfEvents = 1,
  EventStatus = 3,
  EventTrends = 4,
  EventStatusByDeviceType = 6,
  StationRankingsByEvent = 2,
  EventStatusByStation = 5,
  Topology = 7,
  RailwayMap = 8,
  RackLayout = 9,
  DeviceRankingsChartByResource = 10,
  DeviceRankingsListByResource = 11,
  DevicePerformanceTrends = 12,
}

export enum WidgetGroup {
  Issue = 1,
  Operation = 2,
  Performance = 3,
}

export enum RankCount {
  Top5 = 0,
  Top10 = 1,
}

export enum ChartType {
  Pie = 0,
  Line = 2,
  FilledLine = 4,
  HorizontalBar = 3,
  VerticalBar = 1,
}

export enum ResourceType {
  Cpu = 0,
  Memory = 1,
  Disk = 2,
  Inbound = 3,
  Outbound = 4,
}

// export enum Order {
//   StationNum = 0,
//   NumOfEvents = 1,
// }

export enum DateRange {
  Today = 'today',
  ThisWeek = 'thisWeek',
  ThisMonth = 'thisMonth',
  CustomRange = 'customRange',
}

export enum DeviceTypeDivision1 {
  Server = '서버',
  Network = '네트워크 장비',
  Sensor = '센서',
  Camera = '단말류',
  Etc = '기타',
}

export enum DeviceTypeDivision2 {
  Server = 'server',
  VideoServer = 'videoServer',
  L3Switch = 'l3Switch',
  L2Switch = 'l2Switch',
  Hub = 'Hub',
  Sensor = 'sensor',
  Camera = 'camera',
  Etc = 'etc',
  Firewall = 'firewall',
}
