import { memo, useRef } from 'react';
import { DEFAULT_CHART_HEIGHT } from '@/config';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';

interface Props {
  name?: string;
  dataset: Dataset;
  width?: string;
  minHeight?: string;
}

interface DataItem {
  일자: string;
  긴급: number;
  중요: number;
  일반: number;
}

interface Dataset {
  dimensions: string[];
  source: DataItem[];
}

const StackedBarChart = ({
  name = '',
  dataset,
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const eventColors = [
    theme.colors.urgent,
    theme.colors.important,
    theme.colors.minor,
  ];

  const options = {
    color: eventColors,
    graphic: {
      invisible: Boolean(dataset.source.length),
      type: 'text',
      left: 'center',
      top: 'middle',
      z: 1,
      style: {
        fontSize: 24,
        fontWeight: 'bold',
        text: '데이터 없음',
        fill: '#dadada',
        stroke: '#fff',
        lineWidth: 5,
      },
      cursor: 'not-allowed',
    },
    title: {
      show: name ? true : false,
      text: name,
      textAlign: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: theme.fontWeights.medium,
        fontFamily: theme.default.fontFamily,
      },
    },
    grid: {
      top: name ? 20 : 5,
      bottom: 10,
      left: 10,
      right: 15,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter(value) {
        return value + '개';
      },
      confine: true,
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        color: theme.colors.chartAxisLabel,
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
        color: theme.colors.chartAxisLabel,
      },
    },
    dataset,
    series: [
      { type: 'bar', stack: '긴급' },
      { type: 'bar', stack: '중요' },
      { type: 'bar', stack: '일반' },
    ],
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
  min-width: 0;
  position: relative;
  overflow: hidden;
`;

// export default StackedBarChart;
export default memo(StackedBarChart);
