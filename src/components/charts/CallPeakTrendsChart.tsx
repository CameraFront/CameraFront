import { useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { useAppSelector } from '@/app/hooks';
import { ChartType } from '@/types/enum';
import { DEFAULT_CHART_HEIGHT } from '@/config';

interface Props {
  name?: string;
  dataset: Dataset;
  width?: string;
  minHeight: string;
  chartType?: ChartType;
}

interface SourceItem {
  date: string;
  전체: number;
  발신: number;
  수신: number;
  중계: number;
  내선: number;
}

interface Dataset {
  dimensions: string[];
  source: SourceItem[];
}

const CallPeakTrendsChart = ({
  name = '',
  dataset,
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  chartType = ChartType.Line,
}: Props) => {
  const { isDarkMode } = useAppSelector(store => store.global);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const isLine = chartType === ChartType.Line;
  const dimensions = dataset.dimensions.slice(1).reverse();

  const series = dimensions.map((dimension, i) => ({
    type: isLine ? 'line' : 'bar',
    symbol: 'roundRect',
    name: dimension,
    ...(isLine && { symbolSize: 8 }),
    encode: {
      x: 'date',
      y: dimension,
    },
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
    color: theme.colors.callPeakTrend,
    grid: {
      top: 40,
      bottom: 10,
      left: 10,
      right: 10,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter(value) {
        return `${value}개`;
      },
      confine: true,
      order: 'seriesDesc',
    },
    title: {
      show: false,
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

export default CallPeakTrendsChart;
