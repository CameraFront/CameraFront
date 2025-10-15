import { memo, useRef } from 'react';
import { graphic } from 'echarts';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { DEFAULT_CHART_HEIGHT } from '@/config';

interface Props {
  name?: string;
  dataset: Dataset;
  width?: string;
  minHeight?: string;
  colors: string[];
  labelSize?: 'none' | 'small' | 'large';
  allowFloat?: boolean;
}

interface DataItem {
  name: string;
  value: number;
}

interface Dataset {
  dimensions: string[];
  source: DataItem[];
}

const HorizontalBarChart = ({
  name = '',
  dataset,
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  colors,
  labelSize = 'small',
  allowFloat = true,
}: Props) => {
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
          return new graphic.LinearGradient(1, 0, 0, 0, [
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
      // label: {
      //   show: labelSize !== 'none',
      //   position: 'inside',
      //   formatter({ value }: echarts.DefaultLabelFormatterCallbackParams) {
      //     if (!value) return '';

      //     return value;
      //   },
      //   color: theme.colors.black,
      //   textBorderColor: theme.colors.white,
      //   textBorderWidth: 3,
      //   fontSize:
      //     labelSize === 'large' ? theme.fontSizes.s9 : theme.fontSizes.s4,
      //   fontWeight: theme.fontWeights.bold,
      // },
      emphasis: {
        itemStyle: {
          shadowBlur: 4,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ];

  const options = {
    graphic: {
      invisible: Boolean(dataset.source.length),
      type: 'text',
      left: 'center',
      top: 'middle',
      z: 1,
      style: {
        fontSize: theme.fontSizes.s7,
        fontWeight: theme.fontWeights.bold,
        text: '데이터 없음',
        fill: theme.colors.gray,
        stroke: theme.colors.white,
        lineWidth: 5,
      },
      cursor: 'not-allowed',
    },
    title: {
      show: !!name,
      text: name,
      // textAlign: 'center',
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
        return `${value}개`;
      },
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: theme.colors.chartSplitLine,
        },
      },
      axisLabel: {
        color: theme.colors.chartLabel,
      },
      minInterval: 1,
      // ...(!allowFloat && { interval: 1 }),
    },
    yAxis: {
      type: 'category',
      data: nameList,
      axisLabel: {
        color: theme.colors.chartLabel,
        fontSize: 14,
      },
    },
    series,
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

export default memo(HorizontalBarChart);
