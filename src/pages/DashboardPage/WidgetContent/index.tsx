import { useMemo } from 'react';
import { ReactFlowProvider } from 'reactflow';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
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
  stationRankingsByEventWidgetDataSchema,
  topologyWidgetDataSchema,
  unregisteredPhoneListWidgetDataSchema,
  unregisteredPhonesByTypeWidgetDataSchema,
} from '@/services/validation/dashboard';
import { LayoutItem } from '@/types/api/dashboard';
import { WidgetType } from '@/types/enum';
import CallPeakTrends from './CallPeakTrends';
import DevicePerformanceTrends from './DevicePerformanceTrends';
import DeviceRankingsChartByResource from './DeviceRankingsChartByResource';
import DeviceRankingsListByResource from './DeviceRankingsListByResource';
import EnvironmentalFactors from './EnvironmentalFactors';
import EventStatus from './EventStatus';
import EventStatusByDeviceType from './EventStatusByDeviceType';
import EventStatusByDeviceTypes from './EventStatusByDeviceTypes';
import EventStatusByStation from './EventStatusByStation';
import EventTrends from './EventTrends';
import HrInfoUpdateTime from './HrInfoUpdateTime';
import LiveCallTrends from './LiveCallTrends';
import MapView from './MapView';
import NumOfEvents from './NumOfEvents';
import RackLayout from './RackLayout';
import StationRankingsByEvent from './StationRankingsByEvent';
import Topology from './Topology';
import UnregisteredPhoneList from './UnregisteredPhoneList';
import UnregisteredPhonesByType from './UnregisteredPhonesByType';

interface Props {
  data: LayoutItem['data'];
}

// 위젯 타입에 따라 해당 위젯을 렌더링
// `data` prop은 grid layout 데이터를 담고 있고, 각 위젯에서 보여주는 데이터는 해당 위젯 안에서 api 호출하여 가져옴
const WidgetContent = ({ data }: Props) => {
  const content = useMemo(() => {
    try {
      switch (data.type) {
        // 장애 개수
        case WidgetType.NumOfEvents: {
          const parsedWidgetData = numOfEventsWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <NumOfEvents data={parsedWidgetData.data} />;
        }
        // 장애발생 지역별 순위
        case WidgetType.StationRankingsByEvent: {
          const parsedWidgetData =
            stationRankingsByEventWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <StationRankingsByEvent data={parsedWidgetData.data} />;
        }
        // 장애 현황
        case WidgetType.EventStatus: {
          const parsedWidgetData = eventStatusWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <EventStatus data={parsedWidgetData.data} />;
        }
        // 장애발생 추이
        case WidgetType.EventTrends: {
          const parsedWidgetData = eventTrendsWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <EventTrends data={parsedWidgetData.data} />;
        }
        // 소속별 장애 현황
        case WidgetType.EventStatusByStation: {
          const parsedWidgetData =
            eventStatusByStationWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <EventStatusByStation data={parsedWidgetData.data} />;
        }
        // 장비종류별 장애 현황
        case WidgetType.EventStatusByDeviceTypes: {
          const parsedWidgetData =
            eventStatusByDeviceTypesWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <EventStatusByDeviceTypes data={parsedWidgetData.data} />;
        }
        // 토폴로지
        case WidgetType.Topology: {
          const parsedWidgetData = topologyWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <ReactFlowProvider>
              <Topology data={parsedWidgetData.data} />
            </ReactFlowProvider>
          );
        }
        // 자원 사용률 순위 - 차트
        case WidgetType.DeviceRankingsChartByResource: {
          const parsedWidgetData =
            deviceRankingsChartByResourceWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <DeviceRankingsChartByResource data={parsedWidgetData.data} />;
        }
        // 자원 사용률 순위 - 리스트
        case WidgetType.DeviceRankingsListByResource: {
          const parsedWidgetData =
            deviceRankingsListByResourceWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <DeviceRankingsListByResource data={parsedWidgetData.data} />;
        }
        // 장비 성능
        case WidgetType.DevicePerformanceTrends: {
          const parsedWidgetData =
            devicePerformanceTrendsWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <DevicePerformanceTrends data={parsedWidgetData.data} />;
        }
        // 랙실장도
        case WidgetType.RackLayout: {
          const parsedWidgetData = rackLayoutWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <ReactFlowProvider>
              <RackLayout data={parsedWidgetData.data} />
            </ReactFlowProvider>
          );
        }
        // 맵현황
        case WidgetType.MapView: {
          const parsedWidgetData = mapViewWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <ReactFlowProvider>
              <MapView data={parsedWidgetData.data} />
            </ReactFlowProvider>
          );
        }
        // 온/습도
        case WidgetType.EnvironmentalFactors: {
          const parsedWidgetData =
            environmentalFactorsWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <EnvironmentalFactors data={parsedWidgetData.data} />;
        }
        // 인사정보 업데이트 시간
        case WidgetType.HrInfoUpdateTime: {
          const parsedWidgetData =
            hrInfoUpdateTimeWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <HrInfoUpdateTime data={parsedWidgetData.data} />;
        }
        // 통화 Peak 추이
        case WidgetType.CallPeakTrends: {
          const parsedWidgetData =
            callPeakTrendsWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <CallPeakTrends data={parsedWidgetData.data} />;
        }
        // 현재 통화 추이
        case WidgetType.LiveCallTrends: {
          const parsedWidgetData =
            liveCallTrendsWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <LiveCallTrends data={parsedWidgetData.data} />;
        }
        // 미등록 전화기 현황
        case WidgetType.UnregisteredPhoneList: {
          const parsedWidgetData =
            unregisteredPhoneListWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <UnregisteredPhoneList data={parsedWidgetData.data} />;
        }
        // 전화기 종류 별 미등록 정보
        case WidgetType.UnregisteredPhonesByType: {
          const parsedWidgetData =
            unregisteredPhonesByTypeWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <UnregisteredPhonesByType data={parsedWidgetData.data} />;
        }
        // 개별 장비종류별 장애 현황
        case WidgetType.EventStatusByDeviceType: {
          const parsedWidgetData =
            eventStatusByDeviceTypeWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <EventStatusByDeviceType data={parsedWidgetData.data} />;
        }

        default: {
          console.error('위젯 종류를 식별할 수 없습니다.', data);
          return <ErrorMessage>위젯 종류를 식별할 수 없습니다.</ErrorMessage>;
        }
      }
    } catch (error) {
      console.error('위젯 데이터에 오류가 발견되었습니다.', error, data);
      return <ErrorMessage>위젯 데이터에 오류가 발견되었습니다.</ErrorMessage>;
    }
  }, [data]);

  return content;
};

export default WidgetContent;
