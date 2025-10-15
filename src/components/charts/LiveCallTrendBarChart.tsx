import { memo, useRef } from 'react';
import { graphic } from 'echarts';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { useAppSelector } from '@/app/hooks';
import { Dataset } from '@/types/common';
import { DEFAULT_CHART_HEIGHT } from '@/config';

interface Props {
  name?: string;
  dataset: Dataset;
  width?: string;
  height?: string;
  minHeight?: string;
  colors: string[];
  labelSize?: 'none' | 'small' | 'large';
}

const VerticalBarChart = ({
  name = '',
  dataset,
  width = '100%',
  height = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  colors,
  labelSize = 'small',
}: Props) => {
  const { isDarkMode } = useAppSelector(store => store.global);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const nameList = dataset.source.map(item => item.name);
  const valueList = dataset.source.map(item => item.value);

  const series = [
    {
      type: 'bar',
      data: valueList,
      itemStyle: {
        color(params: echarts.CustomSeriesRenderItemParams) {
          return new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: colors[params.dataIndex],
            },
            {
              offset: 0.4,
              color: colors[params.dataIndex],
            },
            {
              offset: 1,
              color: colors[params.dataIndex] + 22,
            },
          ]);
        },
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
    },
  ];

  const options = {
    title: {
      show: !!name,
      text: name,
      textStyle: {
        fontSize: theme.fontSizes.s3,
        fontWeight: theme.fontWeights.medium,
        fontFamily: theme.default.fontFamily,
      },
    },
    grid: {
      top: 20,
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
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      data: nameList,
      axisLabel: {
        interval: 0,
        overflow: 'truncate',
        width: dataset.source.length > 5 ? 70 : undefined,
        color: theme.colors.chartLabel,
      },
    },
    yAxis: {
      type: 'value',
      // minInterval: 1,
      splitLine: {
        lineStyle: {
          color: theme.colors.chartSplitLine,
        },
      },
      axisLabel: {
        color: theme.colors.chartLabel,
      },
    },
    label: {
      show: true,
      position: 'top',
      color: isDarkMode ? '#F5F5F5' : '#2A2A2A',    
      fontWeight: 'bold',
      fontSize: 18,  
    },
    series,
  } as echarts.EChartsOption;

  useCharts(containerRef, options);

  return (
    <Wrapper
      ref={containerRef}
      width={width}
      height={height}
      $minHeight={minHeight}
    />
  );
};

const Wrapper = styled.div<{
  width: Props['width'];
  height: Props['height'];
  $minHeight: Props['minHeight'];
}>`
  width: ${({ width }) => width};
  min-height: ${({ $minHeight }) => $minHeight};
  height: ${({ height }) => height};
  overflow: hidden;
`;

export default memo(VerticalBarChart);
