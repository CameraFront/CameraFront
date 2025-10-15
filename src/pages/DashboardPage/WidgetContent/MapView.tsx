import { useCallback, useEffect } from 'react';
import { Controls, ReactFlow, useReactFlow } from 'reactflow';
import { styled } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { nodeTypes } from '@/pages/MapViewPage/ArtBoard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useGetMapViewDataQuery } from '@/services/api/dashboard';
import { MapViewWidgetData } from '@/types/api/dashboard';
import { MapViewNode } from '@/types/api/mapView';

const fitViewOptions = {
  // padding: 0.2,
  // minZoom: 0.01,
};

interface Props {
  data: MapViewWidgetData;
}

const MapView = ({ data }: Props) => {
  const rfInstance = useReactFlow<MapViewNode>();
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetMapViewDataQuery(
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

  // 풀스크린 변경 이벤트 등록
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [rfInstance, handleFullScreenChange]);

  if (isError || !widgetData?.dataNode) return <ErrorMessage />;
  if (!widgetData) return null;

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper
        nodes={widgetData?.dataNode || []}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={fitViewOptions}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        nodesDraggable={false}
        nodesFocusable
        edgesUpdatable={false}
        edgesFocusable={false}
        elementsSelectable
        onInit={rfInstance => {
          rfInstance.fitView();
        }}
        minZoom={0.9}
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

export default MapView;
