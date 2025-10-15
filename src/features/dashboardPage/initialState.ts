import { WidgetDataOrder } from '@/types/enum';
import {
  ChartType,
  DashboardState,
  RankCount,
  ResourceType,
  UpdateInterval,
} from './types';

export const longUpdateInterval = [
  { value: 300, label: '5분' },
  { value: 600, label: '10분' },
  { value: 1200, label: '20분' },
  { value: 1800, label: '30분' },
];

export const widgetSelectOptions = {
  updateInterval: {
    label: '업데이트 주기',
    options: [
      { value: UpdateInterval.Min2, label: '2분' },
      { value: UpdateInterval.Min5, label: '5분' },
      { value: UpdateInterval.Min10, label: '10분' },
      { value: UpdateInterval.Min30, label: '30분' },
    ],
  },
  rankCount: {
    label: '표시 개수',
    options: [
      { value: RankCount.Top5, label: 'Top 5' },
      { value: RankCount.Top10, label: 'Top 10' },
    ],
  },
  chartType: {
    label: '표시 형태',
    options: [
      { value: ChartType.Pie, label: '원형' },
      { value: ChartType.Line, label: '선형' },
      { value: ChartType.HorizontalBar, label: '가로막대형' },
      { value: ChartType.VerticalBar, label: '세로막대형' },
    ],
  },
  order: {
    label: '정렬 순서',
    options: [
      { value: WidgetDataOrder.NumOfEvents, label: '장애수' },
      { value: WidgetDataOrder.StationNum, label: '역사번호' },
    ],
  },
  selectedResource: {
    label: '자원',
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
        value: ResourceType.Inbound,
        label: 'Inbound',
      },
      {
        value: ResourceType.Outbound,
        label: 'Outbound',
      },
    ],
  },
};

export const initialState: DashboardState = {
  isLoading: false,
  isEditMode: false,
  isFullScreenMode: false,
  fullScreenTarget: null,
  layoutItems: [],
  droppingItem: undefined,
  resWidgets: [],
  widgetData: {},
  selectOptions: {
    device: {
      isLoading: false,
      businessUnitList: [],
      stationList: [],
      deviceList: [],
      selectedValues: [],
    },
    topology: {
      isLoading: false,
      pathOfTopology: undefined,
      topologyList: [],
      selectedValues: [],
    },
    rackLayout: {
      isLoading: false,
      list: [],
    },
    railwayMap: {
      isLoading: false,
      list: [],
    },
  },
};
