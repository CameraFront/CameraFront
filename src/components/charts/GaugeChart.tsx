import { memo, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import useCharts from '@/hooks/useCharts';
import { useAppSelector } from '@/app/hooks';
import { DEFAULT_CHART_HEIGHT } from '@/config';

interface Props {
  value: number;
  max: number;
  width?: string;
  minHeight?: string;
}

type Options = echarts.EChartsOption & { series: echarts.GaugeSeriesOption };

const GaugeChart = ({
  width = '100%',
  minHeight = DEFAULT_CHART_HEIGHT,
  value,
  max,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useAppSelector(store => store.global);
  const theme = useTheme();

  const options: Options = {
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    graphic: {
      type: 'group',
      rotation: Math.PI,
      bounding: 'raw',
      left: 'center',
      bottom: '8.5%',
      children: [
        {
          type: 'arc',
          shape: { r: 20, startAngle: 0, endAngle: Math.PI },
          style: {
            fill: isDarkMode ? '#4892FF' : '#121C72',
            stroke: isDarkMode ? '#4892FF' : '#121C72',
          },
        },
        {
          type: 'arc',
          shape: { r: 5, startAngle: 0, endAngle: Math.PI },
          style: {
            fill: isDarkMode ? '#05092F' : '#FFF',
            stroke: 'transparent',
          },
        },
      ],
    },
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max,
        radius: '160%',
        center: ['50%', '90%'],
        itemStyle: {
          color: isDarkMode ? '#4892FF' : '#352C81',
          // shadowColor: 'hsla(244, 72%, 25%, 0.4)',
          // shadowBlur: 4,
          // shadowOffsetX: 2,
          // shadowOffsetY: 2,
        },
        progress: {
          show: true,
          //roundCap: true,
          width: 25,
        },
        pointer: {
          // icon: "image://data:image/svg+xml,%3Csvg width='12' height='39' viewBox='0 0 12 39' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11.1961 10.5L5.99998 0L0.803833 10.5H4.99998V39H6.99998V10.5H11.1961Z' fill='url(%23paint0_linear_18_16)'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_18_16' x1='5.99998' y1='0' x2='5.99998' y2='39' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23121C72'/%3E%3Cstop offset='0.3' stop-color='%23121C72' stop-opacity='0.9'/%3E%3Cstop offset='1' stop-color='white' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A",
          icon: 'path://M6 0L0.226497 10L11.7735 10L6 0ZM5 9L5 48L7 48L7 9L5 9Z',
          length: '35%',
          width: 13,
          offsetCenter: [0, '-10%'],
          itemStyle: {
            color: isDarkMode ? '#579BFF' : '#242D7D',
            shadowColor: 'rgba(0, 0, 0, 0.25)',
            shadowBlur: 2,
            shadowOffsetX: 0,
            shadowOffsetY: 2,
          },
          
        },
        axisLine: {
          // /roundCap: true,
          lineStyle: {
            width: 25,
            color: [
              [0, '#E9E6F7'],
              [1, '#E9E6F7'],
            ],
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          offsetCenter: [0, '-40%'],
          valueAnimation: true,
          formatter(value) {
            return `{value|${value.toFixed(0)}}{unit|/ ${max}}`;
          },
          rich: {
            value: {
              fontSize: 30,
              fontWeight: 'bolder',
              color: isDarkMode ? '#4892FF' : '#121C72',
              lineHeight: 36,
            },
            unit: {
              fontSize: 18,
              lineHeight: 40,
              color: isDarkMode ? '#E2E2E2' : '#5A5A5A',
              padding: [0, 0, -7, 5],
            },
          },
        },
        data: [
          {
            value,
          },
        ],
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

export default memo(GaugeChart);
