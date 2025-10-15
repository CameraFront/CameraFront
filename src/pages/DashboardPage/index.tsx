import { useCallback, useEffect, useRef } from 'react';
import ReactGridLayout, { CoreProps, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { App } from 'antd';
import styled from 'styled-components';
import { nanoid } from '@reduxjs/toolkit';
import themeGet from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useWebSocketAlert } from '@/hooks/useWebSocketAlert';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  resetState,
  setDroppingItem,
  setFullScreenMode,
  setFullScreenTarget,
  setLayoutItems,
} from '@/features/dashboardPage/dashboardSlice';
import { useWidgetHeightContext } from '@/features/dashboardPage/widget-height/use-widget-height-context';
import {
  useLazyGetDefaultWidgetListQuery,
  useLazyGetWidgetListQuery,
  useUpdateWidgetLayoutsMutation,
} from '@/services/api/dashboard';
import { WIDGET_CONFIG } from '@/config';
import Header from './Header';
import Sidebar from './Sidebar';
import WidgetCard from './WidgetCard';

const GridLayout = WidthProvider(ReactGridLayout);

const DashboardPage = () => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const {
    menuSider: { isCollapsed },
    isAlarmPopupOn,
    isAlarmOn,
    isDarkMode,
    isAudibleOn,
  } = useAppSelector(store => store.global);
  const { isFullScreenMode, isEditMode, layoutItems, droppingItem } =
    useAppSelector(store => store.dashboard);
  const { widgetHeight } = useWidgetHeightContext();
  const { renderCriticalEventModal } = useWebSocketAlert({
    isAlarmOn,
    isAudibleOn,
    isDarkMode,
    isAlarmPopupOn,
    onMessage: () => {
      getWidgetList();
    },
  });
  const [
    getDefaultWidgetList,
    { data: defaultWidgetList, error: defaultWidgetListError },
  ] = useLazyGetDefaultWidgetListQuery();
  const [getWidgetList, { isLoading, error: widgetListError }] =
    useLazyGetWidgetListQuery();
  const [updateWidgetLayouts] = useUpdateWidgetLayoutsMutation();

  if (defaultWidgetListError || widgetListError) {
    message.error('위젯 목록을 불러오는데 실패했습니다.');
    console.error(
      '위젯 목록을 불러오는데 실패했습니다.',
      `${defaultWidgetListError}: defaultWidgetListError`,
      `${widgetListError}: widgetListError`,
    );
  }

  const toggleFullScreen = useCallback(() => {
    if (document.fullscreenElement) return dispatch(setFullScreenMode(true));

    dispatch(setFullScreenMode(false));
  }, [dispatch]);

  // 새 위젯 추가시
  const onDrop: CoreProps['onDrop'] = (layout, layoutItem) => {
    if (!layoutItems) {
      message.warning('위젯이 존재하지 않습니다.');
      return;
    }

    const overflowed = layout.filter(l => l.y > WIDGET_CONFIG.rows - 1);
    if (overflowed.length) {
      message.warning('위젯이 화면을 벗어납니다.');
      dispatch(setDroppingItem(undefined));
      return;
    }

    const { i, x, y, w, h } = layoutItem;
    const newLayoutItems = layoutItems.map((l, i) => ({
      ...l,
      x: layout[i].x,
      y: layout[i].y,
    }));

    const defaultWidget = defaultWidgetList?.find(widget => widget.title === i);
    if (!defaultWidget) return;

    const id = `${
      defaultWidget.title
    }__${defaultWidget.type.toString()}##${nanoid()}`;

    newLayoutItems.push({
      i: id,
      x,
      y,
      w,
      h,
      data: {
        ...defaultWidget,
        id,
      },
    });

    updateWidgetLayouts(newLayoutItems);
    dispatch(setDroppingItem(undefined));
  };

  // 위젯 크기 변경시
  const onResizeDone: CoreProps['onResizeStop'] = layout => {
    const overflowed = layout.filter(l => l.y > WIDGET_CONFIG.rows - 1);
    if (overflowed.length) {
      message.warning('위젯이 화면을 벗어납니다.');
      return dispatch(setLayoutItems([...layoutItems]));
    }

    const newLayoutItems = layoutItems.map((l, i) => ({
      ...l,
      w: layout[i].w,
      h: layout[i].h,
      data: {
        ...l.data,
        dimension: {
          ...l.data.dimension,
          w: layout[i].w,
          h: layout[i].h,
        },
      },
    }));

    updateWidgetLayouts(newLayoutItems);
  };

  // 위젯 위치 변경시
  const onMoveDone: CoreProps['onResizeStop'] = layout => {
    const overflowed = layout.filter(l => l.y > WIDGET_CONFIG.rows - 1);
    if (overflowed.length) {
      message.warning('위젯이 화면을 벗어납니다.');
      return dispatch(setLayoutItems([...layoutItems]));
    }
    //   return dispatch(setLayoutItems([...layoutItems]));
    // }

    const newLayoutItems = layoutItems.map((l, i) => ({
      ...l,
      x: layout[i].x,
      y: layout[i].y,
    }));

    updateWidgetLayouts(newLayoutItems);
  };

  // 최초 위젯 목록 가져오기
  useEffect(() => {
    getWidgetList();
  }, [getWidgetList]);

  // 전체화면 모드 이벤트 등록/제거
  useEffect(() => {
    dispatch(setFullScreenTarget(contentRef.current));

    document.documentElement.addEventListener(
      'fullscreenchange',
      toggleFullScreen,
    );

    return () => {
      document.documentElement.removeEventListener(
        'fullscreenchange',
        toggleFullScreen,
      );
      dispatch(resetState());
    };
  }, [dispatch, toggleFullScreen]);

  // 사이드바, 전체화면 모드 변경 시 레이아웃 재배치
  useEffect(() => {
    for (let t = 0; t <= 300; t += 10) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, t);
    }
  }, [isCollapsed, isEditMode, isFullScreenMode]);

  // 화면을 모두 렌더링한 뒤(2초뒤) 위젯편집시 사용할 기본위젯목록을 미리 가져와서 저장해놓음
  useEffect(() => {
    setTimeout(() => {
      getDefaultWidgetList();
    }, 2000);
  }, [getDefaultWidgetList]);

  return (
    <Wrapper $isFullScreenMode={isFullScreenMode}>
      {renderCriticalEventModal()}
      <LoadingSpinner spinning={isLoading}>
        <Header />
        <div ref={contentRef} className="layout-wrapper">
          {isEditMode && <Sidebar />}
          <GridLayout
            style={{
              userSelect: isEditMode ? 'none' : 'auto',
            }}
            draggableHandle=".draggable-handle"
            className="layout"
            layout={layoutItems}
            cols={WIDGET_CONFIG.cols}
            rowHeight={widgetHeight}
            containerPadding={[0, 0]}
            isDraggable={isEditMode}
            isResizable={isEditMode}
            isBounded
            onDrop={onDrop}
            isDroppable
            onResizeStop={onResizeDone}
            onDragStop={onMoveDone}
            droppingItem={droppingItem}
            maxRows={WIDGET_CONFIG.rows}
          >
            {layoutItems.map(item => (
              <div key={item.data.id}>
                <WidgetCard
                  data={item.data}
                  id={item.data.id}
                  w={item.w}
                  h={item.h}
                />
              </div>
            ))}
          </GridLayout>
        </div>
      </LoadingSpinner>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $isFullScreenMode: boolean }>`
  padding: 0 1.6rem;
  height: 100%;
  overflow: hidden;

  .layout-wrapper {
    display: flex;
    gap: 2rem;

    .layout {
      flex: 1;
      min-height: 100%;

      .react-grid-item.react-grid-placeholder {
        background-color: ${themeGet('colors.bgWidgetPlaceholder')};
        border-radius: ${themeGet('borderRadius.normal')};
      }
    }
  }

  .react-grid-item > .react-resizable-handle::after {
    width: 8px;
    height: 8px;
    border-right: 2px solid ${themeGet('colors.primary')};
    border-bottom: 2px solid ${themeGet('colors.primary')};
    border-radius: 1px;
  }
`;

export default DashboardPage;
