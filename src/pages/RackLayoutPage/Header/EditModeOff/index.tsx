import { useMemo, useRef } from 'react';
import { Breadcrumb, Button, Popover, Tooltip, message } from 'antd';
import { styled } from 'styled-components';
import {
  FullscreenOutlined,
  MoreOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import IconButton from '@/components/buttons/IconButton';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setFullScreenMode } from '@/features/rackLayoutPage/rackLayoutSlice';
import { useGetParentBranchListQuery } from '@/services/api/common';
import { useLazyGetRackLayoutMapContentQuery } from '@/services/api/rackLayout';
import { BreadcrumbItem } from '@/types/common';
import { findBreadcrumbItem } from '@/utils/helpers';
import MoreDropdown from './MoreDropdown';

const EditModeOff = () => {
  const dispatch = useAppDispatch();
  const {
    isFullScreenMode,
    tree: { selectedBranch },
  } = useAppSelector(store => store.rackLayout);
  const { data: parentBranchList } = useGetParentBranchListQuery();
  const [
    getRackLayoutMapContent,
    {
      isLoading: isRackLayoutMapContentLoading,
      isError: isRackLayoutMapContentError,
    },
  ] = useLazyGetRackLayoutMapContentQuery();
  const previousPathItems = useRef<BreadcrumbItem[]>([]);
  const pathItems = useMemo(() => {
    if (!selectedBranch || !selectedBranch.isLeaf)
      return previousPathItems.current;
    if (!parentBranchList) return [];

    const newPathItems = findBreadcrumbItem(parentBranchList, selectedBranch);
    previousPathItems.current = newPathItems;
    return newPathItems;
  }, [selectedBranch, parentBranchList]);

  return (
    <Wrapper>
      <div className="left-wrapper">
        <Breadcrumb
          className={`path-title ${isFullScreenMode ? 'fullscreen' : ''}`}
          separator=">"
          items={pathItems}
        />
      </div>
      <div className="middle-wrapper" />
      <div className="right-wrapper">
        <div className="btn-container">
          <Tooltip title="지금 동기화하기">
            <Button
              type="text"
              icon={<SyncOutlined spin={isRackLayoutMapContentLoading} />}
              loading={isRackLayoutMapContentLoading}
              disabled={!selectedBranch?.isLeaf}
              onClick={async () => {
                if (!selectedBranch?.key) return;
                await getRackLayoutMapContent(selectedBranch?.key);
                if (!isRackLayoutMapContentError)
                  message.success('랙실장도를 최신 정보로 갱신했습니다.');
              }}
            />
          </Tooltip>
        </div>
        <div className="btn-container">
          <Tooltip title="전체화면으로 보기">
            <Button
              type="text"
              icon={<FullscreenOutlined />}
              disabled={!selectedBranch?.isLeaf}
              onClick={() => {
                dispatch(setFullScreenMode(true));
              }}
            />
          </Tooltip>
        </div>
        <div className="btn-container">
          <Popover
            arrow={false}
            content={<MoreDropdown />}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="btn-text btn-more"
              icon={<MoreOutlined />}
            />
          </Popover>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
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
      color: ${themeGet('colors.textLocation')};
    }

    li:last-of-type {
      color: ${themeGet('colors.textTableDevice')};
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
      border: 1px solid ${themeGet('colors.borderInput')};
      background-color: ${themeGet('colors.bgInput')};
      border-radius: ${themeGet('borderRadius.normal')};
    }
  }
`;

export default EditModeOff;
