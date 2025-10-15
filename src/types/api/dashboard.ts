import { Layout } from 'react-grid-layout';
import { z } from 'zod';
import {
  callPeakTrendsWidgetDataSchema,
  devicePerformanceTrendsWidgetDataSchema,
  deviceRankingsChartByResourceWidgetDataSchema,
  deviceRankingsListByResourceWidgetDataSchema,
  environmentalFactorsWidgetDataSchema,
  eventStatusByDeviceTypeWidgetDataSchema,
  eventStatusByDeviceTypesWidgetDataSchema,
  eventStatusByStationWidgetDataSchema,
  eventStatusWidgetDataSchema,
  eventTrendsWidgetDataSchema,
  hrInfoUpdateTimeWidgetDataSchema,
  liveCallTrendsWidgetDataSchema,
  mapViewWidgetDataSchema,
  numOfEventsWidgetDataSchema,
  rackLayoutWidgetDataSchema,
  resCallPeakTrendsDataSchema,
  resDashboardWidgetsSchema,
  resDeviceListByDeviceTypeSchema,
  resDevicePerformanceTrendsDataSchema,
  resDeviceRankingsByResourceDataSchema,
  resEnvironmentalFactorsDataSchema,
  resEventStatusByDeviceTypeDataSchema,
  resEventStatusByDeviceTypesDataSchema,
  resEventStatusByStationDataSchema,
  resEventStatusDataSchema,
  resEventTrendsDataSchema,
  resHrInfoUpdateTimeDataSchema,
  resLiveCallTrendsDataSchema,
  resMapViewDataSchema,
  resNumOfEventsDataSchema,
  resRackLayoutDataSchema,
  resStationRankingsByEventDataSchema,
  resUnregisteredPhoneListDataSchema,
  resUnregisteredPhonesByTypeDataSchema,
  resWidgetConfSchema,
  resWidgetSchema,
  resWidgetTemplateListSchema,
  stationRankingsByEventWidgetDataSchema,
  topologyWidgetDataSchema,
  unregisteredPhoneListWidgetDataSchema,
  unregisteredPhonesByTypeWidgetDataSchema,
  widgetAvailableSchema,
  widgetLayoutSchema,
  widgetOptionsSchema,
} from '@/services/validation/dashboard';
import { ResTopologyMapContent } from './topology';

export type ResDeviceListByDeviceType = z.infer<
  typeof resDeviceListByDeviceTypeSchema
>;

export type ResWidgetTemplateList = z.infer<typeof resWidgetTemplateListSchema>;
export type ResWidgetConf = z.infer<typeof resWidgetConfSchema>;
export type ResWidget = z.infer<typeof resWidgetSchema>;
export type ResDashboardWidgets = z.infer<typeof resDashboardWidgetsSchema>;

export type WidgetOption = z.infer<typeof widgetOptionsSchema>;
export type WidgetAvailable = z.infer<typeof widgetAvailableSchema>;
export type WidgetLayout = z.infer<typeof widgetLayoutSchema>;

export type ResWidgetData =
  | ResNumOfEventsData
  | ResStationRankingsByEventData
  | ResEventStatusData
  | ResEventTrendsData
  | ResEventStatusByStationData
  | ResEventStatusByDeviceTypesData
  | ResTopologyMapContent
  | ResMapViewData
  | ResRackLayoutData
  | ResDeviceRankingsByResourceData
  | ResDevicePerformanceTrendsData;

export type ResNumOfEventsData = z.infer<typeof resNumOfEventsDataSchema>;
export type ResStationRankingsByEventData = z.infer<
  typeof resStationRankingsByEventDataSchema
>;
export type ResEventStatusData = z.infer<typeof resEventStatusDataSchema>;
export type ResEventTrendsData = z.infer<typeof resEventTrendsDataSchema>;
export type ResEventStatusByStationData = z.infer<
  typeof resEventStatusByStationDataSchema
>;
export type ResEventStatusByDeviceTypesData = z.infer<
  typeof resEventStatusByDeviceTypesDataSchema
>;

export type ResMapViewData = z.infer<typeof resMapViewDataSchema>;
export type ResRackLayoutData = z.infer<typeof resRackLayoutDataSchema>;
export type ResDeviceRankingsByResourceData = z.infer<
  typeof resDeviceRankingsByResourceDataSchema
>;
export type ResDevicePerformanceTrendsData = z.infer<
  typeof resDevicePerformanceTrendsDataSchema
>;
export type ResEnvironmentalFactorsData = z.infer<
  typeof resEnvironmentalFactorsDataSchema
>;
export type ResHrInfoUpdateTimeData = z.infer<
  typeof resHrInfoUpdateTimeDataSchema
>;
export type ResCallPeakTrendsData = z.infer<typeof resCallPeakTrendsDataSchema>;
export type ResLiveCallTrendsData = z.infer<typeof resLiveCallTrendsDataSchema>;
export type ResUnregisteredPhoneListData = z.infer<
  typeof resUnregisteredPhoneListDataSchema
>;
export type ResUnregisteredPhonesByTypeData = z.infer<
  typeof resUnregisteredPhonesByTypeDataSchema
>;
export type ResEventStatusByDeviceTypeData = z.infer<
  typeof resEventStatusByDeviceTypeDataSchema
>;

export type LayoutItem = Layout & {
  data: WidgetAvailable & {
    id: string;
  };
};

export type GetWidgetDataDefaultArgs = {
  apiUrl: LayoutItem['data']['apiUrl'];
  type: LayoutItem['data']['type'];
  id: LayoutItem['data']['id'];
};

export type WidgetOptions = z.infer<typeof widgetOptionsSchema>;

export type NumOfEventsWidgetData = z.infer<typeof numOfEventsWidgetDataSchema>;
export type StationRankingsByEventWidgetData = z.infer<
  typeof stationRankingsByEventWidgetDataSchema
>;
export type EventStatusWidgetData = z.infer<typeof eventStatusWidgetDataSchema>;
export type EventTrendsWidgetData = z.infer<typeof eventTrendsWidgetDataSchema>;
export type EventStatusByStationWidgetData = z.infer<
  typeof eventStatusByStationWidgetDataSchema
>;
export type EventStatusByDeviceTypesWidgetData = z.infer<
  typeof eventStatusByDeviceTypesWidgetDataSchema
>;
export type TopologyWidgetData = z.infer<typeof topologyWidgetDataSchema>;
export type MapViewWidgetData = z.infer<typeof mapViewWidgetDataSchema>;
export type RackLayoutWidgetData = z.infer<typeof rackLayoutWidgetDataSchema>;
export type DeviceRankingsChartByResourceWidgetData = z.infer<
  typeof deviceRankingsChartByResourceWidgetDataSchema
>;
export type DeviceRankingsListByResourceWidgetData = z.infer<
  typeof deviceRankingsListByResourceWidgetDataSchema
>;
export type DevicePerformanceTrendsWidgetData = z.infer<
  typeof devicePerformanceTrendsWidgetDataSchema
>;
export type EnvironmentalFactorsWidgetData = z.infer<
  typeof environmentalFactorsWidgetDataSchema
>;
export type HrInfoUpdateTimeWidgetData = z.infer<
  typeof hrInfoUpdateTimeWidgetDataSchema
>;
export type CallPeakTrendsWidgetData = z.infer<
  typeof callPeakTrendsWidgetDataSchema
>;
export type LiveCallTrendsWidgetData = z.infer<
  typeof liveCallTrendsWidgetDataSchema
>;
export type UnregisteredPhoneListWidgetData = z.infer<
  typeof unregisteredPhoneListWidgetDataSchema
>;
export type UnregisteredPhonesByTypeWidgetData = z.infer<
  typeof unregisteredPhonesByTypeWidgetDataSchema
>;
export type EventStatusByDeviceTypeWidgetData = z.infer<
  typeof eventStatusByDeviceTypeWidgetDataSchema
>;
