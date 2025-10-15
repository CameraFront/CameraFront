import { memo, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { Dataset } from '@/types/common';
import { DEFAULT_CHART_HEIGHT } from '@/config';

interface Props {
  title?: string;
  dataset: Dataset<SourceItem>;
  width?: string;
  minHeight?: string;
}

interface SourceItem {
  시: string;
  긴급: number;
  중요: number;
  일반: number;
  전체: number;
}

const HourlyEventsChart = ({
  title = '일별 장애 발생 추이',
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
    theme.colors.total,
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
        fontWeight: theme.fontWeights.light,
        text: '데이터 없음',
        fill: theme.colors.disabledInv,
      },
      cursor: 'not-allowed',
    },
    color: eventColors,
    dataset,
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: theme.fontWeights.medium,
        fontFamily: theme.default.fontFamily,
        color: theme.colors.textMain,
      },
    },
    grid: {
      top: 40,
      bottom: 8,
      left: 10,
      right: 10,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    // legend: {
    //   data: ['긴급', '중요', '일반', '전체'],
    //   orient: 'vertical',
    //   right: '5%',
    //   top: 'center',
    // },
    xAxis: {
      type: 'category',
      axisPointer: {
        type: 'shadow',
      },
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
    series: [
      {
        type: 'bar',
        name: '긴급',
        encode: {
          x: '시',
          y: '긴급',
        },
        tooltip: {
          valueFormatter: value => `${value}개`,
        },
      },
      {
        type: 'bar',
        name: '중요',
        encode: {
          x: '시',
          y: '중요',
        },
        tooltip: {
          valueFormatter: value => `${value}개`,
        },
      },
      {
        type: 'bar',
        name: '일반',
        encode: {
          x: '시',
          y: '일반',
        },
        tooltip: {
          valueFormatter: value => `${value}개`,
        },
      },
      {
        type: 'line',
        name: '전체',
        encode: {
          x: '시',
          y: '전체',
        },
        tooltip: {
          valueFormatter: value => `${value}개`,
        },
      },
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

// export default DailyEventsChart;
export default memo(HourlyEventsChart);
