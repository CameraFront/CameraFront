import { useLayoutEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Breadcrumb } from 'antd';
import { styled } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useWebSocketAlert } from '@/hooks/useWebSocketAlert';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { resetState } from '@/features/rackLayoutPage/rackLayoutSlice';
import ArtBoard from './ArtBoard';
import Header from './Header';
import SearchableTree from './SearchableTree';

const RackLayoutPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading: isRackLayoutLoading, isFullScreenMode } = useAppSelector(
    store => store.rackLayout,
  );
  const { isLoading: isTopologyLoading } = useAppSelector(
    store => store.topology,
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
        <LoadingSpinner
          spinning={isTopologyLoading || isRackLayoutLoading}
          wrapperClassName="spin-wrapper"
        >
          <div className="main-header">
            <Breadcrumb
              items={[
                {
                  title: '홈',
                },
                {
                  title: '랙실장도',
                },
              ]}
            />
          </div>
          <div className="main-content">
            <aside className="aside-tree">
              <SearchableTree />
            </aside>
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

    .aside-tree {
      /* align-self: flex-start; */
      flex: 0 0 20%;

      max-width: 36rem;
      padding: 2.4rem 2rem;
      background-color: ${themeGet('colors.bgSection')};
      //border: 1px solid ${themeGet('colors.borderSection')};
      box-shadow: 0 0 10px ${themeGet('colors.chartSplitLine')};
      border-radius: ${themeGet('borderRadius.xLarge')};
      max-height: calc(100vh - 50px);
    }

    .editor-side {
      flex: 1;
      /* flex: 0 0 80%; */
      margin-right: 0.2rem;
      padding: 1.6rem 3.2rem;
      background-color: ${themeGet('colors.bgSection')};
      //border: 1px solid ${themeGet('colors.borderSection')};
      box-shadow: 0 0 10px ${themeGet('colors.chartSplitLine')};
      border-radius: ${themeGet('borderRadius.xLarge')};
    }
  }

  .spin-wrapper {
    width: 100%;
    height: 100%;
  }
`;

export default RackLayoutPage;
