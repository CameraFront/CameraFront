import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Tabs, TabsProps } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularSearchableTree from '@/components/RegularSearchableTree';

const items: TabsProps['items'] = [
  {
    key: 'unregistered',
    label: '전화기 미등록 현황',
  },
  // {
  //   key: 'statistics',
  //   label: '전화기 통계',
  // },
  {
    key: 'current-call-trend',
    label: '현재 통화 추이',
  },
  {
    key: 'call-peak-trend',
    label: '통화 피크 추이',
  },
];

const TelephoneExchangePage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const onChange = (key: string) => {
    const pathSegments = pathname.split('/');
    pathSegments[2] = key;

    if (key === 'current-call-trend' || key === 'call-peak-trend') {
      const newPath = pathSegments.slice(0, 3).join('/');
      navigate(newPath);
    } else {
      const newPath = pathSegments.join('/');
      navigate(newPath);
    }
  };

  const tabKey = pathname.split('/')[2];
  const notUsingTree =
    tabKey === 'current-call-trend' || tabKey === 'call-peak-trend';

  return (
    <Wrapper>
      <div className="main-header">
        <Breadcrumb
          items={[
            {
              title: '홈',
            },
            {
              title: '교환기',
            },
          ]}
        />
      </div>
      <div className="main-content">
        <aside className="aside-tree">
          <RegularSearchableTree disabled={notUsingTree} />
        </aside>
        <div className="content-side">
          <Tabs activeKey={tabKey} items={items} onChange={onChange} />
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
export default TelephoneExchangePage;
