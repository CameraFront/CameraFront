import { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import LoadingSpinner from '@/components/LoadingSpinner';
import FilledPieWithLegendChart from '@/components/charts/FilledPieWithLegendChart';
import HorizontalBarChart from '@/components/charts/HorizontalBarChart';
import VerticalBarChart from '@/components/charts/VerticalBarChart';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useWidgetHeightContext } from '@/features/dashboardPage/widget-height/use-widget-height-context';
import { useGetStationRankingsByEventDataQuery } from '@/services/api/dashboard';
import { StationRankingsByEventWidgetData } from '@/types/api/dashboard';
import { ChartType, RankCount } from '@/types/enum';

type Props = {
  data: StationRankingsByEventWidgetData;
};

const StationRankingsByEvent = ({ data }: Props) => {
  const theme = useTheme();

  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetStationRankingsByEventDataQuery(
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
  const source = useMemo(() => {
    if (!widgetData) return [];

    return widgetData.faultList.map(el => ({
      ...el,
      name: el.managementNm,
      value: el.total ?? 0,
    }));
  }, [widgetData]);

  const rankCount = data.options.rankCount === RankCount.Top10 ? 10 : 5;
  const isHBarChart = data.options.chartType === ChartType.HorizontalBar;

  // 수평바 차트는 순위가 높은 순으로 표시해야 하므로 컬러순서를 뒤집어줌
  const seriesColors = isHBarChart
    ? theme.colors.series.slice(0, rankCount).reverse()
    : theme.colors.series.slice(0, rankCount);

  // 수평바 차트는 순위가 높은 순으로 표시해야 하므로 데이터를 뒤집어줌
  if (isHBarChart) {
    source.reverse();
  }

  const dataset = useMemo(() => {
    if (!widgetData) return null;

    return {
      dimensions: ['name', 'value'],
      source,
    };
  }, [widgetData, source]);

  const chartContent = useMemo(() => {
    if (!dataset) return null;

    switch (data.options.chartType) {
      case ChartType.Pie:
        return (
          <FilledPieWithLegendChart
            // name={title}
            dataset={dataset}
            colors={seriesColors}
            // unit={unit}
            radius="85%"
            minHeight={`${getChartHeightByH(data.dimension.h)}px`}
          />
        );
      case ChartType.VerticalBar:
        return (
          <VerticalBarChart
            // name={title}
            dataset={dataset}
            colors={seriesColors}
            minHeight={`${getChartHeightByH(data.dimension.h)}px`}
            // unit={unit}
          />
        );
      case ChartType.HorizontalBar:
        return (
          <HorizontalBarChart
            // name={title}
            dataset={dataset}
            colors={seriesColors}
            minHeight={`${getChartHeightByH(data.dimension.h)}px`}
            // unit={unit}
          />
        );

      default:
        return '차트종류가 올바르지 않습니다.';
    }
  }, [data, dataset, seriesColors, getChartHeightByH]);

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper>
        <div className="chart-wrapper">{chartContent}</div>
      </Wrapper>
    </LoadingSpinner>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 1rem;

  width: 100%;
  height: 100%;
  padding: 0 1rem;

  .chart-wrapper {
    flex: 1;
    width: 100%;
    height: 100%;
  }
`;

export default StationRankingsByEvent;
