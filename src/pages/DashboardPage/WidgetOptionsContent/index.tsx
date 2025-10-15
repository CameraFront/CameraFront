import { useMemo } from 'react';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
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
import CallPeakTrendsOptions from './CallPeakTrendsOptions';
import DevicePerformanceTrendsOptions from './DevicePerformanceTrendsOptions';
import DeviceRankingsChartByResourceOptions from './DeviceRankingsChartByResourceOptions';
import DeviceRankingsListByResourceOptions from './DeviceRankingsListByResourceOptions';
import EnvironmentalFactorsOptions from './EnvironmentalFactorsOptions';
import EventStatusByDeviceTypeOptions from './EventStatusByDeviceTypeOptions';
import EventStatusByDeviceTypesOptions from './EventStatusByDeviceTypesOptions';
import EventStatusByStationOptions from './EventStatusByStationOptions';
import EventStatusOptions from './EventStatusOptions';
import EventTrendsOptions from './EventTrendsOptions';
import HrInfoUpdateTimeOptions from './HrInfoUpdateTimeOptions';
import LiveCallTrendsOptions from './LiveCallTrendsOptions';
import MapViewOptions from './MapViewOptions';
import NumOfEventsOptions from './NumOfEventsOptions';
import RackLayoutOptions from './RackLayoutOptions';
import StationRankingsByEventOptions from './StationRankingsByEventOptions';
import TopologyOptions from './TopologyOptions';
import UnregisteredPhoneListOptions from './UnregisteredPhoneListOptions';
import UnregisteredPhonesByTypeOptions from './UnregisteredPhonesByTypeOptions';

interface Props {
  id: string;
  data: LayoutItem['data'];
}

// WidgetContent에서 이미 validation을 거쳤기 때문에 여기서는 따로 validation을 하지 않아도 됨. but type narrowing을 위해 넣은 것.
const WidgetOptionsContent = ({ id, data }: Props) => {
  const optionsContent = useMemo(() => {
    try {
      switch (data.type) {
        // 장애 개수
        case WidgetType.NumOfEvents: {
          const parsedWidgetData = numOfEventsWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <NumOfEventsOptions id={id} data={parsedWidgetData.data} />;
        }
        // 장애발생 지역별 순위
        case WidgetType.StationRankingsByEvent: {
          const parsedWidgetData =
            stationRankingsByEventWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <StationRankingsByEventOptions
              id={id}
              data={parsedWidgetData.data}
            />
          );
        }
        // 장애 현황
        case WidgetType.EventStatus: {
          const parsedWidgetData = eventStatusWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <EventStatusOptions id={id} data={parsedWidgetData.data} />;
        }
        // 장애발생 추이
        case WidgetType.EventTrends: {
          const parsedWidgetData = eventTrendsWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <EventTrendsOptions id={id} data={parsedWidgetData.data} />;
        }
        // 소속별 장애 현황
        case WidgetType.EventStatusByStation: {
          const parsedWidgetData =
            eventStatusByStationWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <EventStatusByStationOptions id={id} data={parsedWidgetData.data} />
          );
        }
        // 장비종류별 장애 현황
        case WidgetType.EventStatusByDeviceTypes: {
          const parsedWidgetData =
            eventStatusByDeviceTypesWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <EventStatusByDeviceTypesOptions
              id={id}
              data={parsedWidgetData.data}
            />
          );
        }
        // 토폴로지
        case WidgetType.Topology: {
          const parsedWidgetData = topologyWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <TopologyOptions id={id} data={parsedWidgetData.data} />;
        }
        // 맵현황
        case WidgetType.MapView: {
          const parsedWidgetData = mapViewWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <MapViewOptions id={id} data={parsedWidgetData.data} />;
        }
        // 랙실장도
        case WidgetType.RackLayout: {
          const parsedWidgetData = rackLayoutWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <RackLayoutOptions id={id} data={parsedWidgetData.data} />;
        }
        // 자원 사용률 순위 - 차트
        case WidgetType.DeviceRankingsChartByResource: {
          const parsedWidgetData =
            deviceRankingsChartByResourceWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <DeviceRankingsChartByResourceOptions
              id={id}
              data={parsedWidgetData.data}
            />
          );
        }
        // 자원 사용률 순위 - 리스트
        case WidgetType.DeviceRankingsListByResource: {
          const parsedWidgetData =
            deviceRankingsListByResourceWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <DeviceRankingsListByResourceOptions
              id={id}
              data={parsedWidgetData.data}
            />
          );
        }
        // 장비 성능
        case WidgetType.DevicePerformanceTrends: {
          const parsedWidgetData =
            devicePerformanceTrendsWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <DevicePerformanceTrendsOptions
              id={id}
              data={parsedWidgetData.data}
            />
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
          return (
            <EnvironmentalFactorsOptions id={id} data={parsedWidgetData.data} />
          );
        }
        // 인사정보 업데이트 시간
        case WidgetType.HrInfoUpdateTime: {
          const parsedWidgetData =
            hrInfoUpdateTimeWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <HrInfoUpdateTimeOptions id={id} data={parsedWidgetData.data} />
          );
        }
        // 통화 Peak 추이
        case WidgetType.CallPeakTrends: {
          const parsedWidgetData =
            callPeakTrendsWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <CallPeakTrendsOptions id={id} data={parsedWidgetData.data} />;
        }
        // 현재 통화 추이
        case WidgetType.LiveCallTrends: {
          const parsedWidgetData =
            liveCallTrendsWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return <LiveCallTrendsOptions id={id} data={parsedWidgetData.data} />;
        }
        // 미등록 전화기 현황
        case WidgetType.UnregisteredPhoneList: {
          const parsedWidgetData =
            unregisteredPhoneListWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <UnregisteredPhoneListOptions
              id={id}
              data={parsedWidgetData.data}
            />
          );
        }
        // 전화기 종류 별 미등록 정보
        case WidgetType.UnregisteredPhonesByType: {
          const parsedWidgetData =
            unregisteredPhonesByTypeWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <UnregisteredPhonesByTypeOptions
              id={id}
              data={parsedWidgetData.data}
            />
          );
        }
        // 개별 장비종류별 장애 현황
        case WidgetType.EventStatusByDeviceType: {
          const parsedWidgetData =
            eventStatusByDeviceTypeWidgetDataSchema.safeParse(data);
          if (!parsedWidgetData.success)
            throw new Error(
              JSON.stringify(parsedWidgetData.error.issues, null, 2),
            );
          return (
            <EventStatusByDeviceTypeOptions
              id={id}
              data={parsedWidgetData.data}
            />
          );
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
  }, [id, data]);

  return (
    <Wrapper>
      <div className="dimension">
        {data.dimension.w} x {data.dimension.h}
      </div>
      {optionsContent}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  height: 100%;
  max-width: 36rem;
  margin: 0 auto;

  .dimension {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0%);
    font-size: ${themeGet('fontSizes.s12')};
    color: ${themeGet('colors.textSub')};
    font-weight: ${themeGet('fontWeights.bold')};
    z-index: 10;
    opacity: 0.1;
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${themeGet('spacing.s4')};

    min-width: 16rem;
    padding: 0 4px;
    width: 100%;

    .label {
      white-space: nowrap;
    }

    .select-box {
      flex: 1;
    }
  }
`;

export default WidgetOptionsContent;
