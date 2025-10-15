import { memo, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { DEFAULT_CHART_HEIGHT } from '@/config';

interface Props {
  name: string;
  dataset: Dataset;
  xAxisLabel: string;
  yAxisLabel: string;
  width?: string;
  minHeight?: string;
  unit?: string;
  // colors?: string[];
}

interface SourceItem {
  label: string;
  value: number;
}

interface Dataset {
  dimensions?: string[];
  source: SourceItem[];
}

const SimpleUsageLineChart = ({
  name,
  dataset,
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  unit = '%',
  xAxisLabel,
  yAxisLabel,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const options = {
    title: {
      text: `${name}(${unit})`,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: theme.fontWeights.medium,
        fontFamily: theme.default.fontFamily,
      },
    },
    dataset,
    visualMap: [
      {
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: 100,
      },
    ],
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    xAxis: { type: 'category', axisLabel: { color: theme.colors.chartLabel } },
    yAxis: {
      type: 'value',
      ...(Boolean(dataset.source.length) && {
        min: 0,
        max: 100,
      }),
      splitLine: {
        lineStyle: {
          color: theme.colors.chartSplitLine,
        },
      },
      axisLabel: {
        color: theme.colors.chartLabel,
      },
    },
    grid: {
      top: 40,
      bottom: 20,
      left: 40,
      right: 30,
    },
    series: [
      {
        type: 'line',
        name,
        showSymbol: false,
        // encode: {
        //   x: xAxisLabel,
        //   y: yAxisLabel,
        // },
      },
    ],
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

export default memo(SimpleUsageLineChart);
