import styled, { useTheme } from 'styled-components';
import LoadingSpinner from '@/components/LoadingSpinner';
import RankingHBarChart from '@/components/charts/Ranking/RankingHBarChart';
import RankingVBarChart from '@/components/charts/Ranking/RankingVBarChart';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useWidgetHeightContext } from '@/features/dashboardPage/widget-height/use-widget-height-context';
import { useGetDeviceRankingsByResourceDataQuery } from '@/services/api/dashboard';
import { DeviceRankingsChartByResourceWidgetData } from '@/types/api/dashboard';
import { ChartType, RankCount, ResourceType } from '@/types/enum';
import { truncateFloatToNDecimals } from '@/utils/formatters';
import { isNotNullish } from '@/utils/nullChecking';

type Props = {
  data: DeviceRankingsChartByResourceWidgetData;
};

const LABEL = {
  [ResourceType.Cpu]: 'CPU',
  [ResourceType.Memory]: 'Memory',
  [ResourceType.Disk]: 'Disk',
  [ResourceType.Traffic]: 'Traffic',
};

const DeviceRankingsChartByResource = ({ data }: Props) => {
  const theme = useTheme();
  const {
    data: widgetData,
    isLoading,
    isSuccess,
  } = useGetDeviceRankingsByResourceDataQuery(
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

  if (!isSuccess)
    return (
      <ErrorMessage>서버에서 데이터를 가져오는데 실패했습니다.</ErrorMessage>
    );

  const source = widgetData.usageUtil
    .slice()
    .reverse()
    .map(el => ({
      name: el.deviceNm ? el.deviceNm : '',
      value: el.usageUtil ? truncateFloatToNDecimals(+el.usageUtil, 1) : 0,
    }));

  const rankCount = data.options.rankCount === RankCount.Top10 ? 10 : 5;

  // CPU, Memory는 % 단위로 표시, Inbound, Outbound는 bps 단위로 표시
  const isPercentUnit =
    data.options.selectedResource === ResourceType.Cpu ||
    data.options.selectedResource === ResourceType.Memory ||
    data.options.selectedResource === ResourceType.Disk;

  const isHBarChart = data.options.chartType === ChartType.HorizontalBar;

  // 수평바 차트는 순위가 높은 순으로 표시해야 하므로 컬러순서를 뒤집어줌
  const seriesColors = isHBarChart
    ? theme.colors.series.slice(0, rankCount).reverse()
    : theme.colors.series.slice(0, rankCount);

  // 수평바 차트는 순위가 높은 순으로 표시해야 하므로 데이터를 뒤집어줌
  if (!isHBarChart) {
    source.reverse();
  }

  const dataset = {
    dimensions: ['name', 'value'],
    source,
  };

  const title = isNotNullish(data.options.selectedResource)
    ? LABEL[data.options.selectedResource]
    : '';

  const unit = isPercentUnit ? '%' : 'Mbps';

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper>
        {(() => {
          switch (data.options.chartType) {
            // case ChartType.Pie:
            //   return (
            //     <PieChartWrapper>
            //       <div className="col-chart">
            //         <RankingPieChart
            //           name={title}
            //           dataset={dataset}
            //           colors={seriesColors}
            //           unit={unit}
            //           radius="85%"
            //           minHeight={`${getChartHeightByH(data.dimension.h)}px`}
            //         />
            //       </div>
            //       <div className="col-legends">
            //         {dataset.source.map((item, i) => (
            //           <Legend
            //             key={item.name}
            //             name={item.name ?? 'Unknown Name'}
            //             color={seriesColors[i]}
            //           />
            //         ))}
            //       </div>
            //     </PieChartWrapper>
            //   );
            case ChartType.VerticalBar:
              return (
                <RankingVBarChart
                  name={title}
                  dataset={dataset}
                  colors={seriesColors}
                  unit={unit}
                  minHeight={`${getChartHeightByH(data.dimension.h)}px`}
                />
              );
            case ChartType.HorizontalBar:
              return (
                <RankingHBarChart
                  name={title}
                  dataset={dataset}
                  colors={seriesColors}
                  unit={unit}
                  minHeight={`${getChartHeightByH(data.dimension.h)}px`}
                />
              );

            default:
              return 'Invalid chart type';
          }
        })()}
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

const PieChartWrapper = styled.div`
  display: flex;
  gap: 1.6rem;

  height: 100%;

  .col-chart {
    flex: 3;
    display: flex;
    justify-content: center;
    height: 100%;
  }

  .col-legends {
    flex: 2;

    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export default DeviceRankingsChartByResource;
