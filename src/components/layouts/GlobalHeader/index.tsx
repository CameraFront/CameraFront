import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getAppConfig } from '@/features/global/globalSlice';
import NmsStatus from './NmsStatus';
import UserStatus from './UserStatus';

const { Header } = Layout;

const GlobalHeader = () => {
  const {
    isDarkMode,
    menuSider: { isCollapsed },
    user,
  } = useAppSelector(store => store.global);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const logoSrc = location.pathname === '/dashboard'
    ? `/assets/images/logo-header-${user?.global.title}${isDarkMode ? '__dark' : ''}.png`
    : `/assets/images/logo-header-0${isDarkMode ? '__dark' : ''}.png`;

  useEffect(() => {
    dispatch(getAppConfig());
  }, [dispatch]);

  return (
    <Wrapper $isCollapsed={isCollapsed}>
      <div className="left-group">
        <img src={logoSrc} alt="교보생명 로고" />
      </div>
      <div className="right-group">
        {/* <NmsStatus /> */}
        <UserStatus />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled(Header)<{ $isCollapsed: boolean }>`
  &.ant-layout-header {
    /* flex: 0 1 auto; */
    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: ${themeGet('colors.bgHeader')};
    padding: 0 1rem 0 1.7rem;
    margin: 0.5rem 0 1rem 0;
    border: 0;
    box-shadow: none;
    z-index: 10;

    .left-group {
      flex: 1;
      display: flex;
      align-items: center;
      img {
        width: 18%;
      }
    }

    .right-group {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
  }
`;

export default GlobalHeader;
