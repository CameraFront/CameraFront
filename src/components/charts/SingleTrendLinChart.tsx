import { useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { useAppSelector } from '@/app/hooks';
import { DEFAULT_CHART_HEIGHT } from '@/config';

interface SourceItem {
  label: string;
  value: number;
}

interface Props {
  source: SourceItem[];
  width?: string;
  minHeight?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
}

const SingleTrendLinChart = ({
  source,
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  xAxisLabel = '일시',
  yAxisLabel = '전체',
  color,
}: Props) => {
  const { isDarkMode } = useAppSelector(store => store.global);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const dataset = {
    dimensions: [xAxisLabel, yAxisLabel],
    source: source.map(item => ({
      [xAxisLabel]: item.label,
      [yAxisLabel]: item.value,
    })),
  };
  const dimensions = dataset.dimensions.slice(1).reverse();

  const series = dimensions.map(dimension => ({
    type: 'line',
    symbol: 'roundRect',
    name: dimension,
    symbolSize: 8,
    label: {
      show: false,
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 3,
        shadowOffsetY: 2,
        shadowOffsetX: 0,
        shadowColor: isDarkMode
          ? 'rgba(255, 255, 255, 0.4)'
          : 'rgba(0, 0, 0, 0.4)',
      },
    },
  }));

  const options = {
    darkMode: true,
    color: color || theme.colors.series,
    grid: {
      top: 40,
      bottom: 10,
      left: 10,
      right: 10,
      containLabel: true,
    },
    graphic: [
      {
        type: 'group',
        left: '10%',
        top: 'center',
        z: 100,
        children: [
          {
            type: 'circle',
            shape: {
              cx: '50%',
              cy: '50%',
              r: '40%',
            },
            style: {
              fill: 'red',
            },
          },
        ],
      },
    ],
    tooltip: {
      trigger: 'axis',
      valueFormatter(value) {
        return `${value}개`;
      },
      confine: true,
      order: 'seriesDesc',
    },
    legend: {
      show: true,
      data: dataset.dimensions.slice(1),
      textStyle: {
        fontSize: theme.default.fontSize,
        color: theme.default.color,
        fontFamily: theme.default.fontFamily,
      },
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        color: theme.colors.chartLabel,
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: {
        lineStyle: {
          color: theme.colors.chartSplitLine,
        },
      },
      axisLabel: {
        color: theme.colors.chartLabel,
      },
    },
    series,
    dataset,
  } as echarts.EChartsOption;

  useCharts(containerRef, options);

  return <Wrapper ref={containerRef} width={width} $minHeight={minHeight} />;
};

const Wrapper = styled.div<{
  width: Props['width'];
  $minHeight: Props['minHeight'];
}>`
  width: ${({ width }) => width};
  min-height: ${({ $minHeight }) => $minHeight};
  height: 100%;
  overflow: hidden;
`;

export default SingleTrendLinChart;
