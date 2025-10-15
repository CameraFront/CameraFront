import { App, Breadcrumb, Button, Popconfirm, Switch, Tooltip } from 'antd';
import { styled } from 'styled-components';
import { FullscreenOutlined, ToolOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setEditMode,
  setFullScreenMode,
} from '@/features/dashboardPage/dashboardSlice';
import {
  useRestoreLayoutFromBackupMutation,
  useSaveCurrentLayoutAsBackupMutation,
} from '@/services/api/dashboard';

const Header = () => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { fullScreenTarget, isEditMode } = useAppSelector(
    store => store.dashboard,
  );

  const [saveCurrentLayoutAsBackup, { isLoading: isLoadingSave }] =
    useSaveCurrentLayoutAsBackupMutation();
  const [restoreLayoutFromBackup, { isLoading: isLoadingRestore }] =
    useRestoreLayoutFromBackupMutation();

  const onSave = () => {
    saveCurrentLayoutAsBackup();
    message.success('현재 레이아웃이 설정값으로 저장되었습니다.');
  };

  const onRestore = () => {
    restoreLayoutFromBackup();
    message.success('설정값으로 복원되었습니다.');
  };

  return (
    <Wrapper>
      <div className="left-wrapper">
        <Breadcrumb
          items={[
            {
              title: '홈',
            },
            {
              title: '대시보드',
            },
          ]}
        />
      </div>
      <div className="right-wrapper">
      {isEditMode && (
          <>
            <Popconfirm
              title="설정값으로 복원하시겠습니까?"
              description="현재 레이아웃이 삭제되고 저장된 설정값으로 복원됩니다."
              onConfirm={onRestore}
              okText="확인"
              cancelText="취소"
              okButtonProps={{ loading: isLoadingRestore, danger: true }}
            >
              <Button className="btn-setting" loading={isLoadingRestore}>
                설정값 로드
              </Button>
            </Popconfirm>
            <Button
              className="btn-setting"
              onClick={onSave}
              loading={isLoadingSave}
            >
              설정값 저장
            </Button>
          </>
        )}
        {/* {!isEditMode && (
          // <Tooltip title="전체화면으로 보기" placement="left">
          <Button
            type="text"
            className="btn-fullscreen"
            onClick={() => {
              if (!fullScreenTarget) return;
              fullScreenTarget.requestFullscreen();
              dispatch(setFullScreenMode(true));
            }}
          >
            <FullscreenOutlined />
          </Button>
          // </Tooltip>
        )} */}
        <div className="switch-wrapper">
          <div className={`label ${isEditMode ? 'active' : ''}`}>
            <ToolOutlined />
          </div>
          <Switch
            checked={isEditMode}
            onChange={() => {
              dispatch(setEditMode(!isEditMode));
            }}
          />
        </div>
        {/* </Tooltip> */}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  .left-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 20px;
  }

  .middle-wrapper {
    display: flex;
    gap: 1rem;

    .select-group {
      display: flex;
      gap: 0.6rem;

      .select-box {
        width: 20rem;
      }
    }
  }

  .right-wrapper {
    display: flex;
    align-items: center;
    gap: 0.6rem;

    .switch-wrapper {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      height: 26px;

      .label {
        line-height: ${themeGet('lineHeights.none')};
        color: ${themeGet('colors.textSub')};
        font-size: ${themeGet('fontSizes.s5')};

        &.active {
          color: ${themeGet('colors.primary')};
        }
      }
    }

    .btn-fullscreen {
      display: grid;
      place-content: center;

      font-size: ${themeGet('fontSizes.s5')};
      color: ${themeGet('colors.textSub')};
      padding: 0 4px 0 4px;
      line-height: 1;
      height: auto;
    }
  }

  .btn-setting {
    font-size: ${themeGet('fontSizes.s3')};
    font-weight: 300;
    padding: 6px 10px;
    line-height: 1;
    height: auto;
    
    color: ${themeGet('colors.textMain')};
    background-color: ${themeGet('colors.bgWidget')};
    border-radius: 4px;
    border: 1px solid ${themeGet('colors.borderWidget')};
  }
`;

export default Header;
