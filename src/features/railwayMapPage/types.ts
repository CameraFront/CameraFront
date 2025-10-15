import { MapViewNode } from '@/types/api/mapView';

export interface RailwayMapSliceState {
  isLoading: boolean;
  isEditMode: boolean;
  isFullScreenMode: boolean;
  content: {
    isLoading: boolean;
    nodesSaved: MapViewNode[];
    selectedNode: MapViewNode | null;
    selectedNodes: MapViewNode[];
    unhandledEventMap: Record<string, ResStationEvent>;
    stationList: ResStationItem[];
  };
  canvasOptions: {
    hasMiniMap: boolean;
    updateInterval: number;
  };
}

export interface ResRailwayMapContent {
  events: ResStationEvent[];
  railwayMapName: string;
  dataNode: MapViewNode[];
}

export interface ResStationItem {
  stationCd: string;
  stationNm: string;
}

export interface ResStationEvent {
  no: number;
  stationCd: string;
  stationNm: string;
  urgent: number;
  important: number;
  minor: number;
}
