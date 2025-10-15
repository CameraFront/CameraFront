import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  ConnectionLineType,
  Controls,
  FitViewOptions,
  MiniMap,
  NodeMouseHandler,
  NodeSelectionChange,
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  Panel,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from 'antd';
import styled, { useTheme } from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  saveEdges,
  saveNodes,
  setFullScreenMode,
  setSelectedNode,
} from '@/features/topologyPage/topologySlice';
import { isSectionNode } from '@/features/topologyPage/types';
import { useGetTopologyMapContentQuery } from '@/services/api/topology';
import NetworkNode from './NetworkNode';
import SectionNode from './SectionNode';

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

export const nodeTypes: NodeTypes = {
  network: NetworkNode,
  section: SectionNode,
};

const ArtBoard = () => {
  const dispatch = useAppDispatch();
  const {
    tree: { selectedTreeNode },
    content: { nodesSaved, edgesSaved },
    isEditMode,
    isFullScreenMode,
    canvasOptions: { hasGrid, hasMiniMap, updateInterval },
  } = useAppSelector(store => store.topology);

  const {
    currentData: freshTopologyContent,
    fulfilledTimeStamp,
    isLoading,
  } = useGetTopologyMapContentQuery(selectedTreeNode?.key, {
    skip: !selectedTreeNode?.isLeaf,
    pollingInterval: updateInterval * 1000,
  });

  const rfInstance = useReactFlow();
  const theme = useTheme();

  // 선택된 노드 변경시 변경사항 반영
  const onNodesChange = useCallback<OnNodesChange>(
    changes => {
      if (!isEditMode && changes[0].type === 'select') {
        const found = nodesSaved.find(
          node => node.id === (changes[0] as NodeSelectionChange).id,
        );
        if (isSectionNode(found)) return;
      }
      dispatch(saveNodes(applyNodeChanges(changes, nodesSaved)));
    },
    [nodesSaved, isEditMode, dispatch],
  );

  // edge 변경시 변경사항 반영
  const onEdgesChange = useCallback<OnEdgesChange>(
    changes => {
      dispatch(saveEdges(applyEdgeChanges(changes, edgesSaved)));
    },
    [edgesSaved, dispatch],
  );

  // edge 추가시 변경사항 반영
  const onConnect = useCallback<OnConnect>(
    params => {
      dispatch(saveEdges(addEdge(params, edgesSaved)));
    },
    [edgesSaved, dispatch],
  );

  // 노드 선택시 선택된 노드 업데이트
  const onNodeSelect = useCallback<NodeMouseHandler>(
    (event, node) => {
      if (!isEditMode && isSectionNode(node)) return;
      return dispatch(setSelectedNode(node));
    },
    [dispatch, isEditMode],
  );

  // 노드 우클릭시 선택된 노드 업데이트
  const onNodeContextMenu = useCallback<NodeMouseHandler>(
    (event, node) => {
      if (!isEditMode && isSectionNode(node)) return;
      return dispatch(setSelectedNode(node));
    },
    [dispatch, isEditMode],
  );

  // 패널 클릭시 선택된 노드 초기화
  const onPaneClick = useCallback(
    () => dispatch(setSelectedNode(null)),
    [dispatch],
  );

  // 편집모드가 아닐때는 fitView를 호출
  useEffect(() => {
    if (!isEditMode) {
      setTimeout(() => {
        rfInstance.fitView(fitViewOptions);
      }, 0);
    }
  }, [isFullScreenMode, isEditMode, rfInstance]);

  useEffect(() => {
    if (!freshTopologyContent) return;

    const nodesWithEventData = !freshTopologyContent.dataNode
      ? []
      : freshTopologyContent.dataNode.map(node => {
          if (node.type === 'section') return node;

          const eventData = freshTopologyContent.topologyFaultList.find(
            item => item.deviceKey === node.data.deviceId,
          );
          return { ...node, data: { ...node.data, ...eventData } };
        });
    dispatch(saveNodes(nodesWithEventData || []));
    dispatch(saveEdges(freshTopologyContent?.edgeNode || []));
  }, [freshTopologyContent, dispatch, fulfilledTimeStamp]);

  const isEmpty = freshTopologyContent?.dataNode?.length === 0;
  return (
    <Wrapper className={`${isFullScreenMode ? 'fullscreen' : ''}`}>
      <ReactFlow
        nodes={nodesSaved}
        edges={edgesSaved}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeSelect}
        onNodeContextMenu={isEditMode ? undefined : onNodeContextMenu}
        onPaneClick={onPaneClick}
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={{
          type: ConnectionLineType.SmoothStep,
          style: {
            strokeWidth: 1,
          },
        }}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={isEditMode ? 'Delete' : null}
        snapToGrid
        snapGrid={[10, 10]}
        fitView={!isEditMode}
        nodesConnectable={isEditMode}
        nodesDraggable={isEditMode}
        nodesFocusable={isEditMode}
        edgesUpdatable={isEditMode}
        edgesFocusable={isEditMode}
        elementsSelectable={isEditMode}
      >
        {/* {isError && !isSuccess && !isLoading && (
          <ErrorMessage style={{ fontSize: '1.6rem', textAlign: 'center' }} />
        )} */}
        {!isLoading && isEmpty && !isEditMode && (
          <ErrorMessage style={{ fontSize: '1.6rem', textAlign: 'center' }}>
            <p>저장된 데이터가 없습니다.</p>
            <p>편집모드에서 노드를 추가하세요.</p>
          </ErrorMessage>
        )}
        <Controls showInteractive={false} />
        {hasGrid && <Background color={theme.colors.bgDot} />}
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
  height: calc(100vh - 192px);
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

  .btn__add-node {
  }
`;

export default ArtBoard;
