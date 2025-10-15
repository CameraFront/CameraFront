import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOnSelectionChange } from 'reactflow';
import { App, Breadcrumb, Button, Input, InputProps, Popconfirm } from 'antd';
import { styled } from 'styled-components';
import { EditOutlined, WarningOutlined } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  saveNodes,
  setEditMode,
  setSelectedEdge,
  setSelectedNode,
  setSelectedNodes,
  setSelectedTreeNode,
} from '@/features/topologyPage/topologySlice';
import { isNetworkNode, isSectionNode } from '@/features/topologyPage/types';
import { useGetParentBranchListQuery } from '@/services/api/common';
import {
  useGetTopologyMapListQuery,
  useLazyGetTopologyMapContentQuery,
  useUpdateTopologyMapMutation,
} from '@/services/api/topology';
import { BreadcrumbItem } from '@/types/common';
import { findBreadcrumbItem } from '@/utils/helpers';
import { light } from '@/css/theme';
import AddNewNodeModal from './AddNodeModal';
import EdgeForm from './EdgeForm';
import KeyTooltip from './KeyTooltip';
import NetworkNodeForm from './NetworkNodeForm';
import SectionNodeForm from './SectionNodeForm';

const EditModeOn = () => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const {
    tree: { selectedTreeNode },
    content: { nodesSaved, edgesSaved, selectedNode, selectedEdge },
  } = useAppSelector(store => store.topology);
  const { data: parentBranchList } = useGetParentBranchListQuery();
  const { data: topologyMapList } = useGetTopologyMapListQuery();
  const [getTopologyMapContent] = useLazyGetTopologyMapContentQuery();
  const [updateTopologyMap] = useUpdateTopologyMapMutation();
  const [isModifyName, setIsModifyName] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const previousPathItems = useRef<BreadcrumbItem[]>([]);

  // 노드 또는 엣지 선택 시, 그에 따라 store 업데이트
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      if (nodes.length === 1) {
        dispatch(setSelectedNode(nodes[0]));
        dispatch(setSelectedEdge(null));
        return;
      }

      if (edges.length === 1) {
        dispatch(setSelectedEdge(edges[0]));
        dispatch(setSelectedNode(null));
        return;
      }

      if (!nodes.length && !edges.length) {
        dispatch(setSelectedNode(null));
        dispatch(setSelectedEdge(null));
      }

      dispatch(setSelectedNodes(nodes));
    },
  });

  const handleAddSection = useCallback(() => {
    const newNode = {
      id: `section__${nanoid()}`,
      type: 'section',
      style: {
        background: 'rgb(0, 0, 0, .05)',
        border: `1px solid rgba(89, 89, 89, .25)`,
        borderRadius: 4,
        width: 100,
        height: 30,
      },
      position: { x: 50 + Math.random() * 50, y: 50 + Math.random() * 50 },
      data: {
        label: 'Section',
      },
    };
    dispatch(saveNodes([newNode, ...nodesSaved]));
    dispatch(setSelectedNode(newNode));
  }, [nodesSaved, dispatch]);

  const handleSave = useCallback(async () => {
    if (!selectedTreeNode) return;

    dispatch(setSelectedNode(null));
    const res = await updateTopologyMap({
      key: selectedTreeNode.key,
      content: {
        dataNode: nodesSaved,
        edgeNode: edgesSaved,
      },
    });

    if ('error' in res) {
      message.error('서버로부터 정상적인 응답을 받지 못했습니다.');
      return;
    }

    dispatch(setEditMode(false));
  }, [
    dispatch,
    nodesSaved,
    edgesSaved,
    selectedTreeNode,
    message,
    updateTopologyMap,
  ]);

  const handleCancel = useCallback(async () => {
    await getTopologyMapContent(selectedTreeNode?.key);
    dispatch(setSelectedNode(null));
    dispatch(setEditMode(false));
  }, [dispatch, getTopologyMapContent, selectedTreeNode?.key]);

  // 토폴로지맵 이름 변경 핸들러
  const handleChangeName = useCallback<
    NonNullable<InputProps['onPressEnter'] & InputProps['onBlur']>
  >(
    async e => {
      if (!selectedTreeNode?.key) return;
      await updateTopologyMap({
        key: selectedTreeNode?.key,
        topologyName: e.currentTarget.value,
      });

      setIsModifyName(false);
    },
    [selectedTreeNode?.key, updateTopologyMap],
  );

  const pathItems = useMemo(() => {
    if (!selectedTreeNode || !selectedTreeNode.isLeaf || !parentBranchList)
      return previousPathItems.current;
    if (!parentBranchList) return [];

    const newPathItems = findBreadcrumbItem(parentBranchList, selectedTreeNode);

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
  }, [selectedTreeNode, parentBranchList, isModifyName, handleChangeName]);

  const formGroup = useMemo(() => {
    if (isNetworkNode(selectedNode))
      return <NetworkNodeForm selectedNode={selectedNode} />;

    if (isSectionNode(selectedNode))
      return <SectionNodeForm selectedNode={selectedNode} />;

    if (selectedEdge) return <EdgeForm selectedEdge={selectedEdge} />;

    return (
      <>
        <Button className="btn__add-node" onClick={() => setIsModalOpen(true)}>
          노드 추가
        </Button>
        <Button onClick={handleAddSection} className="btn__add-section">
          섹션 추가
        </Button>
      </>
    );
  }, [selectedNode, selectedEdge, handleAddSection]);

  // 토폴로지맵 이름 변경시, 선택된 토폴로지맵의 이름을 변경해서 Breadcrumb도 업데이트
  useEffect(() => {
    if (!topologyMapList || !selectedTreeNode) return;

    const updatedSelectedMap = topologyMapList.find(
      topologyMap => topologyMap.seqNum === selectedTreeNode.key,
    );

    if (updatedSelectedMap) {
      dispatch(
        setSelectedTreeNode({
          key: updatedSelectedMap.seqNum,
          title: updatedSelectedMap.topologyNm,
          parentKey: updatedSelectedMap.managementCd,
          isLeaf: true,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topologyMapList]);

  return (
    <Wrapper>
      <AddNewNodeModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="left-wrapper">
        <Breadcrumb separator=">" items={pathItems} />
        <Button
          type="text"
          disabled={!selectedTreeNode?.isLeaf}
          style={{ padding: 0, height: 'auto' }}
        >
          <EditOutlined
            className="modify-name"
            onClick={() => setIsModifyName(!isModifyName)}
          />
        </Button>
      </div>
      <div className="middle-wrapper">{formGroup}</div>
      <div className="right-wrapper">
        <KeyTooltip />
        <Popconfirm
          title="변경사항 되돌리기"
          description="변경사항을 저장하지 않고 토폴로지 화면으로 돌아갑니다."
          onConfirm={handleCancel}
          okText="되돌리기"
          cancelText="편집 계속하기"
          icon={<WarningOutlined style={{ color: light.colors.textDanger }} />}
        >
          <Button>취소</Button>
        </Popconfirm>
        <Button type="primary" onClick={handleSave}>
          저장
        </Button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 30% 40% 30%;
  align-items: center;

  width: 100%;
  max-height: 5rem;
  padding-bottom: 1.2rem;
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

    .btn__add-node {
      background-color: ${themeGet('colors.textTableDevice')};
      color: #fff;
      border: none;
    }

    .btn__add-section {
      background-color: ${themeGet('colors.bgInput')};
      border: 1px solid ${themeGet('colors.borderInput')};
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
