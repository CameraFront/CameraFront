import { useMemo, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { DEFAULT_CHART_HEIGHT } from '@/config';

interface Props {
  dataset: Dataset;
  unit: 'Mbps' | 'kbps';
  width?: string;
  minHeight?: string;
  isTiny?: boolean;
}

interface SourceItem {
  datetime: string;
  inbound: number;
  outbound: number;
}

interface Dataset {
  dimensions?: string[];
  source: SourceItem[];
}

const DoubleTrafficLineChart = ({
  dataset,
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  isTiny = false,
  unit,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const inboundColor = theme.colors.series[10];
  const outboundColor = theme.colors.series[11];

  const graphic = useMemo(() => {
    if (!dataset.source.length) {
      return [
        {
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
        },
      ];
    }

    const lastItem = dataset.source[dataset.source.length - 1];

    return [
      {
        invisible: false,
        type: 'text',
        left: '16%',
        top: '50%',
        z: -1,
        style: {
          fontFamily: theme.default.fontFamily,
          fontSize: isTiny ? theme.fontSizes.s9 : theme.fontSizes.s12,
          fontWeight: theme.fontWeights.bold,
          text: lastItem.inbound + Array.from(unit)[0],
          fill: inboundColor,
          opacity: 0.2,
        },
      },
      {
        invisible: false,
        type: 'text',
        left: '52%',
        top: '50%',
        z: -1,
        style: {
          fontFamily: theme.default.fontFamily,
          fontSize: isTiny ? theme.fontSizes.s8 : theme.fontSizes.s11,
          fontWeight: theme.fontWeights.light,
          text: '/',
          fill: theme.colors.textMain,
          opacity: 0.1,
        },
      },
      {
        invisible: false,
        type: 'text',
        left: '57%',
        top: '50%',
        z: -1,
        style: {
          fontFamily: theme.default.fontFamily,
          fontSize: isTiny ? theme.fontSizes.s9 : theme.fontSizes.s12,
          fontWeight: theme.fontWeights.bold,
          text: lastItem.outbound + Array.from(unit)[0],
          fill: outboundColor,
          opacity: 0.2,
        },
      },
    ];
  }, [dataset, theme, isTiny, inboundColor, outboundColor, unit]);

  const options = {
    color: [theme.colors.series[10], theme.colors.series[11]],
    title: {
      text: `네트워크 트래픽(${unit})`,
      left: 'center',
      textStyle: {
        fontSize: isTiny ? theme.fontSizes.s2 : theme.fontSizes.s4,
        fontWeight: isTiny ? theme.fontWeights.medium : theme.fontWeights.bold,
        fontFamily: theme.default.fontFamily,
        color: theme.colors.textMain,
      },
    },
    dataset,
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    xAxis: {
      type: 'category',
      show: Boolean(dataset.source.length),
      axisLabel: {
        color: theme.colors.chartLabel,
      },
    },
    yAxis: {
      type: 'value',
      splitNumber: isTiny ? 2 : 5,
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
        name: 'Inbound',
        showSymbol: false,
        encode: {
          x: 'datetime',
          y: 'inbound',
        },
        tooltip: {
          valueFormatter: value => value + unit,
        },
      },
      {
        type: 'line',
        name: 'Outbound',
        showSymbol: false,
        encode: {
          x: 'datetime',
          y: 'outbound',
        },
        tooltip: {
          valueFormatter: value => value + unit,
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

export default DoubleTrafficLineChart;
