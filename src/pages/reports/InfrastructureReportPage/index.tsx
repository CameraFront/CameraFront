import { useCallback, useLayoutEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Tabs, TreeDataNode } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularSearchableTree from '@/components/RegularSearchableTree';
import { useAppDispatch } from '@/app/hooks';
import { resetState } from '@/features/reports/infrastructureReportPage/infrastructureReportSlice';

const tabItems = [
  {
    key: 'facility-status',
    label: '설비 현황',
  },
  {
    key: 'event-statistics',
    label: '장애 통계',
  },
  {
    key: 'performance-statistics',
    label: '성능 통계',
  },
];

// 구축설비 보고서 페이지
const InfrastructureReportPage = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const onChangeTab = (key: string) => {
    const pathSegments = pathname.split('/');
    pathSegments[2] = key;
    const newPath = pathSegments.join('/');
    navigate(newPath);
  };

  const checkIfSelectable = useCallback(
    (selectedNode: TreeDataNode) => !!selectedNode.isLeaf,
    [],
  );

  useLayoutEffect(
    () => () => {
      dispatch(resetState());
    },
    [dispatch],
  );

  return (
    <Wrapper>
      <div className="main-header">
        <Breadcrumb
          items={[
            {
              title: '홈',
            },
            {
              title: '보고서',
            },
            // {
            //   title: '구축설비 보고서',
            // },
          ]}
        />
      </div>
      <div className="main-content">
        <aside className="aside-tree">
          <RegularSearchableTree checkIfSelectable={checkIfSelectable} />
        </aside>
        <div className="content-side">
          <Tabs
            activeKey={pathname.split('/')[2]}
            items={tabItems}
            onChange={onChangeTab}
          />
          <Outlet />
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  gap: 0.5rem;
  padding: 0 1rem;
  min-height: 100%;

  .main-header {
    padding: 0 0 0 0.6rem;
  }

  .main-content {
    flex: 1;
    display: flex;
    gap: 1.6rem;

    width: 100%;
    height: 100%;

    .aside-tree {
      /* align-self: flex-start; */
      flex: 0 0 20%;

      max-width: 36rem;
      padding: 2.4rem 2rem;
      background-color: ${themeGet('colors.bgSection')};
      // border: 1px solid ${themeGet('colors.borderSection')};
      box-shadow: 0 0 10px ${themeGet('colors.chartSplitLine')};
      border-radius: ${themeGet('borderRadius.xLarge')};
    }

    .content-side {
      flex: 1;
      padding: 1rem 2rem;
      background-color: ${themeGet('colors.bgSection')};
      // border: 1px solid ${themeGet('colors.borderSection')};
      box-shadow: 0 0 10px ${themeGet('colors.chartSplitLine')};
      border-radius: ${themeGet('borderRadius.xLarge')};
    }
  }
`;
export default InfrastructureReportPage;
