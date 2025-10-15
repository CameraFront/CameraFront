import { message } from 'antd';
import {
  AnyAction,
  ThunkAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { AppRootState, AsyncThunkConfig } from '@/app/store';
import { ResUnhandledEventDetailsList } from '@/features/eventsPage/types';
import { ResNodeDeviceDetails } from '@/features/topologyPage/types';
import { ResTopologyTreeNode } from '@/types/common';
import { getInitialNode } from '@/utils/helpers';
import { initialState } from './initialState';
import {
  createRackLayoutNodeThunk,
  deleteRackLayoutNodeThunk,
  getNodeDeviceDetailsThunk,
  getUnhandledEventsByDeviceThunk,
  getWholeDeviceTreeThunk,
  updateRackLayoutNameThunk,
} from './rackLayoutSliceThunk';

export const RACK_LAYOUT_SLICE = 'rackLayout';

// 최초 디바이스 트리를 가져오고, 초기 노드를 설정한다.
export const initDeviceTree =
  (): ThunkAction<void, AppRootState, undefined, AnyAction> =>
  async (dispatch, getState) => {
    await dispatch(getWholeDeviceTree());

    const {
      tree: { resDeviceTree },
    } = getState().rackLayout;

    dispatch(setSelectedBranch(getInitialNode(resDeviceTree[0], 4)));
  };

// 랙실장도의 전체 디바이스 트리를 가져온다.
export const getWholeDeviceTree = createAsyncThunk<
  ResTopologyTreeNode[],
  void,
  AsyncThunkConfig
>(`${RACK_LAYOUT_SLICE}/getWholeDeviceTree`, getWholeDeviceTreeThunk);

// 랙실장도의 노드를 생성한다.
export const createRackLayoutNode = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(`${RACK_LAYOUT_SLICE}/createRackLayoutNode`, createRackLayoutNodeThunk);

// 랙실장도의 노드를 삭제한다.
export const deleteRackLayoutNode = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(`${RACK_LAYOUT_SLICE}/deleteRackLayoutNode`, deleteRackLayoutNodeThunk);

// 랙실장도의 이름을 수정한다.
export const updateRackLayoutName = createAsyncThunk<
  void,
  string,
  AsyncThunkConfig
>(`${RACK_LAYOUT_SLICE}/updateRackLayoutName`, updateRackLayoutNameThunk);

// 노드의 디바이스 정보를 가져온다.
export const getNodeDeviceDetails = createAsyncThunk<
  ResNodeDeviceDetails,
  string,
  AsyncThunkConfig
>(`${RACK_LAYOUT_SLICE}/getNodeDeviceDetails`, getNodeDeviceDetailsThunk);

// 단일 디바이스의 미처리 장애 개수를 가져온다.
export const getUnhandledEventsByDevice = createAsyncThunk<
  ResUnhandledEventDetailsList,
  { page: number; deviceId: string },
  AsyncThunkConfig
>(
  `${RACK_LAYOUT_SLICE}/getUnhandledEventsByDevice`,
  getUnhandledEventsByDeviceThunk,
);

export const rackLayoutSlice = createSlice({
  name: RACK_LAYOUT_SLICE,
  initialState,
  reducers: {
    setSelectedBranch: (state, { payload }) => {
      state.tree.selectedBranch = payload;
    },
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
    builder.addCase(getWholeDeviceTree.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getWholeDeviceTree.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.tree.resDeviceTree = payload;
    });
    builder.addCase(getWholeDeviceTree.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(createRackLayoutNode.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(createRackLayoutNode.fulfilled, state => {
      state.isLoading = false;
      message.success('선택한 노드안에 새 랙실장도를 생성하였습니다.');
    });
    builder.addCase(createRackLayoutNode.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(deleteRackLayoutNode.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(deleteRackLayoutNode.fulfilled, state => {
      state.isLoading = false;
      message.success('해당 랙실장도를 삭제하였습니다.');
    });
    builder.addCase(deleteRackLayoutNode.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateRackLayoutName.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateRackLayoutName.fulfilled, state => {
      state.isLoading = false;
      message.success('랙실장도명을 수정하였습니다.');
    });
    builder.addCase(updateRackLayoutName.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getNodeDeviceDetails.pending, state => {
      // state.isLoading = true;
    });
    builder.addCase(getNodeDeviceDetails.fulfilled, (state, { payload }) => {
      // state.isLoading = false;
      state.content.nodeDeviceDetails = payload;
    });
    builder.addCase(getNodeDeviceDetails.rejected, (state, { payload }) => {
      // state.isLoading = false;
      if (payload)
        message.error(payload.message ? payload.message : payload.code);
    });
    builder.addCase(getUnhandledEventsByDevice.pending, state => {
      // state.isLoading = true;
    });
    builder.addCase(
      getUnhandledEventsByDevice.fulfilled,
      (state, { payload }) => {
        // state.isLoading = false;
        state.content.unhandledEventDetailsList = payload;
      },
    );
    builder.addCase(
      getUnhandledEventsByDevice.rejected,
      (state, { payload }) => {
        // state.isLoading = false;
        if (payload)
          message.error(payload.message ? payload.message : payload.code);
      },
    );
  },
});

export const {
  resetState,
  resetContent,
  setSelectedBranch,
  saveNodes,
  setEditMode,
  setFullScreenMode,
  setSelectedNode,
  setSelectedNodes,
  setMiniMap,
  setUpdateInterval,
} = rackLayoutSlice.actions;
export default rackLayoutSlice.reducer;
