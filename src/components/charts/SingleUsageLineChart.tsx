import { useMemo, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { DEFAULT_CHART_HEIGHT } from '@/config';

interface Props {
  name: string;
  dataset: Dataset;
  width?: string;
  minHeight?: string;
  unit?: string;
  isTiny?: boolean;
}

interface SourceItem {
  datetime: string;
  value: number;
}

interface Dataset {
  dimensions?: string[];
  source: SourceItem[];
}

const SingleUsageLineChart = ({
  name,
  dataset,
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  unit = '%',
  isTiny = false,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const graphic = useMemo(() => {
    if (!dataset.source.length) {
      return {
        invisible: false,
        type: 'text',
        left: 'center',
        top: 'middle',
        z: 1,
        style: {
          fontSize: isTiny ? theme.fontSizes.s3 : theme.fontSizes.s6,
          fontWeight: theme.fontWeights.light,
          text: '데이터 없음',
          fill: theme.colors.disabledInv,
        },
        cursor: 'not-allowed',
      };
    }

    const lastValue = dataset.source[dataset.source.length - 1].value;
    const textColor =
      lastValue > 80
        ? theme.colors.textDanger
        : lastValue > 50
          ? theme.colors.textWarning
          : theme.colors.palette.yellow7;

    return {
      invisible: false,
      type: 'text',
      left: 'center',
      top: '50%',
      z: -1,
      style: {
        fontFamily: theme.default.fontFamily,
        fontSize: isTiny ? theme.fontSizes.s9 : theme.fontSizes.s12,
        fontWeight: theme.fontWeights.bold,
        text: `${lastValue}%`,
        fill: textColor,
        opacity: 0.2,
      },
    };
  }, [dataset, theme, isTiny]);

  const options = {
    title: {
      text: `${name}(${unit})`,
      left: 'center',
      textStyle: {
        fontSize: isTiny ? theme.fontSizes.s2 : theme.fontSizes.s4,
        fontWeight: isTiny ? theme.fontWeights.medium : theme.fontWeights.bold,
        fontFamily: theme.default.fontFamily,
        color: theme.colors.textMain,
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
    xAxis: {
      type: 'category',
      show: !isTiny,
      axisLabel: { color: theme.colors.chartLabel },
    },
    yAxis: {
      type: 'value',
      ...(Boolean(dataset.source.length) && {
        min: 0,
        max: 100,
      }),
      interval: isTiny ? 50 : 20,
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
    grid: isTiny
      ? {
          top: 30,
          bottom: 10,
          left: 30,
          right: 10,
        }
      : {
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
        encode: {
          x: 'datetime',
          y: 'value',
        },
        tooltip: {
          valueFormatter: value => `${value}%`,
        },
      },
    ],
    graphic,
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

export default SingleUsageLineChart;
