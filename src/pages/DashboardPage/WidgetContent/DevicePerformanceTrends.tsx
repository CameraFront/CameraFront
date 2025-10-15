import dayjs from 'dayjs';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import DoubleTrafficLineChart from '@/components/charts/DoubleTrafficLineChart';
import SingleUsageLineChart from '@/components/charts/SingleUsageLineChart';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import NoData from '@/components/fallbacks/NoData';
import { useWidgetHeightContext } from '@/features/dashboardPage/widget-height/use-widget-height-context';
import { useGetDevicePerformanceTrendsDataQuery } from '@/services/api/dashboard';
import { DevicePerformanceTrendsWidgetData } from '@/types/api/dashboard';
import { SIPrefix } from '@/types/enum';
import { divideBySIPrefix } from '@/utils/formatters';

type Props = {
  data: DevicePerformanceTrendsWidgetData;
};

const DevicePerformanceTrends = ({ data }: Props) => {
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetDevicePerformanceTrendsDataQuery(
    {
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
    },
    {
      pollingInterval: data.options.updateInterval * 1000,
    },
  );

  const { getChartHeightByH } = useWidgetHeightContext();

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  const lastItem =
    widgetData.networkPerformanceList[
      widgetData.networkPerformanceList.length - 1
    ];

  const prefixUnit = !lastItem
    ? 1
    : lastItem.inBps > 10 ** 5 && lastItem.outBps > 10 ** 5
      ? SIPrefix.Mega
      : SIPrefix.Kilo;

  const cpu = {
    dimensions: ['datetime', 'value'],
    source: widgetData.cpuPerformanceList.map(d => ({
      datetime: dayjs(d.date).format('MM/DD HH:mm'),
      value: d.cpuUtil,
    })),
  };
  const memory = {
    dimensions: ['datetime', 'value'],
    source: widgetData.memoryPerformanceList.map(d => ({
      datetime: dayjs(d.date).format('MM/DD HH:mm'),
      value: d.memUtil,
    })),
  };
  const disk = {
    dimensions: ['datetime', 'value'],
    source: widgetData.fsPerformanceList.map(d => ({
      datetime: dayjs(d.date).format('MM/DD HH:mm'),
      value: d.size,
    })),
  };

  const traffic = {
    dimensions: ['datetime', 'inbound', 'outbound'],
    source: widgetData
      ? widgetData.networkPerformanceList.map(d => ({
          datetime: dayjs(d.date).format('MM/DD HH:mm'),
          inbound: divideBySIPrefix(d.inBps, prefixUnit, 1),
          outbound: divideBySIPrefix(d.outBps, prefixUnit, 1),
        }))
      : [],
  };

  const datasets = {
    cpu,
    memory,
    disk,
    traffic,
  };

  if (!datasets) return <NoData />;

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper>
        <div className="title">{widgetData.deviceNm}</div>
        <div className="chart-wrapper">
          <SingleUsageLineChart
            dataset={datasets.cpu}
            name="CPU"
            minHeight={`${getChartHeightByH(data.dimension.h) / 2.3}px`}
            isTiny
          />
          <SingleUsageLineChart
            dataset={datasets.memory}
            name="MEMORY"
            minHeight={`${getChartHeightByH(data.dimension.h) / 2.3}px`}
            isTiny
          />
          <SingleUsageLineChart
            dataset={datasets.disk}
            name="DISK"
            minHeight={`${getChartHeightByH(data.dimension.h) / 2.3}px`}
            isTiny
          />
          <DoubleTrafficLineChart
            dataset={datasets.traffic}
            minHeight={`${getChartHeightByH(data.dimension.h) / 2.3}px`}
            isTiny
            unit={prefixUnit === SIPrefix.Mega ? 'Mbps' : 'kbps'}
          />
        </div>
      </Wrapper>
    </LoadingSpinner>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  /* padding: 0 1rem; */

  .title {
    text-align: center;
    font-size: ${themeGet('fontSizes.s3')};
    font-weight: ${themeGet('fontWeights.medium')};
    border-radius: ${themeGet('borderRadius.small')};
    min-height: 30px;
  }

  .chart-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 50% 50%;

    width: 100%;

    /* height: 100%; */
  }
`;

export default DevicePerformanceTrends;
