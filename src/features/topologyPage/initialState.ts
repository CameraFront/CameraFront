import { TopologySliceState } from './types';

export const initialState: TopologySliceState = {
  isLoading: false,
  isEditMode: false,
  isFullScreenMode: false,
  tree: {
    resDeviceTree: [],
    selectedTreeNode: null,
    expandedKeys: [],
  },
  content: {
    isLoading: false,
    isChecking: false,
    nodesSaved: [],
    edgesSaved: [],
    selectedNode: null,
    selectedNodes: [],
    selectedEdge: null,
    deviceTypeOptions: [],
    deviceOptions: [],
    nodeDeviceDetails: null,
    unhandledEventDetailsList: null,
    unhandledEventMap: {},
  },
  canvasOptions: {
    hasGrid: true,
    hasMiniMap: true,
    hasStream: true,
    updateInterval: 300,
  },
};
