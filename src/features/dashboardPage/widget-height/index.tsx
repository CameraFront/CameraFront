import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { WIDGET_CONFIG } from '@/config';

export const WidgetHeightContext = createContext<
  | {
      widgetHeight: number;
      widgetContentHeight: number;
      getWidgetHeightByH: (h: number) => number;
      getChartHeightByH: (h: number) => number;
    }
  | undefined
>(undefined);

const GLOBAL_HEADER_HEIGHT = 70;
const PAGE_HEADER_HEIGHT = 26;
const WIDGET_GAPS = WIDGET_CONFIG.gap * (WIDGET_CONFIG.rows - 1);
const WIDGET_PADDING = 20;

// TODO: reducer로 값과 함수 분리
const WidgetHeightProvider = ({ children }: { children: ReactNode }) => {
  const isFullscreen = useAppSelector(
    state => state.dashboard.isFullScreenMode,
  );
  const [widgetHeight, setWidgetHeight] = useState<number>(0);

  useEffect(() => {
    const calculateWidgetHeight = () => {
      const contentHeight = window.innerHeight;

      const defaultOffset = WIDGET_GAPS;
      const offset = isFullscreen
        ? defaultOffset
        : defaultOffset + GLOBAL_HEADER_HEIGHT + PAGE_HEADER_HEIGHT;
      setWidgetHeight((contentHeight - offset) / WIDGET_CONFIG.rows);
    };

    calculateWidgetHeight();
    window.addEventListener('resize', calculateWidgetHeight);
    return () => window.removeEventListener('resize', calculateWidgetHeight);
  }, [isFullscreen]);

  const value = useMemo(() => {
    const widgetContentHeight = widgetHeight - WIDGET_CONFIG.headerHeight - 2;
    const getWidgetHeightByH = (h: number) =>
      widgetContentHeight +
      widgetHeight * (h - 1) +
      WIDGET_CONFIG.gap * (h - 1);

    return {
      widgetHeight,
      widgetContentHeight,
      getWidgetHeightByH,
      getChartHeightByH: (h: number) => getWidgetHeightByH(h) - WIDGET_PADDING,
    };
  }, [widgetHeight]);

  return (
    <WidgetHeightContext.Provider value={value}>
      {children}
    </WidgetHeightContext.Provider>
  );
};

export default WidgetHeightProvider;
