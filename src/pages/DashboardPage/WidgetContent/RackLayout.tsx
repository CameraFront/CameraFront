import { useCallback, useEffect, useMemo } from 'react';
import { Controls, NodeMouseHandler, ReactFlow, useReactFlow } from 'reactflow';
import { styled } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { nodeTypes } from '@/pages/RackLayoutPage/ArtBoard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useAppDispatch } from '@/app/hooks';
import {
  resetState,
  setSelectedNode,
} from '@/features/rackLayoutPage/rackLayoutSlice';
import { isRackItemNode, isRackNode } from '@/features/rackLayoutPage/types';
import { useGetRackLayoutDataQuery } from '@/services/api/dashboard';
import { RackLayoutWidgetData } from '@/types/api/dashboard';
import { MIN_ZOOM_FOR_RACK_LAYOUT } from '@/config/constants';

interface Props {
  data: RackLayoutWidgetData;
}

const RackLayout = ({ data }: Props) => {
  const dispatch = useAppDispatch();
  const rfInstance = useReactFlow();
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetRackLayoutDataQuery(
    {
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
    },
    {
      pollingInterval: data.options.updateInterval * 1000,
    },
  );

  const handleFullScreenChange = useCallback(() => {
    setTimeout(rfInstance.fitView);
  }, [rfInstance]);

  const onNodeSelect = useCallback<NodeMouseHandler>(
    (event, node) => {
      if (isRackNode(node)) return;
      dispatch(setSelectedNode(node));
    },
    [dispatch],
  );

  const onNodeContextMenu = useCallback<NodeMouseHandler>(
    (event, node) => {
      if (isRackNode(node)) return;
      return dispatch(setSelectedNode(node));
    },
    [dispatch],
  );

  const nodesWithEventData = useMemo(() => {
    if (!widgetData?.dataNode) return [];

    return widgetData.dataNode.map(node => {
      if (!isRackItemNode(node)) return node;

      const eventData = widgetData.rackFaultList?.find(
        item => item.deviceKey === node.data.deviceId,
      );
      return { ...node, data: { ...node.data, events: eventData } };
    });
  }, [widgetData?.dataNode, widgetData?.rackFaultList]);

  // 풀스크린 변경 이벤트 등록
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [rfInstance, handleFullScreenChange]);

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  if (!widgetData) return null;
  if (isError) return <ErrorMessage />;
  if (!widgetData.dataNode)
    return <ErrorMessage>데이터가 없습니다.</ErrorMessage>;

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper
        nodes={nodesWithEventData}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={onNodeSelect}
        onNodeContextMenu={onNodeContextMenu}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        nodesDraggable={false}
        nodesFocusable={false}
        edgesUpdatable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        onInit={rfInstance => {
          rfInstance.fitView();
        }}
        minZoom={MIN_ZOOM_FOR_RACK_LAYOUT}
      >
        <Controls showInteractive={false} />
      </Wrapper>
    </LoadingSpinner>
  );
};

const Wrapper = styled(ReactFlow)`
  .map-label {
    position: absolute;
    left: 8px;
    top: 0px;
    background: ${themeGet('colors.bgTag')};
    border: 1px solid ${themeGet('colors.borderSection')};
    border-radius: ${themeGet('borderRadius.normal')};
    padding: 2px 8px;
    z-index: 99999;
    /* font-size: ${themeGet('fontSizes.s6')}; */
    font-weight: ${themeGet('fontWeights.medium')};
    font-size: ${themeGet('fontSizes.s2')};
  }
`;

export default RackLayout;
