import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  FitViewOptions,
  MiniMap,
  NodeMouseHandler,
  NodeSelectionChange,
  NodeTypes,
  OnNodesChange,
  Panel,
  applyNodeChanges,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from 'antd';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  saveNodes,
  setFullScreenMode,
  setSelectedNode,
} from '@/features/rackLayoutPage/rackLayoutSlice';
import { isRackItemNode } from '@/features/rackLayoutPage/types';
import { useGetRackLayoutMapContentQuery } from '@/services/api/rackLayout';
import { MIN_ZOOM_FOR_RACK_LAYOUT } from '@/config/constants';
import RackItemDisplayNode from './RackItemDisplayNode';
import RackItemNode from './RackItemNode';
import RackNode from './RackNode';

const fitViewOptions: FitViewOptions = {
  padding: 0.05,
};

export const nodeTypes: NodeTypes = {
  rackItem: RackItemNode,
  rack: RackNode,
  rackItemDisplay: RackItemDisplayNode,
};

const ArtBoard = () => {
  const dispatch = useAppDispatch();
  const {
    tree: { selectedBranch },
    content: { nodesSaved },
    isEditMode,
    isFullScreenMode,
    canvasOptions: { updateInterval, hasMiniMap },
  } = useAppSelector(store => store.rackLayout);

  const {
    currentData: freshRackLayoutContent,
    fulfilledTimeStamp,
    isLoading,
  } = useGetRackLayoutMapContentQuery(selectedBranch?.key, {
    skip: !selectedBranch?.isLeaf,
    pollingInterval: updateInterval * 1000,
  });

  const rfInstance = useReactFlow();

  const onNodesChange = useCallback<OnNodesChange>(
    changes => {
      if (!isEditMode && changes[0].type === 'select') {
        const found = nodesSaved.find(
          node => node.id === (changes[0] as NodeSelectionChange).id,
        );
        if (!isRackItemNode(found)) return;
      }

      dispatch(saveNodes(applyNodeChanges(changes, nodesSaved)));
    },
    [nodesSaved, isEditMode, dispatch],
  );

  const onNodeSelect = useCallback<NodeMouseHandler>(
    (event, node) => {
      if (!isEditMode && !isRackItemNode(node)) return;
      dispatch(setSelectedNode(node));
    },
    [isEditMode, dispatch],
  );

  const onNodeContextMenu = useCallback<NodeMouseHandler>(
    (event, node) => {
      if (!isEditMode && !isRackItemNode(node)) return;
      return dispatch(setSelectedNode(node));
    },
    [isEditMode, dispatch],
  );

  const onPaneClick = useCallback(
    () => dispatch(setSelectedNode(null)),
    [dispatch],
  );

  // 전체화면 모드일 때 fitView
  useEffect(() => {
    if (!isEditMode) {
      setTimeout(() => {
        rfInstance.fitView(fitViewOptions);
      }, 0);
    }
  }, [isFullScreenMode, isEditMode, rfInstance]);

  useEffect(() => {
    if (!freshRackLayoutContent) return;

    const nodesWithEventData = !freshRackLayoutContent.dataNode
      ? []
      : freshRackLayoutContent.dataNode.map(node => {
          if (!isRackItemNode(node)) return node;

          const eventData = freshRackLayoutContent.rackFaultList?.find(
            item => item.deviceKey === node.data.deviceId,
          );
          return { ...node, data: { ...node.data, events: eventData } };
        });
    dispatch(saveNodes(nodesWithEventData || []));
  }, [freshRackLayoutContent, dispatch, fulfilledTimeStamp]);

  const isEmpty = freshRackLayoutContent?.rackFaultList?.length === 0;

  return (
    <Wrapper className={`${isFullScreenMode ? 'fullscreen' : ''}`}>
      <ReactFlow
        nodes={nodesSaved}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeSelect}
        onNodeContextMenu={isEditMode ? undefined : onNodeContextMenu}
        onPaneClick={onPaneClick}
        fitViewOptions={fitViewOptions}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={isEditMode ? 'Delete' : null}
        snapToGrid
        snapGrid={[10, 1]}
        fitView={!isEditMode}
        nodesConnectable={false}
        nodesDraggable={isEditMode}
        nodesFocusable={isEditMode}
        elementsSelectable={isEditMode}
        minZoom={MIN_ZOOM_FOR_RACK_LAYOUT}
      >
        {!isLoading && isEmpty && !isEditMode && (
          <ErrorMessage style={{ fontSize: '1.6rem', textAlign: 'center' }}>
            <p>저장된 데이터가 없습니다.</p>
            <p>편집모드에서 노드를 추가하세요.</p>
          </ErrorMessage>
        )}
        <Controls showInteractive={false} />
        {hasMiniMap && <MiniMap />}
        {isFullScreenMode && (
          <Panel position="top-right">
            <Button
              type="text"
              onClick={() => dispatch(setFullScreenMode(false))}
            >
              <CloseOutlined />
            </Button>
          </Panel>
        )}
      </ReactFlow>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  /* width: 125rem; */
  height: calc(100vh - 200px);
  border: 1px solid ${themeGet('colors.borderInput')};
  border-radius: ${themeGet('borderRadius.xLarge')};
  background-color: ${themeGet('colors.bgArtBoard')};

  &.fullscreen {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: ${themeGet('colors.bgBody')};
    z-index: 999;
    height: auto;
  }
`;

export default ArtBoard;
