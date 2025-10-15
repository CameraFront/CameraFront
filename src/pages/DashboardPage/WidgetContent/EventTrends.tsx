import dayjs from 'dayjs';
import styled from 'styled-components';
import LoadingSpinner from '@/components/LoadingSpinner';
import EventTrendsChart from '@/components/charts/EventTrendsChart';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import useEventColors from '@/hooks/useEventColors';
import { useWidgetHeightContext } from '@/features/dashboardPage/widget-height/use-widget-height-context';
import { useGetEventTrendsDataQuery } from '@/services/api/dashboard';
import { EventTrendsWidgetData } from '@/types/api/dashboard';
import { DATE_SHORT_FORMAT } from '@/config';

type Props = {
  data: EventTrendsWidgetData;
};

const EventTrends = ({ data }: Props) => {
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetEventTrendsDataQuery(
    {
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
      deviceTypes: data.options.deviceTypes,
      eventTypes: data.options.eventTypes,
    },
    {
      pollingInterval: data.options.updateInterval * 1000,
    },
  );
  const { getChartHeightByH } = useWidgetHeightContext();
  const eventColors = useEventColors();

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  const eventTrendsData = widgetData.faultList;

  const dataset = {
    dimensions: ['date', '긴급', '중요', '일반'],
    source: eventTrendsData.map(el => ({
      date: dayjs(el.Day).format(DATE_SHORT_FORMAT),
      긴급: el.urgent,
      중요: el.important,
      일반: el.minor,
    })),
  };

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper>
        <div className="chart-wrapper">
          <EventTrendsChart
            dataset={dataset}
            width="100%"
            minHeight={`${getChartHeightByH(data.dimension.h)}px`}
            colors={eventColors}
            chartType={data.options.chartType}
          />
        </div>
      </Wrapper>
    </LoadingSpinner>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 1rem;

  width: 100%;
  height: 100%;

  .chart-wrapper {
    flex: 1;
    width: 100%;
    height: 100%;
  }
`;

export default EventTrends;
