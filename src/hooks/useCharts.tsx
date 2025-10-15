// ECharts instance를 생성, 초기화 및 리사이징하는 Custom Hook
import { useCallback, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const useCharts = (
  containerRef: React.RefObject<HTMLDivElement>,
  options: echarts.EChartsOption,
) => {
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const initChart = useCallback(() => {
    if (!containerRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    chartInstance.current = echarts.init(containerRef.current);
    chartInstance.current.setOption(
      options as echarts.EChartOption<echarts.EChartOption.Series>,
    );

    const handleResize = () => {
      if (chartInstance.current && !chartInstance.current.isDisposed()) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleResize);
      if (chartInstance.current && !chartInstance.current.isDisposed()) {
        chartInstance.current.dispose();
      }
      chartInstance.current = null;
    };
  }, [containerRef, options]);

  useEffect(() => {
    const cleanup = initChart();
    return cleanup;
  }, [initChart]);

  useEffect(() => {
    if (chartInstance.current && !chartInstance.current.isDisposed()) {
      chartInstance.current.setOption(
        options as echarts.EChartOption<echarts.EChartOption.Series>,
      );
    }
  }, [options]);

  const fitToContainer = useCallback(() => {
    if (
      !containerRef.current ||
      !chartInstance.current ||
      chartInstance.current.isDisposed()
    )
      return;

    const containerHeight = containerRef.current.clientHeight;
    const containerWidth = containerRef.current.clientWidth;

    chartInstance.current.resize({
      width: containerWidth,
      height: containerHeight,
    });
  }, [containerRef]);

  const resetChart = useCallback(() => {
    initChart();
  }, [initChart]);

  return {
    chartInstance:
      chartInstance.current && !chartInstance.current.isDisposed()
        ? chartInstance.current
        : null,
    fitToContainer,
    resetChart,
  };
};

export default useCharts;
