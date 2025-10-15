import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOnSelectionChange } from 'reactflow';
import {
  Breadcrumb,
  Button,
  Input,
  InputProps,
  Popconfirm,
  message,
} from 'antd';
import { styled } from 'styled-components';
import { EditOutlined, WarningOutlined } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  saveNodes,
  setEditMode,
  setSelectedBranch,
  setSelectedNode,
  setSelectedNodes,
} from '@/features/rackLayoutPage/rackLayoutSlice';
import { isRackNode } from '@/features/rackLayoutPage/types';
import { useGetParentBranchListQuery } from '@/services/api/common';
import {
  useGetRackLayoutMapListQuery,
  useLazyGetRackLayoutMapContentQuery,
  useUpdateRackLayoutMapContentMutation,
  useUpdateRackLayoutMapNameMutation,
} from '@/services/api/rackLayout';
import { BreadcrumbItem } from '@/types/common';
import { findBreadcrumbItem } from '@/utils/helpers';
import { light } from '@/css/theme';
import { MAX_RACK_COUNT } from '@/config/constants';
import AddNewDisplayNodeModal from './AddDisplayNodeModal';
import AddNewNodeModal from './AddNodeModal';
import KeyTooltip from './KeyTooltip';

const EditModeOn = () => {
  const dispatch = useAppDispatch();
  const {
    isEditMode,
    tree: { selectedBranch },
    content: { nodesSaved, selectedNode },
  } = useAppSelector(store => store.rackLayout);
  const { data: parentBranchList } = useGetParentBranchListQuery();
  const { data: rackLayoutMapList } = useGetRackLayoutMapListQuery();
  const [getRackLayoutMapContent] = useLazyGetRackLayoutMapContentQuery();
  const [updateRackLayoutMapName] = useUpdateRackLayoutMapNameMutation();
  const [updateRackLayoutMapContent] = useUpdateRackLayoutMapContentMutation();
  const [isModifyName, setIsModifyName] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAddDisplayModalOpen, setIsAddDisplayModalOpen] =
    useState<boolean>(false);
  const previousPathItems = useRef<BreadcrumbItem[]>([]);
  // 선택된 노드를 변경할 때마다 store에 저장
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length === 1) {
        if (!isEditMode && isRackNode(nodes[0])) return;
        dispatch(setSelectedNode(nodes[0]));
        return;
      }

      if (!nodes.length) {
        dispatch(setSelectedNode(null));
      }

      dispatch(setSelectedNodes(nodes));
    },
  });

  const handleAddRack = () => {
    const racks = nodesSaved.filter(n => isRackNode(n));
    if (racks.length >= MAX_RACK_COUNT) {
      message.error(`랙은 최대 ${MAX_RACK_COUNT}개까지 추가할 수 있습니다.`);
      return;
    }

    const newNode = {
      id: `rack-${nanoid()}`,
      type: 'rack',
      position: { x: 50 + racks.length * 560, y: 0 },
      style: {
        zIndex: -1,
      },
      data: {
        label: 'Rack',
      },
      draggable: true,
    };
    dispatch(saveNodes([...nodesSaved, newNode]));
  };

  const handleCancel = useCallback(async () => {
    await getRackLayoutMapContent(selectedBranch?.key);
    dispatch(setSelectedNode(null));
    dispatch(setEditMode(false));
  }, [dispatch, selectedBranch?.key, getRackLayoutMapContent]);

  const handleSave = useCallback(async () => {
    if (!selectedBranch?.key) return;

    await updateRackLayoutMapContent({
      key: selectedBranch?.key,
      dataNode: nodesSaved,
    });
    handleCancel();
  }, [
    handleCancel,
    nodesSaved,
    selectedBranch?.key,
    updateRackLayoutMapContent,
  ]);

  const handleChangeName = useCallback<
    NonNullable<InputProps['onPressEnter'] & InputProps['onBlur']>
  >(
    async e => {
      if (!selectedBranch?.key) return;
      await updateRackLayoutMapName({
        key: selectedBranch?.key,
        name: e.currentTarget.value,
      });
      setIsModifyName(false);
    },
    [selectedBranch?.key, updateRackLayoutMapName],
  );

  const pathItems = useMemo(() => {
    if (!selectedBranch?.key || !selectedBranch?.isLeaf)
      return previousPathItems.current;
    if (!parentBranchList) return [];

    const newPathItems = findBreadcrumbItem(parentBranchList, selectedBranch);

    previousPathItems.current = newPathItems;
    if (!isModifyName) return newPathItems;

    newPathItems[newPathItems.length - 1].title = (
      <Input
        maxLength={16}
        autoFocus
        onBlur={handleChangeName}
        onPressEnter={handleChangeName}
        defaultValue={newPathItems[newPathItems.length - 1].title as string}
        className="input-edit-title"
      />
    );

    return newPathItems;
  }, [selectedBranch, parentBranchList, isModifyName, handleChangeName]);

  // 랙실장도 맵 이름 변경시, 선택된 랙실장도 맵의 이름을 변경해서 Breadcrumb도 업데이트
  useEffect(() => {
    if (!rackLayoutMapList || !selectedBranch) return;

    const updatedSelectedMap = rackLayoutMapList.find(
      rackLayoutMap => rackLayoutMap.seqNum === selectedBranch.key,
    );

    if (updatedSelectedMap) {
      dispatch(
        setSelectedBranch({
          key: updatedSelectedMap.seqNum,
          title: updatedSelectedMap.rackNm,
          parentKey: updatedSelectedMap.managementCd,
          isLeaf: true,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rackLayoutMapList]);

  return (
    <Wrapper>
      <AddNewNodeModal
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
      />
      <AddNewDisplayNodeModal
        isModalOpen={isAddDisplayModalOpen}
        setIsModalOpen={setIsAddDisplayModalOpen}
      />
      <div className="left-wrapper">
        <Breadcrumb separator=">" items={pathItems} />
        {selectedBranch?.isLeaf && (
          <EditOutlined
            className="modify-name"
            onClick={() => setIsModifyName(!isModifyName)}
          />
        )}
      </div>
      {selectedBranch?.isLeaf && (
        <>
          <div className="middle-wrapper">
            {selectedNode ? null : (
              <>
                <Button onClick={handleAddRack}>랙 추가</Button>
                <Button onClick={() => setIsAddDisplayModalOpen(true)}>
                  디스플레이 장비 추가
                </Button>
                <Button
                  type="primary"
                  className="btn__add-node"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  장비 추가
                </Button>
              </>
            )}
          </div>
          <div className="right-wrapper">
            <KeyTooltip />
            <Popconfirm
              title="변경사항 되돌리기"
              description="변경사항을 저장하지 않고 랙실장도 화면으로 돌아갑니다."
              onConfirm={handleCancel}
              okText="되돌리기"
              cancelText="편집 계속하기"
              icon={
                <WarningOutlined style={{ color: light.colors.textDanger }} />
              }
            >
              <Button>취소</Button>
            </Popconfirm>
            <Button type="primary" onClick={handleSave}>
              저장
            </Button>
          </div>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 30% 40% 30%;
  align-items: center;

  width: 100%;
  max-height: 5rem;
  padding: 1rem;
  height: 100%;
  /* margin-bottom: 1rem; */

  .left-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;

    .modify-name {
      color: ${themeGet('colors.textSub')};

      &:hover {
        color: ${themeGet('colors.textMain')};
        cursor: pointer;
      }
    }

    .input-edit-title {
      max-width: 16rem;
      padding: 0 4px;
      font-size: ${themeGet('fontSizes.s3')};
    }
  }

  .middle-wrapper {
    justify-self: center;
    display: flex;
    align-items: center;
    gap: 1rem;

    .ant-form-inline .ant-form-item:not(:nth-last-child(2)) {
      margin-inline-end: 0;
    }
  }

  .right-wrapper {
    justify-self: flex-end;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

export default EditModeOn;
