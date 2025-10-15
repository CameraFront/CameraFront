import { MouseEvent, useCallback, useEffect } from 'react';
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
} from '@/features/railwayMapPage/railwayMapSlice';
import { useGetMapViewContentQuery } from '@/services/api/mapView';
import { isBackgroundMap } from '@/types/api/mapView';
import { DEFAULT_MAP_VIEW_KEY } from '@/config/constants';
import BackgroundMap from './BackgroundMap';
import SpotItemNode from './SpotItemNode';

const fitViewOptions: FitViewOptions = {
  padding: 0,
};

export const nodeTypes: NodeTypes = {
  spotItem: SpotItemNode,
  backgroundMap: BackgroundMap,
};

const ArtBoard = () => {
  const dispatch = useAppDispatch();
  const {
    isEditMode,
    isFullScreenMode,
    content: { nodesSaved },
    canvasOptions: { hasMiniMap, updateInterval },
  } = useAppSelector(store => store.railwayMap);

  const {
    data: mapViewContent,
    isLoading: isMapViewContentLoading,
    isError: isMapViewContentError,
  } = useGetMapViewContentQuery(DEFAULT_MAP_VIEW_KEY);

  const rfInstance = useReactFlow();

  const onNodesChange = useCallback<OnNodesChange>(
    changes => {
      if (!isEditMode && changes[0].type === 'select') {
        const found = nodesSaved.find(
          node => node.id === (changes[0] as NodeSelectionChange).id,
        );
        if (isBackgroundMap(found)) return;
      }

      dispatch(saveNodes(applyNodeChanges(changes, nodesSaved)));
    },
    [nodesSaved, isEditMode, dispatch],
  );

  const onNodeSelect = useCallback<NodeMouseHandler>(
    (event, node) => {
      if (!isEditMode || isBackgroundMap(node)) return;
      dispatch(setSelectedNode(node));
    },
    [isEditMode, dispatch],
  );

  const onPaneClick = useCallback(
    (e: MouseEvent) => dispatch(setSelectedNode(null)),
    [dispatch],
  );

  // 편집모드 해제시 fitView
  useEffect(() => {
    if (!isEditMode) {
      setTimeout(() => {
        rfInstance.fitView(fitViewOptions);
      }, 0);
    }
  }, [isFullScreenMode, isEditMode, rfInstance]);

  // // 편집모드 해제시 선택된 노드 해제
  // useEffect(() => {
  //   if (isEditMode) {
  //     dispatch(
  //       saveNodes(
  //         nodesSaved.map(node => {
  //           if (isSpotItemNode(node)) {
  //             return {
  //               ...node,
  //               selectable: true,
  //             };
  //           }

  //           return node;
  //         }),
  //       ),
  //     );
  //   } else {
  //     dispatch(
  //       saveNodes(
  //         nodesSaved.map(node => ({
  //           ...node,
  //           selectable: false,
  //         })),
  //       ),
  //     );
  //   }
  // }, [isEditMode, nodesSaved, dispatch]);

  if (isMapViewContentLoading) return null;
  if (isMapViewContentError) return <ErrorMessage />;
  if (mapViewContent && !mapViewContent.dataNode)
    return <ErrorMessage>해당 지역의 데이터가 없습니다.</ErrorMessage>;

  return (
    <Wrapper className={`${isFullScreenMode ? 'fullscreen' : ''}`}>
      <ReactFlow
        nodes={isEditMode ? nodesSaved : (mapViewContent?.dataNode ?? [])}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeSelect}
        // onNodeContextMenu={isEditMode ? undefined : onNodeContextMenu}
        onPaneClick={onPaneClick}
        fitViewOptions={fitViewOptions}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={isEditMode ? 'Delete' : null}
        // snapToGrid={true}
        // snapGrid={[10, 1]}
        fitView={!isEditMode}
        nodesConnectable={false}
        nodesDraggable={isEditMode}
        nodesFocusable={isEditMode}
        elementsSelectable={isEditMode}
      >
        <Controls showInteractive={false} fitViewOptions={fitViewOptions} />
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
  height: calc(100vh - 184px);
  border: 1px solid ${themeGet('colors.borderInput')};
  border-radius: ${themeGet('borderRadius.xLarge')};
  background-color: ${themeGet('colors.bgMap')};
  padding: 1.6rem;
  position: relative;

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

  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 5;
    margin: 15px;
  }
`;

export default ArtBoard;
