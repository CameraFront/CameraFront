import { useRef, useEffect, memo } from 'react';
import styled, { css } from 'styled-components';
import * as echarts from 'echarts';
import { light } from '@/css/theme';

interface Props {
  name?: string;
  dataset: Dataset;
  width?: string | number;
  height?: string | number;
  colors: string[];
  radius?: string;
  unit: string;
  isCustomLabel?: boolean;
}

interface DataItem {
  name: string;
  value: number;
}

interface Dataset {
  dimension: string[];
  source: DataItem[];
}

type Options = echarts.EChartsOption & { series: echarts.PieSeriesOption };

function LabelLinePieChart({
  name = '',
  dataset,
  width = '100%',
  height = '100%',
  colors,
  radius = '90%',
  unit,
  isCustomLabel = false,
}: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    function resizeChart() {
      chartInstance?.resize();
    }
    window.addEventListener('resize', resizeChart);

    const option: Options = {
      color: colors,
      tooltip: {
        trigger: 'item',
      },
      xAxis: {
        axisLabel: {
          color: light.colors.chartLabel,
        },
      },
      yAxis: {
        axisLabel: {
          color: light.colors.chartLabel,
        },
      },
      dataset,
      series: [
        {
          name,
          type: 'pie',
          radius,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
          label: {
            alignTo: 'edge',
            formatter: params => {
              const data = params.data as DataItem;

              return `{name|${params.name}}\n{value|${
                data.value
              }${unit}}{per|(${params.percent || 0}%)}`;
            },
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 24,
            rich: {
              name: {
                fontSize: light.fontSizes.s3,
                fontWeight: light.fontWeights.bold,
              },
              value: {
                fontSize: light.fontSizes.s3,
                color: light.colors.textMain,
              },
              per: {
                fontSize: light.fontSizes.s3,
                color: light.colors.textSub,
              },
            },
          },
          labelLine: {
            length: 2,
            length2: 0,
            maxSurfaceAngle: 80,
          },
          labelLayout(params) {
            const isLeft = params.labelRect.x < chartInstance.getWidth() / 2;
            const points = params.labelLinePoints;

            if (!points) return params;

            points[2][0] = isLeft
              ? params.labelRect.x
              : params.labelRect.x + params.labelRect.width;

            return {
              labelLinePoints: points,
            };
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

    // @ts-ignore
    // FIXME
    chartInstance.setOption(option);

    return () => {
      chartInstance?.dispose();
      window.removeEventListener('resize', resizeChart);
    };
  }, [dataset, colors, unit, radius, name]);

  return (
    <Block
      ref={chartRef}
      width={width}
      height={height}
      $isCustomLabel={isCustomLabel}
    />
  );
}

const Block = styled.div<{
  width: Props['width'];
  height: Props['height'];
  $isCustomLabel: Props['isCustomLabel'];
}>`
  width: ${({ width }) => width};
  min-height: ${({ height }) => height};

  overflow: hidden;
  ${({ $isCustomLabel }) =>
    $isCustomLabel &&
    css`
      margin: 0 auto;
    `}
`;
export default memo(LabelLinePieChart);
