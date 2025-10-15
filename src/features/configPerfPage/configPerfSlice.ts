import { message } from 'antd';
import {
  AnyAction,
  ThunkAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { AppRootState, AsyncThunkConfig } from '@/app/store';
import { RangeValue, ResTreeNode } from '@/types/common';
import {
  getConfigDeviceDetailsThunk,
  getConfigDeviceListThunk,
  getPerfDeviceDetailsThunk,
  getPerfDeviceListThunk,
  getPerfUsageTop5Thunk,
  getPortsBySwitchThunk,
  getWholeDeviceTreeThunk,
} from './configPerfSliceThunk';
import { initialState } from './initialState';
import {
  ResConfigDeviceDetails,
  ResConfigDeviceList,
  ResPerfDeviceDetails,
  ResPerfDeviceList,
  ResPerfUsageRankTop5,
  ResPort,
} from './types';

export const CONFIG_PERF_SLICE = 'configPerf';

// 최초 디바이스 트리를 가져오고, 첫번째 노드를 선택한 후, 해당 노드의 디바이스 리스트를 가져온다.
export const initDeviceTree =
  (): ThunkAction<void, AppRootState, undefined, AnyAction> =>
  async (dispatch, getState) => {
    await dispatch(getWholeDeviceTree());

    // const { resDeviceTree } = getState().configPerf;
    // const { key, realKey, type } = resDeviceTree[0];
    // dispatch(setSelectedBranch({ key, realKey, type }));

    // dispatch(getConfigDeviceList({ page: 1 }));
  };

// 디바이스 트리를 가져오는 비동기 함수
export const getWholeDeviceTree = createAsyncThunk<
  ResTreeNode[],
  void,
  AsyncThunkConfig
>(`${CONFIG_PERF_SLICE}/getAllDeviceTree`, getWholeDeviceTreeThunk);

// 디바이스 리스트를 가져오는 비동기 함수
export const getConfigDeviceList = createAsyncThunk<
  ResConfigDeviceList,
  { search?: string; page: number },
  AsyncThunkConfig
>(`${CONFIG_PERF_SLICE}/getConfigDeviceList`, getConfigDeviceListThunk);

// 디바이스 상세 정보를 가져오는 비동기 함수
export const getConfigDeviceDetails = createAsyncThunk<
  ResConfigDeviceDetails,
  void,
  AsyncThunkConfig
>(`${CONFIG_PERF_SLICE}/getConfigDeviceDetails`, getConfigDeviceDetailsThunk);

// 성능 디바이스 리스트를 가져오는 비동기 함수
export const getPerfDeviceList = createAsyncThunk<
  ResPerfDeviceList,
  { search?: string; page: number },
  AsyncThunkConfig
>(`${CONFIG_PERF_SLICE}/getPerfDeviceList`, getPerfDeviceListThunk);

// 성능 사용량 TOP5를 가져오는 비동기 함수
export const getPerfUsageTop5 = createAsyncThunk<
  ResPerfUsageRankTop5,
  void,
  AsyncThunkConfig
>(`${CONFIG_PERF_SLICE}/getPerfUsageTop5`, getPerfUsageTop5Thunk);

// 성능 디바이스 상세 정보를 가져오는 비동기 함수
export const getPerfDeviceDetails = createAsyncThunk<
  ResPerfDeviceDetails,
  RangeValue | void,
  AsyncThunkConfig
>(`${CONFIG_PERF_SLICE}/getPerfDeviceDetails`, getPerfDeviceDetailsThunk);

// 스위치에 연결된 포트 리스트를 가져오는 비동기 함수
export const getPortsBySwitch = createAsyncThunk<
  ResPort[],
  number,
  AsyncThunkConfig
>(`${CONFIG_PERF_SLICE}/getPortsBySwitch`, getPortsBySwitchThunk);

export const configPerfSlice = createSlice({
  name: CONFIG_PERF_SLICE,
  initialState,
  reducers: {
    setSelectedTab: (state, { payload }) => {
      state.selectedTab = payload;
    },
    setSelectedBranch: (state, { payload }) => {
      state.selectedBranch = payload;
    },
    setConfigSearch: (state, { payload }) => {
      state.config.search = payload;
    },
    setPerfSearch: (state, { payload }) => {
      state.perf.search = payload;
    },
    resetPortList: state => {
      state.config.resPortList = null;
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
      state.resDeviceTree = payload;
    });
    builder.addCase(getWholeDeviceTree.rejected, (state, { payload }) => {
      state.isLoading = false;
      console.error('Failed to fetch the device tree');
    });
    builder.addCase(getConfigDeviceList.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getConfigDeviceList.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.config.resDeviceList = payload;
    });
    builder.addCase(getConfigDeviceList.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getConfigDeviceDetails.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getConfigDeviceDetails.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.config.resDeviceDetails = payload;
    });
    builder.addCase(getConfigDeviceDetails.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getPortsBySwitch.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getPortsBySwitch.fulfilled, (state, { payload }) => {
      state.isLoading = false;

      state.config.resPortList = payload;
    });
    builder.addCase(getPortsBySwitch.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getPerfDeviceList.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getPerfDeviceList.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.perf.resDeviceList = payload;
    });
    builder.addCase(getPerfDeviceList.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getPerfUsageTop5.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getPerfUsageTop5.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.perf.resUsageTop5 = payload;
    });
    builder.addCase(getPerfUsageTop5.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getPerfDeviceDetails.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getPerfDeviceDetails.fulfilled, (state, { payload }) => {
      state.isLoading = false;

      state.perf.resDeviceDetails = payload;
    });
    builder.addCase(getPerfDeviceDetails.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
  },
});

export const {
  resetState,
  setSelectedTab,
  setSelectedBranch,
  setConfigSearch,
  setPerfSearch,
  resetPortList,
} = configPerfSlice.actions;
export default configPerfSlice.reducer;
