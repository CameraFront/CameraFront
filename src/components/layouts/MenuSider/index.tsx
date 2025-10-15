import { Key, ReactNode, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import styled from 'styled-components';
import {
  AlertOutlined,
  ContainerOutlined,
  DashboardOutlined,
  DeploymentUnitOutlined,
  DesktopOutlined,
  HddOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setMenuCollapsed,
  setSelectedMenu,
} from '@/features/global/globalSlice';
import { RoleGroupId } from '@/features/global/types';
import IconTelephoneExchange from '@/assets/icon__telephone-exchange.svg?react';
import { ROUTES } from '@/config/routes';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const getMenuItem = (
  label: ReactNode | null,
  key: Key,
  icon?: ReactNode,
  children?: MenuItem[],
) =>
  ({
    key,
    icon,
    children,
    label: children?.length ? label : <Link to={`/${key}`}>{label}</Link>,
  }) as MenuItem;

const MenuSider = () => {
  const dispatch = useAppDispatch();
  const {
    isDarkMode,
    user,
    menuSider: { isCollapsed, selectedMenu },
  } = useAppSelector(store => store.global);
  const { pathname } = useLocation();

  useEffect(() => {
    dispatch(setSelectedMenu(pathname.split('/')[1]));
  }, [pathname, dispatch]);

  const menuItems: MenuItem[] = useMemo(() => {
    const items = [
      getMenuItem('대시보드', ROUTES.DASHBOARD.slice(1), <DesktopOutlined />),
      getMenuItem(
        '토폴로지',
        ROUTES.TOPOLOGY.slice(1),
        <DeploymentUnitOutlined />,
      ),
      getMenuItem(
        '구성·성능',
        ROUTES.CONFIG_PERF.slice(1),
        <DashboardOutlined />,
      ),
      getMenuItem('장애', 'events', <AlertOutlined />),
      getMenuItem('보고서', 'infrastructure-reports', <ContainerOutlined />),
      getMenuItem('랙실장도', 'rack-layout', <HddOutlined />),
      getMenuItem('맵현황', 'map-view', <NodeIndexOutlined />),
      // getMenuItem('교환기', 'telephone-exchange', <IconTelephoneExchange />),
      // getMenuItem('보고서', 'reports', <ContainerOutlined />, [
      //   getMenuItem('구축설비 보고서', 'infrastructure-report'),
      //   getMenuItem('시설물 보고서', 'facilities-report'),
      // ]),
      // getMenuItem('보고서', 'infrastructure-reports', <ContainerOutlined />),
    ];

    const isNormalUser =
      user?.login.roleGroupId !== RoleGroupId.DEVELOPER &&
      user?.login.roleGroupId !== RoleGroupId.ADMIN;

    if (!isNormalUser) {
      // items.push(getMenuItem('노선도', 'railway-map', <NodeIndexOutlined />));
      // items.push(getMenuItem('랙실장도', 'rack-layout', <HddOutlined />));
    }

    return items;
  }, [user]);

  return (
    <Wrapper
      collapsible
      collapsedWidth={60}
      collapsed={isCollapsed}
      onCollapse={(value: boolean) => dispatch(setMenuCollapsed(value))}
      $isCollapsed={isCollapsed}
      width={isCollapsed ? 60 : 166}
    >
      <div className="logo">
        <img
          src={`/assets/images/logo-menu${isCollapsed ? '-symbol' : ''}${
            isDarkMode ? '__dark' : ''
          }.svg`}
          alt="교보생명 로고"
        />
      </div>
      <Menu
        theme={isDarkMode ? 'dark' : 'light'}
        selectedKeys={[selectedMenu]}
        mode="inline"
        items={menuItems}
      />
    </Wrapper>
  );
};

const Wrapper = styled(Sider)<{ $isCollapsed: boolean }>`
  .logo {
    display: grid;
    place-content: center;

    padding: ${({ $isCollapsed }) => ($isCollapsed ? '4px 14px' : '6px 14px')};
    margin-bottom: 8px;

    img {
      width: auto;
      height: 3.2rem;
    }
  }

  .ant-menu-inline.ant-menu-root {
    background-color: transparent;
    /* color: ${themeGet('colors.textMain')}; */
    padding: 0 0.4rem;

    /* .ant-menu-item-selected {
      background-color: ${themeGet('colors.primary')};
      color: ${themeGet('colors.textItemSelected')};
    } */

    &.ant-menu-root.ant-menu-vertical,
    &.ant-menu-root.ant-menu-inline {
      border-inline-end: none;
    }

    .ant-menu-item:not(.ant-menu-item-selected):not(
        .ant-menu-submenu-selected
      ):hover {
      color: ${themeGet('colors.primary')};
      background-color: ${themeGet('colors.bgItemHovered')};
    }
  }

  .ant-menu-item,
  .ant-menu-submenu {
    a {
      color: inherit;
      transition: none;
    }
  }
`;

export default MenuSider;
