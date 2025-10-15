import { useMemo, useRef } from 'react';
import { App, Breadcrumb, Button, Popover, Tooltip } from 'antd';
import { styled } from 'styled-components';
import {
  FullscreenOutlined,
  MoreOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setFullScreenMode } from '@/features/topologyPage/topologySlice';
import { useGetParentBranchListQuery } from '@/services/api/common';
import { useLazyGetTopologyMapContentQuery } from '@/services/api/topology';
import { BreadcrumbItem } from '@/types/common';
import { findBreadcrumbItem } from '@/utils/helpers';
import MoreDropdown from './MoreDropdown';

const EditModeOff = () => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const {
    isFullScreenMode,
    tree: { selectedTreeNode },
  } = useAppSelector(store => store.topology);

  const { data: parentBranchList } = useGetParentBranchListQuery();
  const [getTopologyMapContent, { isLoading, isError }] =
    useLazyGetTopologyMapContentQuery();

  // NOTE: topologyContent의 응답에 경로데이터(topologyInfo)를 활용하는 대신 트리 데이터로 경로를 직접 만듬
  // topologyContent 응답이 에러나더라도 선택된 경로를 보여줘야하기 때문
  const previousPathItems = useRef<BreadcrumbItem[]>([]);
  const pathItems = useMemo(() => {
    if (!selectedTreeNode || !selectedTreeNode.isLeaf)
      return previousPathItems.current;
    if (!parentBranchList) return [];

    const newPathItems = findBreadcrumbItem(parentBranchList, selectedTreeNode);
    previousPathItems.current = newPathItems;
    return newPathItems;
  }, [selectedTreeNode, parentBranchList]);

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
        <div className="update-group">
          <div className="btn-container">
            <Tooltip title="지금 동기화하기">
              <Button
                type="text"
                icon={<SyncOutlined spin={isLoading} />}
                disabled={!selectedTreeNode?.isLeaf}
                loading={isLoading}
                onClick={async () => {
                  if (!selectedTreeNode?.key) return;
                  await getTopologyMapContent(selectedTreeNode?.key);
                  if (!isError)
                    message.success('토폴로지맵을 최신 정보로 갱신했습니다.');
                }}
              />
            </Tooltip>
          </div>
        </div>
        <div className="btn-container">
          <Tooltip title="전체화면으로 보기">
            <Button
              type="text"
              disabled={!selectedTreeNode?.isLeaf}
              onClick={() => {
                dispatch(setFullScreenMode(true));
              }}
              icon={<FullscreenOutlined />}
            />
          </Tooltip>
        </div>
        <div className="btn-container">
          <Popover
            overlayClassName='custom-popover'
            arrow={false}
            content={<MoreDropdown />}
            placement="bottomRight"
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
      font-size: 16px;
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
