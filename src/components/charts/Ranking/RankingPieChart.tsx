import { useRef } from 'react';
import { DEFAULT_CHART_HEIGHT } from '@/config';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { truncateFloatToNDecimals } from '@/utils/formatters';

interface Props {
  name?: string;
  dataset: Dataset;
  width?: string;
  minHeight?: string;
  colors: string[];
  unit: '%' | 'Mbps';
  radius?: string;
}

interface DataItem {
  name: string;
  value: number;
}

interface Dataset {
  dimensions: string[];
  source: DataItem[];
}

const RankingPieChart = ({
  name = '',
  dataset,
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  colors,
  unit = '%',
  radius = '90%',
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const options = {
    color: colors,
    title: {
      show: name ? true : false,
      text: name + '(' + unit + ')',
      // left: 'right',
      top: 'top',
      textStyle: {
        fontSize: theme.fontSizes.s3,
        color: theme.colors.textMain,
      },
    },
    tooltip: {
      trigger: 'item',
      valueFormatter: value => {
        return value + unit;
      },
    },
    dataset,
    series: [
      {
        type: 'pie',
        radius,
        center: ['50%', '50%'],
        encode: {
          itemName: 'name',
          value: 'value',
        },
        label: {
          position: 'inside',
          formatter: function (params) {
            const data = params.data as DataItem;
            if (data.value === 0) return '';

            return (
              data.value.toString() +
              '%' +
              '(' +
              truncateFloatToNDecimals(params.percent, 0) +
              '%' +
              ')'
            );
          },
          fontSize: theme.fontSizes.s3,
          fontWeight: theme.fontWeights.bold,
          color: theme.colors.black,
          textBorderColor: theme.colors.white,
          textBorderWidth: 2,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 4,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
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
  overflow: hidden;
`;

export default RankingPieChart;
