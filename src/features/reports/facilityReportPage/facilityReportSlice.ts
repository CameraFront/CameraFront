import { message } from 'antd';
import {
  AnyAction,
  ThunkAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { AppRootState, AsyncThunkConfig } from '@/app/store';
import { ReportRequestBody } from '@/features/reports/infrastructureReportPage/types';
import { ResTreeNode } from '@/types/common';
import {
  downloadReportThunk,
  getFacilityTypesThunk,
  getReportAsHtmlThunk,
  getWholeDeviceTreeThunk,
} from './facilityReportSliceThunk';
import { initialState } from './initialState';
import { FacilityType } from './types';

export const FACILITY_REPORT_SLICE_SLICE = 'facilityReport';

// 최초 디바이스 트리를 가져오고, 첫번째 노드를 선택한다.
export const initFacilityReportPage =
  (): ThunkAction<void, AppRootState, undefined, AnyAction> =>
  async (dispatch, getState) => {
    await dispatch(getWholeDeviceTree());

    const {
      tree: { resDeviceTree },
    } = getState().facilityReport;
    const { key, realKey, type } = resDeviceTree[0];
    dispatch(setSelectedBranch({ key, realKey, type }));
  };

// 전체 디바이스 트리를 가져온다.
export const getWholeDeviceTree = createAsyncThunk<
  ResTreeNode[],
  void,
  AsyncThunkConfig
>(`${FACILITY_REPORT_SLICE_SLICE}/getWholeDeviceTree`, getWholeDeviceTreeThunk);

// 리포트를 다운로드 한다.
export const downloadReport = createAsyncThunk<
  void,
  Omit<ReportRequestBody, 'fileType'> & { fileType: 'pdf' | 'excel' },
  AsyncThunkConfig
>(`${FACILITY_REPORT_SLICE_SLICE}/downloadReport`, downloadReportThunk);

// 리포트를 html로 가져온다.
export const getReportAsHtml = createAsyncThunk<
  string,
  Omit<ReportRequestBody, 'fileType'> & { fileType: 'html' },
  AsyncThunkConfig
>(`${FACILITY_REPORT_SLICE_SLICE}/getReportAsHtml`, getReportAsHtmlThunk);

// 시설물종류 리스트를 가져온다.
export const getFacilityTypes = createAsyncThunk<
  FacilityType[],
  void,
  AsyncThunkConfig
>(`${FACILITY_REPORT_SLICE_SLICE}/getFacilityTypes`, getFacilityTypesThunk);

export const facilityReportSlice = createSlice({
  name: FACILITY_REPORT_SLICE_SLICE,
  initialState,
  reducers: {
    setSelectedTab: (state, { payload }) => {
      state.selectedTab = payload;
    },
    setSelectedBranch: (state, { payload }) => {
      state.tree.selectedBranch = payload;
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
    builder.addCase(getReportAsHtml.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getReportAsHtml.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.reportInHtml = payload;
    });
    builder.addCase(getReportAsHtml.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(downloadReport.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(downloadReport.fulfilled, state => {
      state.isLoading = false;
    });
    builder.addCase(downloadReport.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getFacilityTypes.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getFacilityTypes.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.facilityTypes = payload;
    });
    builder.addCase(getFacilityTypes.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
  },
});

export const { resetState, setSelectedTab, setSelectedBranch } =
  facilityReportSlice.actions;
export default facilityReportSlice.reducer;
