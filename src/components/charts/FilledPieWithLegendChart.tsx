import { memo, useRef } from 'react';
import { DEFAULT_CHART_HEIGHT } from '@/config';
import styled from 'styled-components';
import useCharts from '@/hooks/useCharts';

interface Props {
  title?: string;
  name?: string;
  dataset: Dataset;
  width?: string;
  minHeight?: string;
  colors: string[];
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

type Options = echarts.EChartsOption & { series: echarts.PieSeriesOption };

const FilledPieWithLegendChart = ({
  title = '',
  name = '',
  dataset,
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  colors,
  radius = '90%',
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const options: Options = {
    title: {
      text: title,
      left: 'center',
      // top: 0,
      textStyle: {
        fontSize: 16,
      },
    },
    legend: {
      show: true,
      orient: 'vertical',
      right: '5%',
      top: 'center',
    },
    color: colors,
    tooltip: {
      trigger: 'item',
    },
    dataset,
    series: [
      {
        ...(title && { top: 24 }),
        center: ['40%', '50%'],
        name,
        type: 'pie',
        radius,
        encode: {
          itemName: 'name',
          value: 'value',
        },
        label: {
          position: 'inside',
          formatter(params) {
            const data = params.data as DataItem;
            return `${data.value.toString()}(${params.percent}%)`;
          },
          fontSize: 14,
          fontWeight: 600,
          color: '#000',
          textBorderColor: '#fff',
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
  };

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

const NamedFilledPieWithLegendChart = memo(FilledPieWithLegendChart);
export default NamedFilledPieWithLegendChart;
