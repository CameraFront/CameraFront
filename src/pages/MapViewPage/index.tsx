import { useLayoutEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Breadcrumb } from 'antd';
import { styled } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useWebSocketAlert } from '@/hooks/useWebSocketAlert';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { resetState } from '@/features/railwayMapPage/railwayMapSlice';
import ArtBoard from './ArtBoard';
import Header from './Header';

const MapViewPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isFullScreenMode } = useAppSelector(
    state => state.railwayMap,
  );
  const { isAlarmOn, isAlarmPopupOn, isAudibleOn, isDarkMode } = useAppSelector(
    store => store.global,
  );
  const { renderCriticalEventModal } = useWebSocketAlert({
    isAlarmOn,
    isAudibleOn,
    isDarkMode,
    isAlarmPopupOn,
  });

  // 페이지를 떠날 때 상태 초기화
  useLayoutEffect(
    () => () => {
      dispatch(resetState());
    },
    [dispatch],
  );

  return (
    <ReactFlowProvider>
      <Wrapper $isFullScreenMode={isFullScreenMode}>
        {renderCriticalEventModal()}
        <LoadingSpinner spinning={isLoading} wrapperClassName="spin-wrapper">
          <div className="main-header">
            <Breadcrumb
              items={[
                {
                  title: '홈',
                },
                {
                  title: '맵현황',
                },
              ]}
            />
          </div>
          <div className="main-content">
            <div className="editor-side">
              <Header />
              <ArtBoard />
            </div>
          </div>
        </LoadingSpinner>
      </Wrapper>
    </ReactFlowProvider>
  );
};

const Wrapper = styled.div<{ $isFullScreenMode: boolean }>`
  padding: 0 1rem;
  height: 100%;

  .ant-spin-nested-loading {
    position: ${({ $isFullScreenMode }) =>
      $isFullScreenMode ? 'unset' : 'relative'};

    .ant-spin-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      position: ${({ $isFullScreenMode }) =>
        $isFullScreenMode ? 'unset' : 'relative'};
      height: 100%;
      overflow: hidden;
    }
  }

  .main-header {
    padding: 0 0 0 0.6rem;
  }

  .main-content {
    flex: 1;
    display: flex;
    gap: 1.6rem;

    width: 100%;
    height: 100%;

    padding-bottom: 1rem;

    .editor-side {
      flex: 1;
      /* flex: 0 0 80%; */

      margin-right: 0.2rem;
      padding: 1.6rem 3.2rem;
      background-color: ${themeGet('colors.bgSection')};
      // border: 1px solid ${themeGet('colors.borderSection')};
      box-shadow: 0 0 10px ${themeGet('colors.chartSplitLine')};
      border-radius: ${themeGet('borderRadius.xLarge')};
    }
  }

  .spin-wrapper {
    width: 100%;
    height: 100%;
  }
`;

export default MapViewPage;
