import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Tabs, TabsProps } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularSearchableTree from '@/components/RegularSearchableTree';
import { useAppDispatch } from '@/app/hooks';
import { resetState } from '@/features/eventsPage/eventsSlice';

const items: TabsProps['items'] = [
  {
    key: 'status',
    label: '장애 현황',
  },
  {
    key: 'history',
    label: '장애 이력',
  },
  // {
  //   key: 'repeated',
  //   label: '중복 장애',
  // },
];

const EventsPage = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const onChange = (key: string) => {
    const pathSegments = pathname.split('/');
    pathSegments[2] = key;
    const newPath = pathSegments.join('/');
    navigate(newPath);
  };

  // TODO: Redux Middleware에서 라우트 변경시 상태 초기화
  useEffect(
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
              title: '장애',
            },
          ]}
        />
      </div>
      <div className="main-content">
        <aside className="aside-tree">
          <RegularSearchableTree />
        </aside>
        <div className="content-side">
          <Tabs
            activeKey={pathname.split('/')[2]}
            items={items}
            onChange={onChange}
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

    padding-bottom: 1rem;

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
      flex: 1 0 70%;
      padding: 1rem 2rem;
      background-color: ${themeGet('colors.bgSection')};
      // border: 1px solid ${themeGet('colors.borderSection')};
      box-shadow: 0 0 10px ${themeGet('colors.chartSplitLine')};
      border-radius: ${themeGet('borderRadius.xLarge')};
    }
  }
`;
export default EventsPage;
