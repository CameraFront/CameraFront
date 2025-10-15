import { useRef } from 'react';
import { graphic } from 'echarts';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { useAppSelector } from '@/app/hooks';
import { ChartType } from '@/features/dashboardPage/types';
import { eventKrToEn } from '@/types/common';
import { DEFAULT_CHART_HEIGHT } from '@/config';

interface Props {
  name?: string;
  dataset: Dataset;
  width?: string;
  minHeight: string;
  colors: string[];
  chartType: ChartType | undefined;
  isFilled?: boolean; // 선형(옵션추가요청), 채워진선형, 세로막대형
}

interface SourceItem {
  date: string;
  긴급: number;
  중요: number;
  일반: number;
}

interface Dataset {
  dimensions: string[];
  source: SourceItem[];
}

const EventTrendsChart = ({
  name = '',
  dataset,
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  colors,
  chartType,
  isFilled = false,
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
    stack: 'Total',
    smooth: true,
    lineStyle: {
      width: 2,
    },
    showSymbol: false,
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
    markLine: {
      symbol: ['none', 'none'],
      label: { show: false },
      data: [
        { xAxis: 0 },
        { xAxis: 1 },
        { xAxis: 2 },
        { xAxis: 3 },
        { xAxis: 4 },
        { xAxis: 5 },
        { xAxis: 6 },
      ],
      lineStyle: {
        color: 'none',
        type: 'solid',
      },
    },
    ...(isFilled && {
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: theme.colors[eventKrToEn[dimension]],
          },
          {
            offset: 0.4,
            color: theme.colors[eventKrToEn[dimension]],
          },
          {
            offset: 1,
            color: `${theme.colors[eventKrToEn[dimension]]}22`,
          },
        ]),
      },
    }),
  }));

  const options = {
    darkMode: true,
    color: colors.slice().reverse(),
    grid: {
      top: 11,
      bottom: 0,
      left: -22,
      right: -20,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter(value) {
        return `${value}개`;
      },
      position: 'inside',
      confine: true,
      // order: 'seriesDesc',
      axisPointer: {
        lineStyle: {
          color: '#343752',
          type: 'solid',
        },
      },
    },
    title: {
      show: false,
    },
    // legend: {
    //   show: true,
    //   data: dataset.dimensions.slice(1),
    //   textStyle: {
    //     fontSize: theme.default.fontSize,
    //     color: theme.default.color,
    //     fontFamily: theme.default.fontFamily,
    //   },
    // },
    xAxis: {
      type: 'category',
      axisLabel: {
        color: theme.colors.chartLabel,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: {
        lineStyle: {
          color: isDarkMode
          ? '#B7B7B7'
          : '#E5E5E5',
        },
      },
      axisLabel: {
        color: theme.colors.chartLabel,
        padding: [0, -30, 0, 0],
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

export default EventTrendsChart;
