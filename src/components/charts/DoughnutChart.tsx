import { memo, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { useAppSelector } from '@/app/hooks';
import { DEFAULT_CHART_HEIGHT } from '@/config';

interface Props {
  centerText?: string;
  name?: string;
  dataset: Dataset;
  width?: string;
  minHeight?: string;
  colors: string[];
  size?: 'small' | 'medium';
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

const DoughnutChart = ({
  centerText = '',
  name = '',
  dataset,
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  colors,
  size = 'medium',
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useAppSelector(store => store.global);
  const theme = useTheme();

  const options: Options = {
    graphic: {
      // 총 합계
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: centerText,
        fontSize: size === 'small' ? theme.fontSizes.s6 : theme.fontSizes.s7,
        fontWeight: theme.fontWeights.bold,
        fill: isDarkMode ? theme.colors.white : theme.colors.black,
      },
    },
    title: {
      show: false,
    },
    color: colors,
    tooltip: {
      trigger: 'item',
      valueFormatter(value) {
        return `${value}개`;
      },
      confine: true,
    },
    dataset,
    series: [
      {
        name,
        type: 'pie',
        radius: ['45%', '90%'],
        encode: {
          itemName: 'name',
          value: 'value',
        },
        label: {
          show: false,
          position: 'center',
        },
        // itemStyle: {
        //   color: (params: any) => {
        //     const color = colors[params.dataIndex % colors.length];

        //     return {
        //       type: 'linear',
        //       x: 1,  // 그라데이션 시작점 x 좌표 (오른쪽)
        //       y: 0,  // 그라데이션 시작점 y 좌표 (상단)
        //       x2: 0, // 그라데이션 끝점 x 좌표 (왼쪽)
        //       y2: 0, // 그라데이션 끝점 y 좌표 (상단)
        //       colorStops: [
        //         { offset: 0, color: color },         // 시작 색상 (완전한 색상)
        //         { offset: 1, color: `${color}00` },  // 끝 색상 (완전 투명)
        //       ],
        //       global: false,
        //     };
        //   },
        // },
      },
    ],
  };

  const { resetChart } = useCharts(containerRef, options);

  useEffect(() => {
    resetChart();
  }, [isDarkMode, resetChart]);

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

export default memo(DoughnutChart);
