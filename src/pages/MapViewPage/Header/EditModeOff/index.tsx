import { Button, Popover, Tooltip, message } from 'antd';
import { styled } from 'styled-components';
import { FullscreenOutlined, MoreOutlined, SyncOutlined, } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import SyncButton from '@/components/buttons/SyncButton';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setFullScreenMode } from '@/features/railwayMapPage/railwayMapSlice';
import { useLazyGetMapViewContentQuery } from '@/services/api/mapView';
import { DEFAULT_MAP_VIEW_KEY } from '@/config/constants';
import MoreDropdown from './MoreDropdown';

const EditModeOff = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(store => store.railwayMap);
  const { isDarkMode } = useAppSelector(store => store.global);
  const [getMapViewContent, { isLoading: isLoadingMapViewContent }] =
    useLazyGetMapViewContentQuery();

  const onSync = async () => {
    await getMapViewContent(DEFAULT_MAP_VIEW_KEY);
    message.success('맵현황을 최신 정보로 갱신했습니다.');
  };

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <div className="left-wrapper" />
      <div className="middle-wrapper" />
      <div className="right-wrapper">
        <div className="btn-container">
          <Tooltip title="지금 동기화하기">
            <Button
                type="text"
                icon={<SyncOutlined spin={isLoading} />}
                disabled={isLoading}
                loading={isLoading}
                onClick={onSync}
              />
            </Tooltip>
        </div>
        <div className="btn-container">
          <Tooltip title="전체화면으로 보기">
            <Button
              type="text"
              onClick={() => {
                dispatch(setFullScreenMode(true));
              }}
              icon={<FullscreenOutlined />}
            />
          </Tooltip>
        </div>
        <div className="btn-container">
          <Popover
            arrow={false}
            content={<MoreDropdown />}
            placement="bottomRight"
            overlayClassName='custom-popover'
          >
            <Button type="text" className="btn-text btn-more">
              <MoreOutlined />
            </Button>
          </Popover>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  max-height: 5rem;
  padding-bottom: 1.2rem;
  /* margin-bottom: 1rem; */

  .left-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;

    .fullscreen {
      position: absolute;
      left: 12px;
      top: 12px;
      background: ${themeGet('colors.palette.bgSection')};
      border: 1px solid ${themeGet('colors.palette.borderSection')};
      border-radius: ${themeGet('borderRadius.normal')};
      padding: 2px 8px;
      z-index: 99999;
      /* font-size: ${themeGet('fontSizes.s6')}; */
      font-weight: ${themeGet('fontWeights.medium')};
    }
    
    li {
      color: ${({ $isDarkMode }) =>
        $isDarkMode ? '#878787' : '#5A5A5'};
    }

    li:last-of-type {
      color: ${({ $isDarkMode }) =>
        $isDarkMode ? '#568EC9' : '#121c72'};
    }
  }

  .middle-wrapper {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .right-wrapper {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    .update-group {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .btn-text {
      display: grid;
      place-content: center;
      font-size: ${themeGet('fontSizes.s6')};
      padding: 2px 4px;
    }
      
    .btn-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border: 1px solid ${themeGet('colors.borderInput')};;
      background-color: ${themeGet('colors.bgInput')};
      border-radius: ${themeGet('borderRadius.normal')};
    }
  }
`;

export default EditModeOff;
