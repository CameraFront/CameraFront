import {
  Avatar,
  Dropdown,
  message,
  type MenuProps,
  Switch,
  theme,
  Divider,
  Tooltip,
  Modal,
  Space,
} from 'antd';
import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import {
  CaretDownOutlined,
  SettingOutlined,
  LogoutOutlined,
  SoundOutlined,
  AlertOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  cloneElement,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import DarkMode from '@/assets/icon__dark-mode.svg?react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setIsAlarmPopupOn,
  setIsAudibleOn,
  setIsDarkMode,
  setIsSettingsOpen,
  signout,
  updateDarkModeOption,
  updateAudibleOption,
  updateAlarmPopupOption,
  updateAlarmOption,
  setIsAlarmOn,
} from '@/features/global/globalSlice';
import SettingsPage from '@/pages/SettingsPage';
import { setSelectedTab } from '@/features/settingsPage/settingsSlice';
import { initialState } from '@/features/settingsPage/initialState';

import { RoleGroupId } from '@/features/global/types';

const { useToken } = theme;

function UserStatus() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDarkMode, isAudibleOn, isAlarmPopupOn, isAlarmOn ,user, isSettingsOpen } = useAppSelector(
    store => store.global,
  );

  const { token } = useToken();

  const items: MenuProps['items'] = useMemo(() => {
    if (!user) return [];
    const isNormalUser =
      user.login.roleGroupId !== RoleGroupId.DEVELOPER &&
      user.login.roleGroupId !== RoleGroupId.ADMIN;
    return [
      ...(!isNormalUser
        ? [
            {
              label: '환경설정',
              key: 'settings',
              icon: <SettingOutlined />,
              onClick: () => {
                dispatch(setIsSettingsOpen(true));
              },
            },
            {
              type: 'divider' as const,
            },
          ]
        : []),
      {
        label: '로그아웃',
        key: 'logout',
        icon: <LogoutOutlined />,
        onClick: () => {
          dispatch(signout());

          if (user) {
            message.success(
              `${user.login.userId}(${user.login.userNm})님이 로그아웃했습니다.`,
            );
          }

          navigate('/signin');
        },
      },
    ];
  }, [user, dispatch, navigate]);

  const dropdownRender = useCallback(
    (menu: ReactNode) => {
      const contentStyle: React.CSSProperties = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
      };

      const menuStyle: React.CSSProperties = {
        boxShadow: 'none',
      };
      const customItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '5px 12px',
      };

      return (
        <div style={contentStyle}>
          <div style={{ padding: '6px 4px 0 4px' }}>
            <Tooltip title="장애알람" placement="left">
              <div style={customItemStyle}>
                <BellOutlined />
                <Switch
                  checked={isAlarmOn}
                  onChange={() => {
                    dispatch(updateAlarmOption(!isAlarmOn));
                  }}
                />
              </div>
            </Tooltip>
            <Tooltip title="알람가청" placement="left">
              <div style={customItemStyle}>
                <SoundOutlined />
                <Switch
                  checked={isAudibleOn}
                  onChange={() => {
                    dispatch(updateAudibleOption(!isAudibleOn));
                  }}
                />
              </div>
            </Tooltip>
            <Tooltip title="다크모드" placement="left">
              <div style={customItemStyle}>
                <DarkMode />
                <Switch
                  checked={isDarkMode}
                  onChange={() => {
                    dispatch(updateDarkModeOption(!isDarkMode));
                  }}
                />
              </div>
            </Tooltip>
            <Tooltip title="긴급알람팝업" placement="left">
              <div style={customItemStyle}>
                <AlertOutlined />
                <Switch
                  checked={isAlarmPopupOn}
                  onChange={() => {
                    dispatch(updateAlarmPopupOption(!isAlarmPopupOn));
                  }}
                />
              </div>
            </Tooltip>
          </div>
          <Divider style={{ margin: '4px' }} />
          {cloneElement(menu as ReactElement, {
            style: menuStyle,
          })}
        </div>
      );
    },
    [
      isAlarmOn,
      isAlarmPopupOn,
      isAudibleOn,
      isDarkMode,
      dispatch,
      token.colorBgElevated,
      token.borderRadiusLG,
      token.boxShadowSecondary,
    ],
  );

  useEffect(() => {
    if (!user) return;

    dispatch(setIsDarkMode(!!user.global?.colorYn));
    dispatch(setIsAudibleOn(!!user.login?.audibleYn));
    dispatch(setIsAlarmPopupOn(!!user.login?.alarmPopupYn));
    dispatch(setIsAlarmOn(!!user.login?.alarmYn));
  }, [user, dispatch]);

  if (!user) return null;

  return (
    <Wrapper>
      <Avatar className="avatar" size={24} gap={2}>
        {/* {user.login.userNm.toUpperCase().charAt(0)} */}
      </Avatar>
      <Dropdown
        menu={{ items }}
        placement="bottomLeft"
        dropdownRender={dropdownRender}
        trigger={['hover']}
      >
        <Space className='dropdown-wrapper'>
          <span className="user-id">{user.login.userId}</span>
          <CaretDownOutlined />
        </Space>
      </Dropdown>
      <Modal
        width={1440}
        open={isSettingsOpen}
        onCancel={() => {
          dispatch(setSelectedTab(initialState.selectedTab));
          dispatch(setIsSettingsOpen(false));
        }}
        styles={{
          body: { height: '685px', overflow: 'hidden' },
        }}
        footer={null}
        destroyOnClose
      >
        <SettingsPage />
      </Modal>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .avatar {
    background-color: #E2E2E2;
    vertical-align: middle;
    font-size: ${themeGet('fontSizes.s1')};
  }
  .dropdown-wrapper{
    .user-id {
      font-size: 14px;
    }
    
    &:hover{
      cursor: context-menu;
    }
  }
  
`;
export default UserStatus;
