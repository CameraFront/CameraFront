import { useRef } from 'react';
import { DEFAULT_CHART_HEIGHT } from '@/config';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { useAppSelector } from '@/app/hooks';

interface Props {
  name?: string;
  dataset: Dataset;
  width?: string;
  minHeight?: string;
  colors: string[];
  unit: '%' | 'Mbps';
}

interface DataItem {
  name: string;
  value: number;
}

interface Dataset {
  dimensions: string[];
  source: DataItem[];
}

const RankingVBarChart = ({
  name = '',
  dataset,
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  colors,
  unit = '%',
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
        color: (params: echarts.CustomSeriesRenderItemParams) => {
          return colors[params.dataIndex];
        },
      },
      label: {
        show: true,
        position: 'inside',
        formatter: ({ value }: echarts.DefaultLabelFormatterCallbackParams) => {
          if (!value) return '';

          return value.toString() + unit;
        },
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.black,
        textBorderColor: theme.colors.white,
        textBorderWidth: 2,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 2,
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
      show: name ? true : false,
      text: name + '(' + unit + ')',
      left: 'center',
      top: 'top',
      textStyle: {
        fontSize: 16,
        fontFamily: theme.default.fontFamily,
        color: theme.colors.textMain,
      },
    },
    grid: {
      top: 30,
      bottom: 10,
      left: 0,
      right: 20,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      valueFormatter: value => {
        return value + unit;
      },
    },
    legend: {
      show: false,
    },
    xAxis: {
      // show: true,
      type: 'category',
      data: nameList,
      axisLabel: {
        fontSize: nameList.length > 5 ? 10 : 12,
        width: nameList.length > 5 ? 60 : 80,
        overflow: 'truncate',
        ellipsis: '...',
        interval: 0,
        color: theme.colors.chartLabel,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: theme.colors.chartSplitLine,
        },
      },
      ...(unit === '%' && { min: 0 }),
      ...(unit === '%' && { max: 100 }),
      axisLabel: {
        color: theme.colors.chartLabel,
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
  overflow: hidden;
`;

export default RankingVBarChart;
