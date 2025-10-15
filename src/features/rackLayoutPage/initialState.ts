import { RackLayoutSliceState } from './types';

export const initialState: RackLayoutSliceState = {
  isLoading: false,
  isEditMode: false,
  isFullScreenMode: false,
  tree: {
    resDeviceTree: [],
    selectedBranch: null,
    expandedKeys: [],
  },
  content: {
    isLoading: false,
    nodesSaved: [],
    selectedNode: null,
    nodeDeviceDetails: null,
    unhandledEventDetailsList: null,
    selectedNodes: [],
    deviceTypeOptions: [],
    deviceOptions: [],
    unhandledEventMap: {},
  },
  canvasOptions: {
    hasMiniMap: false,
    updateInterval: 300,
  },
};
