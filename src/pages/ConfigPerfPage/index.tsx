import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, Tabs, TabsProps } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularSearchableTree from '@/components/RegularSearchableTree';
import { useAppDispatch } from '@/app/hooks';
import { resetState } from '@/features/configPerfPage/configPerfSlice';
import { useGetConfigDeviceDetailsQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { ResManageYn } from '@/types/enum';

const items: TabsProps['items'] = [
  {
    key: 'config',
    label: '화각분석',
  },
  // {
  //   key: 'perf',
  //   label: '성능',
  // },
  // {
  //   key: 'process',
  //   label: '프로세스',
  // },
];

const ConfigPerfPage = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { deviceId } = useParams();
  const parsedDeviceId = intIdSchema.parse(deviceId);
  const { data: deviceDetail } = useGetConfigDeviceDetailsQuery(
    parsedDeviceId ?? 0,
    {
      skip: !deviceId,
    },
  );

  const onChangeTab = (key: string) => {
    const pathSegments = pathname.split('/');
    pathSegments[2] = key;
    const newPath = pathSegments.join('/');
    navigate(newPath);
  };

  const tabItems = useMemo(() => {
    if (!deviceId || !deviceDetail) return items;
    if (
      (deviceDetail.deviceKind === 1 ||
        deviceDetail.deviceKind === 2 ||
        deviceDetail.deviceKind === 9) &&
      deviceDetail.manageYn === ResManageYn.관리
    )
      return items;
    return items.filter(item => item.key !== 'perf');
  }, [deviceId, deviceDetail]);

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
              title: '화각 분석',
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
export default ConfigPerfPage;
