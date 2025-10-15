import { useMemo } from 'react';
import { Tabs } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RoleGroupId } from '@/features/global/types';
import {
  resetState,
  setSelectedTab,
} from '@/features/settingsPage/settingsSlice';
import { SettingsTab } from '@/types/enum';
import AudiosTab from './AudiosTab';
import BusinessUnitsTab from './BusinessUnitsTab';
import DeviceImagesTab from './DeviceImagesTab';
import DeviceInspectionsTab from './DeviceInspectionsTab';
import DeviceManagersTab from './DeviceManagersTab';
import DeviceManualsTab from './DeviceManualsTab';
import DevicesTab from './DevicesTab';
import EventsTab from './EventsTab';
import LoginHistoryTab from './LoginHistoryTab';
import PhonesTab from './PhonesTab';
import ProcessesTab from './ProcessesTab';
import RolesTab from './RolesTab';
import TerminalsTab from './TerminalsTab';
import ThresholdsTab from './ThresholdsTab';
import UsersTab from './UsersTab';

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(store => store.global);
  const { isLoading, selectedTab } = useAppSelector(store => store.settings);

  const tabItems = useMemo(() => {
    if (!user) return [];

    const isDeveloper = user.login.roleGroupId === RoleGroupId.DEVELOPER;

    return [
      {
        label: '사용자 관리',
        key: SettingsTab.UsersTab,
        children: <UsersTab />,
      },
      {
        label: '그룹 관리',
        key: SettingsTab.ManagementsTab,
        children: <BusinessUnitsTab />,
      },
      {
        label: '카메라 관리',
        key: SettingsTab.DevicesTab,
        children: <DevicesTab />,
      },
      // 임계치 관리 , 알람 레벨 , 알람 전송 , 수신정보 관리 , 라이선스 관리
      {
        label: '기준 이미지 설정',
        key: SettingsTab.ManagementsTab,
        children: <BusinessUnitsTab />,
      },
      {
        label: '화각 분석 설정',
        key: SettingsTab.DevicesTab,
        children: <DevicesTab />,
      },
      {
        label: '장비 관리자 관리',
        key: SettingsTab.DeviceManagersTab,
        children: <DeviceManagersTab />,
      },
      // 용어 관리 , 시스템 설정

      {
        label: '관리',
        key: SettingsTab.TerminalsTab,
        children: <TerminalsTab />,
      },
      {
        label: '임계치 관리',
        key: SettingsTab.PhonesTab,
        children: <PhonesTab />,
      },
      {
        label: '알람 레벨',
        key: SettingsTab.ProcessesTab,
        children: <ProcessesTab />,
      },
      {
        label: '알람 전송',
        key: SettingsTab.DeviceManualsTab,
        children: <DeviceManualsTab />,
      },
      {
        label: '수신정보 관리',
        key: SettingsTab.DeviceInspectionsTab,
        children: <DeviceInspectionsTab />,
      },
      {
        label: '라이선스 관리',
        key: SettingsTab.RolesTab,
        children: <RolesTab />,
      },
      {
        label: '기준 이미지 설정',
        key: SettingsTab.EventsTab,
        children: <EventsTab />,
      },
      {
        label: '장비 관리자 관리',
        key: SettingsTab.ThresholdsTab,
        children: <ThresholdsTab />,
      },


      // {
      //   label: '소속 관리',
      //   key: SettingsTab.ManagementsTab,
      //   children: <BusinessUnitsTab />,
      // },
      // {
      //   label: '장비 관리(POE)',
      //   key: SettingsTab.DevicesTab,
      //   children: <DevicesTab />,
      // },
      // {
      //   label: 'AP 관리',
      //   key: SettingsTab.TerminalsTab,
      //   children: <TerminalsTab />,
      // },
      // {
      //   label: '전화기 관리',
      //   key: SettingsTab.PhonesTab,
      //   children: <PhonesTab />,
      // },
      // {
      //   label: '프로세스 관리',
      //   key: SettingsTab.ProcessesTab,
      //   children: <ProcessesTab />,
      // },
      // {
      //   label: '장비매뉴얼 관리',
      //   key: SettingsTab.DeviceManualsTab,
      //   children: <DeviceManualsTab />,
      // },
      // {
      //   label: '설비점검 관리',
      //   key: SettingsTab.DeviceInspectionsTab,
      //   children: <DeviceInspectionsTab />,
      // },
      // {
      //   label: '권한 관리',
      //   key: SettingsTab.RolesTab,
      //   children: <RolesTab />,
      // },
      // {
      //   label: '장애 관리',
      //   key: SettingsTab.EventsTab,
      //   children: <EventsTab />,
      // },
      // {
      //   label: '사용자 관리',
      //   key: SettingsTab.UsersTab,
      //   children: <UsersTab />,
      // },
      // {
      //   label: '장비관리자 관리',
      //   key: SettingsTab.DeviceManagersTab,
      //   children: <DeviceManagersTab />,
      // },

      // {
      //   label: '임계치 관리',
      //   key: SettingsTab.ThresholdsTab,
      //   children: <ThresholdsTab />,
      // },

      // {
      //   label: '장비이미지 관리',
      //   key: SettingsTab.DeviceImagesTab,
      //   children: <DeviceImagesTab />,
      // },
      // {
      //   label: '오디오 관리',
      //   key: SettingsTab.AudioFilesTab,
      //   children: <AudiosTab />,
      // },
      // {
      //   label: '접속이력 관리',
      //   key: SettingsTab.LoginHistoryTab,
      //   children: <LoginHistoryTab />,
      // },
    ];
  }, [user]);

  return (
    <Wrapper>
      <LoadingSpinner spinning={isLoading}>
        <div className="settings-header">
          <div className="title">환경 설정</div>
        </div>
        <div className="settings-body">
          <Tabs
            tabPosition="left"
            items={tabItems}
            activeKey={selectedTab}
            destroyInactiveTabPane
            onChange={activeKey => {
              dispatch(resetState());
              dispatch(setSelectedTab(activeKey));
            }}
            tabBarGutter={2}
          />
        </div>
      </LoadingSpinner>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .settings-header {
    margin-bottom: ${themeGet('spacing.s3')};

    .title {
      font-size: ${themeGet('fontSizes.s5')};
      font-weight: ${themeGet('fontWeights.medium')};
    }
  }

  .ant-tabs-content-holder {
    max-height: 650px;
    overflow: auto;
  }
`;

export default SettingsPage;
