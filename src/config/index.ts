import dayjs from 'dayjs';
import { CustomMap } from '@/types/common';
import {
  CallPeakType,
  ChartType,
  DeviceType,
  EventLv,
  LiveCallType,
  RankCount,
  ResourceType,
  UpdateInterval,
  UpdateIntervalShort,
  WidgetDataOrder,
  WidgetListType,
  WidgetType,
} from '@/types/enum';

// 이미지 경로
export const IMAGE_PATHS: {
  topology: CustomMap;
  widgets: CustomMap;
  rackLayout: CustomMap;
} = Object.freeze({
  widgets: {
    oneByOne: '/assets/images/thumbnails/widget-1x1.png',
    oneByTwo: '/assets/images/thumbnails/widget-1x2.png',
    twoByOne: '/assets/images/thumbnails/widget-2x1.png',
    threeByTwo: '/assets/images/thumbnails/widget-3x2.png',
    threeByThree: '/assets/images/thumbnails/widget-3x3.png',
  },
  topology: {
    11: '/assets/images/topology/서버-서버.png',
    12: '/assets/images/topology/서버-영상분석서버.png',
    21: '/assets/images/topology/네트워크-L2.png',
    22: '/assets/images/topology/네트워크-L3.png',
    23: '/assets/images/topology/네트워크-L4.png',
    31: '/assets/images/topology/센서.png',
    41: '/assets/images/topology/카메라.png',
    91: '/assets/images/topology/기타.png',
    92: '/assets/images/topology/기타.png',
    fallback: '/assets/images/topology/기타.png',
  },
  rackLayout: {
    rack: '/assets/images/rackLayout/rack-none.png',
    rackItem: '/assets/images/rackLayout/rack-item.png',
  },
});

// 위젯 타입별 링크
export const WIDGET_LINK = Object.freeze({
  [WidgetType.NumOfEvents]: { link: '/events', linkTitle: '장애' },
  [WidgetType.EventStatus]: { link: '/events', linkTitle: '장애' },
  [WidgetType.EventTrends]: { link: '/events', linkTitle: '장애' },
  [WidgetType.EventStatusByDeviceTypes]: {
    link: '/events',
    linkTitle: '장애',
  },
  [WidgetType.StationRankingsByEvent]: { link: '/events', linkTitle: '장애' },
  [WidgetType.EventStatusByStation]: { link: '/events', linkTitle: '장애' },
  [WidgetType.Topology]: { link: '/topology', linkTitle: '토폴로지' },
  [WidgetType.MapView]: { link: '/map-view', linkTitle: '맵현황' },
  [WidgetType.RackLayout]: { link: '/rack-layout', linkTitle: '랙실장도' },
  [WidgetType.DeviceRankingsChartByResource]: {
    link: '/config-perf',
    linkTitle: '구성/성능',
  },
  [WidgetType.DeviceRankingsListByResource]: {
    link: '/config-perf',
    linkTitle: '구성/성능',
  },
  [WidgetType.DevicePerformanceTrends]: {
    link: '/config-perf',
    linkTitle: '구성/성능',
  },
  [WidgetType.EnvironmentalFactors]: {
    link: '/config-perf',
    linkTitle: '구성/성능',
  },
  [WidgetType.HrInfoUpdateTime]: {
    link: '/config-perf',
    linkTitle: '구성/성능',
  },
  [WidgetType.CallPeakTrends]: {
    link: '/telephone-exchange',
    linkTitle: '교환기',
  },
  [WidgetType.LiveCallTrends]: {
    link: '/telephone-exchange',
    linkTitle: '교환기',
  },
  [WidgetType.UnregisteredPhoneList]: {
    link: '/telephone-exchange',
    linkTitle: '교환기',
  },
  [WidgetType.UnregisteredPhonesByType]: {
    link: '/telephone-exchange',
    linkTitle: '교환기',
  },
  [WidgetType.EventStatusByDeviceType]: {
    link: '/events',
    linkTitle: '장애',
  },
});

export const WIDGET_SELECT_OPTIONS = Object.freeze({
  updateInterval: {
    label: '갱신주기',
    options: [
      { value: UpdateInterval.Min2, label: '2분' },
      { value: UpdateInterval.Min5, label: '5분' },
      { value: UpdateInterval.Min10, label: '10분' },
      { value: UpdateInterval.Min30, label: '30분' },
    ],
  },
  updateIntervalShort: {
    label: '갱신주기',
    options: Object.entries(UpdateIntervalShort)
      .filter(([key]) => Number.isNaN(Number(key)))
      .map(([label, value]) => ({
        label,
        value,
      })),
  },
  rankCount: {
    label: '표시개수',
    options: [
      { value: RankCount.Top5, label: 'Top 5' },
      { value: RankCount.Top10, label: 'Top 10' },
    ],
  },
  chartType: {
    label: '차트종류',
    options: [
      { value: ChartType.Pie, label: '원형' },
      { value: ChartType.Line, label: '선형' },
      { value: ChartType.HorizontalBar, label: '가로막대형' },
      { value: ChartType.VerticalBar, label: '세로막대형' },
    ],
  },
  order: {
    label: '정렬순서',
    options: [
      { value: WidgetDataOrder.NumOfEvents, label: '장애수' },
      { value: WidgetDataOrder.StationNum, label: '소속' },
    ],
  },
  selectedResource: {
    label: '자원종류',
    options: [
      {
        value: ResourceType.Cpu,
        label: 'CPU',
      },
      {
        value: ResourceType.Memory,
        label: 'Memory',
      },
      {
        value: ResourceType.Disk,
        label: 'Disk',
      },
      {
        value: ResourceType.Traffic,
        label: 'Traffic',
      },
    ],
  },
  deviceTypes: {
    label: '장비종류',
    options: [
      {
        value: DeviceType.Server,
        label: '서버',
      },
      {
        value: DeviceType.Network,
        label: '네트워크 장비',
      },
      {
        value: DeviceType.Sensor,
        label: '센서',
      },
      {
        value: DeviceType.Terminal,
        label: '단말류',
      },
      {
        value: DeviceType.Etc,
        label: '기타',
      },
    ],
  },
  eventTypes: {
    label: '장애유형',
    options: [
      { value: EventLv.Urgent, label: '긴급' },
      { value: EventLv.Important, label: '중요' },
      { value: EventLv.Minor, label: '일반' },
    ],
  },
  listType: {
    label: '목록종류',
    options: [
      { value: WidgetListType.Cards, label: '카드' },
      { value: WidgetListType.Table, label: '표' },
    ],
  },
  callPeakTypes: {
    label: '통화종류',
    options: Object.entries(CallPeakType)
      .filter(([key]) => Number.isNaN(Number(key)))
      .map(([label, value]) => ({
        label,
        value,
      })),
  },
  liveCallTypes: {
    label: '통화종류',
    options: Object.entries(LiveCallType)
      .filter(([key]) => Number.isNaN(Number(key)))
      .map(([label, value]) => ({
        label,
        value,
      })),
  },
});

export const QUERY_TAG_IDS = {
  Dashboard: {
    Type: 'Dashboard',
    DefaultWidgetList: 'DEFAULT_WIDGET_LIST',
    WidgetList: 'WIDGET_LIST',
  },
  Topology: {
    Type: 'Topology',
    TopologyMapList: 'TOPOLOGY_MAP_LIST',
    TopologyMapContent: 'TOPOLOGY_MAP_CONTENT',
    DeviceListByType: 'DEVICE_LIST_BY_TYPE',
  },
  Common: {
    Type: 'Common',
    ParentBranchList: 'PARENT_BRANCH_LIST',
    DeviceTypeDepthList: 'DEVICE_TYPE_DEPTH_LIST',
    DeviceTypeList: 'DEVICE_TYPE_LIST',
    DeviceTypesByDepth: 'DEVICE_TYPES_BY_DEPTH',
    DeviceTypesByDepths: 'DEVICE_TYPES_BY_DEPTHS',
    DeviceListByDeviceType: 'DEVICE_LIST_BY_DEVICE_TYPE',
    LatestTemperatureData: 'LATEST_TEMPERATURE_DATA',
  },
  ConfigPerf: {
    Type: 'ConfigPerf',
    DevicesByFilter: 'DEVICES_BY_FILTER',
    DeviceDetails: 'DEVICE_DETAILS',
    PortList: 'PORT_LIST',
    CpuPerfInfoByDevice: 'CPU_PERF_INFO_BY_DEVICE',
    MemoryPerfInfoByDevice: 'MEMORY_PERF_INFO_BY_DEVICE',
    DiskPerfInfoByDevice: 'DISK_PERF_INFO_BY_DEVICE',
    PortPerfInfoByDevice: 'PORT_PERF_INFO_BY_DEVICE',
    ProcessesByFilter: 'PROCESSES_BY_FILTER',
    ProcessDetails: 'PROCESS_DETAILS',
  },
  Events: {
    Type: 'Events',
    EventComment: 'EVENT_COMMENT',
    NumOfUnresolvedEvents: 'NUM_OF_UNRESOLVED_EVENTS',
    TodayHourlyUnresolvedEventCounts: 'TODAY_HOURLY_UNRESOLVED_EVENT_COUNTS',
    DailyUnresolvedEventCountsByDateRange:
      'DAILY_UNRESOLVED_EVENT_COUNTS_BY_DATE_RANGE',
    DeviceRankingsByUnresolvedEvent: 'DEVICE_RANKINGS_BY_UNRESOLVED_EVENT',
    UnresolvedEventsByFilters: 'UNRESOLVED_EVENTS_BY_FILTERS',
    NumOfEvents: 'NUM_OF_EVENTS',
    TodayHourlyEventCounts: 'TODAY_HOURLY_EVENT_COUNTS',
    DailyEventCountsByDateRange: 'DAILY_EVENT_COUNTS_BY_DATE_RANGE',
    DeviceRankingsByEvent: 'DEVICE_RANKINGS_BY_EVENT',
    EventsByFilters: 'EVENTS_BY_FILTERS',
  },
  RackLayout: {
    Type: 'RackLayout',
    RackLayoutMapList: 'RACK_LAYOUT_MAP_LIST',
    RackLayoutMapContent: 'RACK_LAYOUT_MAP_CONTENT',
    RackLayoutDeviceList: 'RACK_LAYOUT_DEVICE_LIST',
    RackLayoutDeviceImages: 'RACK_LAYOUT_DEVICE_IMAGES',
  },
  MapView: {
    Type: 'MapView',
    MapViewContent: 'MAP_VIEW_CONTENT',
  },
  TelephoneExchange: {
    Type: 'TelephoneExchange',
    UnregisteredPhonesByFilter: 'UNREGISTERED_PHONES_BY_FILTER',
    UnregisteredPhoneDetails: 'UNREGISTERED_PHONE_DETAILS',
    CurrentCallTrend: 'CURRENT_CALL_TREND',
    CallPeakTrend: 'CALL_PEAK_TREND',
    PhoneCount: 'PHONE_COUNT',
  },
  Settings: {
    Type: 'Settings',
    ManagementList: 'MANAGEMENT_LIST',
    ManagementDetails: 'MANAGEMENT_DETAILS',
    DeviceTypesByDepth: 'DEVICE_TYPES_BY_DEPTH',
    DeviceList: 'DEVICE_LIST',
    DeviceDetails: 'DEVICE_DETAILS',
    TerminalList: 'TERMINAL_LIST',
    TerminalDetails: 'TERMINAL_DETAILS',
    L2SwitchList: 'L2_SWITCH_LIST',
    PortKeyList: 'PORT_KEY_LIST',
    PhoneList: 'PHONE_LIST',
    PhoneDetails: 'PHONE_DETAILS',
    PhoneTypeList: 'PHONE_TYPE_LIST',
    EventList: 'EVENT_LIST',
    EventDetails: 'EVENT_DETAILS',
    AudioList: 'AUDIO_LIST',
    AudioDetails: 'AUDIO_DETAILS',
    ThresholdList: 'THRESHOLD_LIST',
    ThresholdDetails: 'THRESHOLD_DETAILS',
    RoleList: 'ROLE_LIST',
    RoleGroupList: 'ROLE_GROUP_LIST',
    RoleDetails: 'ROLE_DETAILS',
    UserList: 'USER_LIST',
    UserDetails: 'USER_DETAILS',
    ValidateUserId: 'VALIDATE_USER_ID',
    DeviceManagerList: 'DEVICE_MANAGER_LIST',
    DeviceManagerListAll: 'DEVICE_MANAGER_LIST_ALL',
    DeviceManagerDetails: 'DEVICE_MANAGER_DETAILS',
    ManualList: 'MANUAL_LIST',
    ManualDetails: 'MANUAL_DETAILS',
    ProcessList: 'PROCESS_LIST',
    ProcessDetails: 'PROCESS_DETAILS',
    SshDeviceList: 'SSH_DEVICE_LIST',
    InspectionList: 'INSPECTION_LIST',
    InspectionDetails: 'INSPECTION_DETAILS',
  },
} as const;

export const NONE_SELECTED = -1;
export const ALL_ITEMS_SELECTED = [0] as const;
export const ALL_EVENT_TYPES_SELECTED = [1, 2, 3] as const;

export const WIDGET_CONFIG = {
  cols: 6,
  rows: 4,
  gap: 16,
  headerHeight: 50,
  contentPadding: 16,
} as const;

// 차트 기본 높이
export const DEFAULT_CHART_HEIGHT = '156px';

// 날짜 포맷
export const YEAR_DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_SHORT_FORMAT = 'MM/DD';
export const YEAR_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIME_LONG_FORMAT = 'HH:mm:ss';

// 어제 날짜 범위
export const RANGE_FROM_YESTERDAY: [dayjs.Dayjs, dayjs.Dayjs] = [
  dayjs().subtract(1, 'day'),
  dayjs(),
];

// 7일 날짜 범위
export const RANGE_FROM_7DAYS: [dayjs.Dayjs, dayjs.Dayjs] = [
  dayjs().subtract(6, 'day'),
  dayjs(),
];

// 노선도 맵 ID
export const RAILWAY_MAP_ID = 1001;

export const EVENT_TYPES_EN = ['urgent', 'important', 'minor'] as const;

// 트리 최대 깊이
export const TREE_MAX_DEPTH = 3;
