import { Edge, Node } from 'reactflow';
import { message } from 'antd';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@/app/store';
import { ResUnhandledEventDetailsList } from '@/features/eventsPage/types';
import { TopologyPathOfBranch, TreeNode } from '@/types/common';
import { ArrayElement } from '@/types/extra';
import { initialState } from './initialState';
import {
  checkPingThunk,
  checkSnmpThunk,
  createTopologyNodeThunk,
  deleteTopologyNodeThunk,
  getDeviceOptionsThunk,
  getDeviceTypeOptionsThunk,
  getNodeDeviceDetailsThunk,
  getUnhandledEventsByDeviceThunk,
  updateTopologyContentThunk,
  updateTopologyNameThunk,
} from './topologySliceThunk';
import {
  ResDeviceOption,
  ResDeviceTypeOption,
  ResNodeDeviceDetails,
  ResPing,
  ResSnmp,
  TopologyNode,
} from './types';

export const TOPOLOGY_SLICE = 'topology';

// 새 토폴로지를 생성하는 비동기 함수
export const createTopologyNode = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(`${TOPOLOGY_SLICE}/createTopologyNode`, createTopologyNodeThunk);

// 토폴로지를 삭제하는 비동기 함수
export const deleteTopologyNode = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(`${TOPOLOGY_SLICE}/deleteTopologyNode`, deleteTopologyNodeThunk);

// 토폴로지명을 수정하는 비동기 함수
export const updateTopologyName = createAsyncThunk<
  void,
  string,
  AsyncThunkConfig
>(`${TOPOLOGY_SLICE}/updateTopologyName`, updateTopologyNameThunk);

// 토폴로지의 다이어그램 데이터를 수정하는 비동기 함수
export const updateTopologyContent = createAsyncThunk<
  void,
  void,
  AsyncThunkConfig
>(`${TOPOLOGY_SLICE}/updateTopologyContent`, updateTopologyContentThunk);

// 장비종류 옵션을 가져오는 비동기 함수
export const getDeviceTypeOptions = createAsyncThunk<
  ResDeviceTypeOption[],
  void,
  AsyncThunkConfig
>(`${TOPOLOGY_SLICE}/getDeviceTypeOptions`, getDeviceTypeOptionsThunk);

// 장비 옵션을 가져오는 비동기 함수
export const getDeviceOptions = createAsyncThunk<
  ResDeviceOption[],
  {
    deviceType: number;
    parentNode: ArrayElement<TopologyPathOfBranch>;
  },
  AsyncThunkConfig
>(`${TOPOLOGY_SLICE}/getDeviceOptions`, getDeviceOptionsThunk);

// 노드의 장비 상세 정보를 가져오는 비동기 함수
export const getNodeDeviceDetails = createAsyncThunk<
  ResNodeDeviceDetails,
  number,
  AsyncThunkConfig
>(`${TOPOLOGY_SLICE}/getNodeDeviceDetails`, getNodeDeviceDetailsThunk);

// 노드의 미처리 장애 개수를 가져오는 비동기 함수
export const getUnhandledEventsByDevice = createAsyncThunk<
  ResUnhandledEventDetailsList,
  { page: number; deviceId: number },
  AsyncThunkConfig
>(
  `${TOPOLOGY_SLICE}/getUnhandledEventsByDevice`,
  getUnhandledEventsByDeviceThunk,
);

// ping을 체크하는 비동기 함수
export const checkPing = createAsyncThunk<ResPing, number, AsyncThunkConfig>(
  `${TOPOLOGY_SLICE}/checkPing`,
  checkPingThunk,
);

// snmp를 체크하는 비동기 함수
export const checkSnmp = createAsyncThunk<ResSnmp, number, AsyncThunkConfig>(
  `${TOPOLOGY_SLICE}/checkSnmp`,
  checkSnmpThunk,
);

export const topologySlice = createSlice({
  name: TOPOLOGY_SLICE,
  initialState,
  reducers: {
    setSelectedTreeNode: (
      state,
      { payload }: PayloadAction<TreeNode | null>,
    ) => {
      state.tree.selectedTreeNode = payload;
    },
    saveNodes: (state, { payload }: PayloadAction<Node[]>) => {
      state.content.nodesSaved = payload;
    },
    saveEdges: (state, { payload }: PayloadAction<Edge[]>) => {
      state.content.edgesSaved = payload;
    },
    setEditMode: (state, { payload }: PayloadAction<boolean>) => {
      state.isEditMode = payload;
    },
    setFullScreenMode: (state, { payload }: PayloadAction<boolean>) => {
      state.isFullScreenMode = payload;
    },
    setSelectedNode: (state, { payload }: PayloadAction<Node | null>) => {
      state.content.selectedNode = payload;
    },
    setSelectedNodes: (state, { payload }: PayloadAction<Node[]>) => {
      state.content.selectedNodes = payload;
    },
    setSelectedEdge: (state, { payload }: PayloadAction<Edge | null>) => {
      state.content.selectedEdge = payload;
    },
    setGrid: (state, { payload }: PayloadAction<boolean>) => {
      state.canvasOptions.hasGrid = payload;
    },
    setMiniMap: (state, { payload }: PayloadAction<boolean>) => {
      state.canvasOptions.hasMiniMap = payload;
    },
    setStream: (state, { payload }: PayloadAction<boolean>) => {
      state.canvasOptions.hasStream = payload;
      state.content.edgesSaved = state.content.edgesSaved.map(edge => ({
        ...edge,
        animated: payload,
      }));
    },
    setUpdateInterval: (state, { payload }: PayloadAction<number>) => {
      state.canvasOptions.updateInterval = payload;
    },
    resetDeviceDetails: state => {
      state.content.nodeDeviceDetails = null;
    },
    resetTopologyContent: state => {
      state.isFullScreenMode = false;
      state.content.nodesSaved = [];
      state.content.edgesSaved = [];
      state.content.selectedNode = null;
      state.content.selectedNodes = [];
      state.content.selectedEdge = null;
    },
    resetState: state => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder.addCase(createTopologyNode.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(createTopologyNode.fulfilled, state => {
      state.isLoading = false;
      message.success('선택한 노드안에 새 토폴로지맵을 생성하였습니다.');
    });
    builder.addCase(createTopologyNode.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(deleteTopologyNode.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(deleteTopologyNode.fulfilled, state => {
      state.isLoading = false;
      message.success('해당 토폴로지맵을 삭제하였습니다.');
    });
    builder.addCase(deleteTopologyNode.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateTopologyName.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateTopologyName.fulfilled, state => {
      state.isLoading = false;
      message.success('토폴로지명을 수정하였습니다.');
    });
    builder.addCase(updateTopologyName.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateTopologyContent.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateTopologyContent.fulfilled, state => {
      state.isLoading = false;
    });
    builder.addCase(updateTopologyContent.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload)
        message.error(payload.message ? payload.message : payload.code);
    });
    builder.addCase(getDeviceTypeOptions.pending, state => {
      state.content.isLoading = true;
    });
    builder.addCase(getDeviceTypeOptions.fulfilled, (state, { payload }) => {
      state.content.isLoading = false;
      state.content.deviceTypeOptions = payload;
    });
    builder.addCase(getDeviceTypeOptions.rejected, (state, { payload }) => {
      state.content.isLoading = false;
      if (payload)
        message.error(payload.message ? payload.message : payload.code);
    });
    builder.addCase(getDeviceOptions.pending, state => {
      state.content.isLoading = true;
    });
    builder.addCase(getDeviceOptions.fulfilled, (state, { payload }) => {
      state.content.isLoading = false;
      state.content.deviceOptions = payload;
    });
    builder.addCase(getDeviceOptions.rejected, (state, { payload }) => {
      state.content.isLoading = false;
      if (payload)
        message.error(payload.message ? payload.message : payload.code);
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
    builder.addCase(checkPing.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(checkPing.fulfilled, (state, { payload }) => {
      state.isLoading = false;
    });
    builder.addCase(checkPing.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload)
        message.error(payload.message ? payload.message : payload.code);
    });
    builder.addCase(checkSnmp.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(checkSnmp.fulfilled, (state, { payload }) => {
      state.isLoading = false;
    });
    builder.addCase(checkSnmp.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload)
        message.error(payload.message ? payload.message : payload.code);
    });
    // NOTE: 토폴로지 맵 컨텐츠 가져오기 성공 시 Nodes와 Edges 데이터를 저장
    // But, Cache 데이터사용시 호출되지 않음. 그래서 useEffect로 대체
    // builder.addMatcher(
    //   topologyApi.endpoints.getTopologyMapContent.matchFulfilled,
    //   (state, { payload }) => {
    //     state.content.nodesSaved = payload.dataNode;
    //     state.content.edgesSaved = payload.edgeNode.map(edge => ({
    //       ...edge,
    //       animated: state.canvasOptions.hasStream,
    //     }));
    //   },
    // );
    // builder.addMatcher(
    //   topologyApi.endpoints.getTopologyMapContent.matchRejected,
    //   state => {
    //     state.content.nodesSaved = [];
    //     state.content.edgesSaved = [];
    //   },
    // );
  },
});

export const {
  resetState,
  resetTopologyContent,
  resetDeviceDetails,
  setSelectedTreeNode,
  saveNodes,
  saveEdges,
  setEditMode,
  setFullScreenMode,
  setSelectedNode,
  setSelectedNodes,
  setSelectedEdge,
  setGrid,
  setMiniMap,
  setStream,
  setUpdateInterval,
} = topologySlice.actions;
export default topologySlice.reducer;
