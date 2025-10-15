import dayjs from 'dayjs';
import styled from 'styled-components';
import LoadingSpinner from '@/components/LoadingSpinner';
import CallPeakTrendsChart from '@/components/charts/CallPeakTrendsChart';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useWidgetHeightContext } from '@/features/dashboardPage/widget-height/use-widget-height-context';
import { useGetCallPeakTrendsDataQuery } from '@/services/api/dashboard';
import { CallPeakTrendsWidgetData } from '@/types/api/dashboard';
import { CallPeakType } from '@/types/enum';
import { TIME_LONG_FORMAT } from '@/config';

interface Props {
  data: CallPeakTrendsWidgetData;
}

const CallPeakTrends = ({ data }: Props) => {
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetCallPeakTrendsDataQuery(
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

  const { callPeakTrend } = widgetData;

  const dataset = {
    dimensions: [
      'date',
      ...data.options.callPeakTypes.map(el => CallPeakType[el]),
    ],
    source: callPeakTrend.map(el => ({
      date: dayjs(el.collectDateTime).format(TIME_LONG_FORMAT),
      전체: el.total,
      발신: el.outbound,
      수신: el.inbound,
      중계: el.tandem,
      내선: el.internal,
    })),
  };

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper>
        <CallPeakTrendsChart
          dataset={dataset}
          width="100%"
          minHeight={`${getChartHeightByH(data.dimension.h)}px`}
          // chartType={data.options.chartType}
        />
      </Wrapper>
    </LoadingSpinner>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export default CallPeakTrends;
