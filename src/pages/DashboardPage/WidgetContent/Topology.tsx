import { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, { Controls, NodeMouseHandler, useReactFlow } from 'reactflow';
import { Breadcrumb } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { nodeTypes } from '@/pages/TopologyPage/topologyEditor/ArtBoard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useAppDispatch } from '@/app/hooks';
import {
  resetState,
  setSelectedNode,
} from '@/features/topologyPage/topologySlice';
import { isSectionNode } from '@/features/topologyPage/types';
import { useGetTopologyDataQuery } from '@/services/api/dashboard';
import { TopologyWidgetData } from '@/types/api/dashboard';
import { isNotNullish } from '@/utils/nullChecking';

const fitViewOptions = {
  padding: 0.2,
};

interface Props {
  data: TopologyWidgetData;
}

const Topology = ({ data }: Props) => {
  const rfInstance = useReactFlow();
  const dispatch = useAppDispatch();
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetTopologyDataQuery(
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

  // 노드 선택시 선택된 노드 업데이트
  const onNodeSelect = useCallback<NodeMouseHandler>(
    (event, node) => {
      if (isSectionNode(node)) return;
      return dispatch(setSelectedNode(node));
    },
    [dispatch],
  );

  // 노드 우클릭시 선택된 노드 업데이트
  const onNodeContextMenu = useCallback<NodeMouseHandler>(
    (event, node) => {
      if (isSectionNode(node)) return;
      return dispatch(setSelectedNode(node));
    },
    [dispatch],
  );

  // 토폴로지 경로를 Breadcrumb으로 표시
  const pathItems = useMemo(() => {
    if (!widgetData) return [];

    const pathArr = [
      widgetData.topologyInfo.depth1,
      widgetData.topologyInfo.depth2,
      widgetData.topologyInfo.depth3,
      widgetData.topologyInfo.topologyNm,
    ];

    return pathArr.filter(isNotNullish).map(item => ({
      title: item,
    }));
  }, [widgetData]);

  const nodesWithEventData = useMemo(() => {
    if (!widgetData) return [];

    return widgetData.dataNode?.map(node => {
      if (node.type === 'section') return node;

      const eventData = widgetData.topologyFaultList.find(
        item => item.deviceKey === node.data.deviceId,
      );
      return { ...node, data: { ...node.data, ...eventData } };
    });
  }, [widgetData]);

  // 풀스크린 변경 이벤트 등록
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [rfInstance, handleFullScreenChange]);

  useEffect(
    () => () => {
      dispatch(resetState());
    },
    [dispatch],
  );

  if (isError) return <ErrorMessage />;
  if (!widgetData?.dataNode)
    return (
      <ErrorMessage>해당 토폴로지에 데이터가 존재하지 않습니다.</ErrorMessage>
    );
  if (!widgetData) return null;

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper
        nodes={nodesWithEventData}
        edges={widgetData.edgeNode ?? []}
        onNodeClick={onNodeSelect}
        onNodeContextMenu={onNodeContextMenu}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={{ animated: true }}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        nodesDraggable={false}
        nodesFocusable={false}
        edgesUpdatable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        onInit={rf => {
          rf.fitView();
        }}
      >
        <Breadcrumb className="map-label" separator=">" items={pathItems} />
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

export default Topology;
