import { useMemo } from 'react';
import styled from 'styled-components';
import LoadingSpinner from '@/components/LoadingSpinner';
import DoughnutChart from '@/components/charts/DoughnutChart';
import HorizontalBarChart from '@/components/charts/HorizontalBarChart';
import Legend from '@/components/charts/Legend';
import VerticalBarChart from '@/components/charts/VerticalBarChart';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import useEventColors from '@/hooks/useEventColors';
import { useWidgetHeightContext } from '@/features/dashboardPage/widget-height/use-widget-height-context';
import { useGetNumOfEventsDataQuery } from '@/services/api/dashboard';
import { NumOfEventsWidgetData } from '@/types/api/dashboard';
import { ChartType } from '@/types/enum';
import { WIDGET_CONFIG } from '@/config';

type Props = {
  data: NumOfEventsWidgetData;
};

const NumOfEvents = ({ data }: Props) => {
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetNumOfEventsDataQuery(
    {
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
      deviceTypes: data.options.deviceTypes,
    },
    {
      pollingInterval: data.options.updateInterval * 1000,
    },
  );

  const { widgetContentHeight } = useWidgetHeightContext();

  const eventColors = useEventColors();

  const dataset = useMemo(() => {
    if (!widgetData) return null;

    return {
      dimensions: ['name', 'value'],
      source: [
        {
          name: '긴급',
          value: widgetData.urgent,
        },
        {
          name: '중요',
          value: widgetData.important,
        },
        {
          name: '일반',
          value: widgetData.minor,
        },
      ],
    };
  }, [widgetData]);

  // 가로막대차트를 위한 데이터셋
  const datasetReversed = useMemo(() => {
    if (!dataset) return null;

    return {
      dimensions: dataset.dimensions,
      source: dataset.source.slice().reverse(),
    };
  }, [dataset]);

  // 차트종류에 따라 다른 차트를 보여줌
  const chartContent = useMemo(() => {
    if (!dataset || !widgetData || !datasetReversed) return null;

    switch (data.options.chartType) {
      case ChartType.Pie:
        return (
          <DoughnutChart
            centerText={widgetData.total.toString()}
            dataset={dataset}
            width="100%"
            minHeight={`${widgetContentHeight - WIDGET_CONFIG.contentPadding}px`}
            colors={eventColors}
          />
        );
      case ChartType.VerticalBar:
        return (
          <VerticalBarChart
            dataset={dataset}
            width="100%"
            minHeight={`${widgetContentHeight - WIDGET_CONFIG.contentPadding}px`}
            colors={eventColors}
          />
        );
      case ChartType.HorizontalBar:
        return (
          <HorizontalBarChart
            dataset={datasetReversed}
            width="100%"
            minHeight={`${widgetContentHeight - WIDGET_CONFIG.contentPadding}px`}
            colors={eventColors.slice().reverse()}
          />
        );

      default:
        break;
    }
  }, [
    data.options.chartType,
    dataset,
    datasetReversed,
    eventColors,
    widgetData,
    widgetContentHeight,
  ]);

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;
  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper>
        <div className="chart-wrapper">{chartContent}</div>
        <div className="legends">
          {dataset?.source.map((item, i) => (
            <Legend key={item.name} name={item.name} color={eventColors[i]} />
          ))}
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

  .legends {
    flex: 0 0 30%;
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

export default NumOfEvents;
