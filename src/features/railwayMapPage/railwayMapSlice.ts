import { createSlice } from '@reduxjs/toolkit';
import { mapViewApi } from '@/services/api/mapView';
import { initialState } from './initialState';

export const RAILWAY_MAP_SLICE = 'railwayMap';

export const railwayMapSlice = createSlice({
  name: RAILWAY_MAP_SLICE,
  initialState,
  reducers: {
    saveNodes: (state, { payload }) => {
      state.content.nodesSaved = payload;
    },
    setEditMode: (state, { payload }) => {
      state.isEditMode = payload;
    },
    setFullScreenMode: (state, { payload }) => {
      state.isFullScreenMode = payload;
    },
    setSelectedNode: (state, { payload }) => {
      state.content.selectedNode = payload;
    },
    setSelectedNodes: (state, { payload }) => {
      state.content.selectedNodes = payload;
    },
    setMiniMap: (state, { payload }) => {
      state.canvasOptions.hasMiniMap = payload;
    },
    setUpdateInterval: (state, { payload }) => {
      state.canvasOptions.updateInterval = payload;
    },
    resetContent: state => {
      state.isFullScreenMode = false;
      state.content.nodesSaved = [];
      state.content.selectedNode = null;
      state.content.selectedNodes = [];
    },
    resetState: state => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      mapViewApi.endpoints.getMapViewContent.matchFulfilled,
      (state, { payload }) => {
        state.content.nodesSaved = payload.dataNode || [];
      },
    );
  },
});

export const {
  resetState,
  resetContent,
  saveNodes,
  setEditMode,
  setFullScreenMode,
  setSelectedNode,
  setSelectedNodes,
  setMiniMap,
  setUpdateInterval,
} = railwayMapSlice.actions;
export default railwayMapSlice.reducer;
