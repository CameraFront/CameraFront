import { RailwayMapSliceState } from './types';

export const initialState: RailwayMapSliceState = {
  isLoading: false,
  isEditMode: false,
  isFullScreenMode: false,
  content: {
    isLoading: false,
    nodesSaved: [],
    selectedNode: null,
    selectedNodes: [],
    unhandledEventMap: {},
    stationList: [],
  },
  canvasOptions: {
    hasMiniMap: false,
    updateInterval: 300,
  },
};
