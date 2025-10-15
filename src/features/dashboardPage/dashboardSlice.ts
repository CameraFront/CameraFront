import { message } from 'antd';
import {
  AnyAction,
  ThunkAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { AppRootState, AsyncThunkConfig } from '@/app/store';
import { getDevice } from '@/features/settingsPage/settingsSliceThunks';
import { dashboardApi } from '@/services/api/dashboard';
import {
  getBusinessUnitListThunk,
  getDeviceListThunk,
  getEventStatusByStationThunk,
  getEventStatusThunk,
  getRackLayoutOptionsThunk,
  getRailwayMapOptionsThunk,
  getStationListThunk,
  getTopologyOptionsByBusinessUnitThunk,
  getWidgetDataThunk,
  getWidgetsWithDataThunk, // updateLayoutItemOptionsThunk,
  // updateLayoutItemsThunk,
} from './dashboardSliceThunk';
import { initialState } from './initialState';
import {
  EventStatusByStationWidgetData,
  EventStatusWidgetData,
  LayoutItemWithId,
  RackLayoutOption,
  RailwayMapOption,
  ResBusinessUnitListItem,
  ResDeviceListItem,
  ResStationListItem,
  ResWidgetsWithData,
  TopologyDeviceOption,
  WidgetData,
} from './types';

export const DASHBOARD_SLICE = 'dashboard';

// 단일 위젯의 데이터를 가져오는 비동기 함수
export const getWidgetData = createAsyncThunk<
  WidgetData,
  LayoutItemWithId['data'],
  AsyncThunkConfig
>(`${DASHBOARD_SLICE}/getWidgetData`, getWidgetDataThunk);

// 등록된 위젯 목록과 그 데이터를 가져오는 비동기 함수
export const getWidgets = createAsyncThunk<
  ResWidgetsWithData,
  void,
  AsyncThunkConfig
>(`${DASHBOARD_SLICE}/getWidgets`, getWidgetsWithDataThunk);

// 위젯 편집시 디바이스 선택 옵션을 가져오는 비동기 함수
export const getDeviceSelectOptions =
  (deviceId: number): ThunkAction<void, AppRootState, undefined, AnyAction> =>
  async dispatch => {
    const deviceDetails = await dispatch(getDevice(deviceId)).unwrap();
    if (!deviceDetails) return;

    await Promise.all([
      dispatch(getBusinessUnitList()),
      dispatch(getStationList(deviceDetails.managementCd)),
      dispatch(getDeviceList(deviceDetails.stationCd)),
    ]);

    dispatch(
      setSelectValuesForDevice([
        deviceDetails.managementCd,
        deviceDetails.stationCd,
        deviceDetails.deviceKey,
      ]),
    );
  };

// 토폴로지 위젯에서 노드 경로를 가져오는 비동기 함수
export const getTopologyPath =
  (deviceId: number): ThunkAction<void, AppRootState, undefined, AnyAction> =>
  async dispatch => {
    // const tree = await dispatch(getWholeDeviceTree()).unwrap();
    // const path = findParentPath(deviceId.toString(), tree);
    // dispatch(setPathOfTopology(path));
  };

// 토폴로지 위젯에서 토폴로지맵 옵션을 가져오는 비동기 함수
export const getTopologySelectOptions =
  (topologyId: number): ThunkAction<void, AppRootState, undefined, AnyAction> =>
  async dispatch => {
    // const tree = await dispatch(getWholeDeviceTree()).unwrap();
    // const path = findParentPath(topologyId.toString(), tree);

    // dispatch(setPathOfTopology(path));
    // @ts-ignore
    const businessUnit = path?.find(p => p.type === 'hq');

    if (!businessUnit) return;
    await dispatch(getBusinessUnitList());
    await dispatch(getTopologyOptionsByBusinessUnit(+businessUnit.realKey));
    dispatch(setSelectValuesForTopology([+businessUnit.realKey, topologyId]));
  };

// 위젯 편집시 본부 리스트를 가져오는 비동기 함수
export const getBusinessUnitList = createAsyncThunk<
  ResBusinessUnitListItem[],
  void,
  AsyncThunkConfig
>(`${DASHBOARD_SLICE}/getBusinessUnitList`, getBusinessUnitListThunk);

// 위젯 편집시 역사 리스트를 가져오는 비동기 함수
export const getStationList = createAsyncThunk<
  ResStationListItem[],
  number,
  AsyncThunkConfig
>(`${DASHBOARD_SLICE}/getStationList`, getStationListThunk);

// 위젯 편집시 디바이스 리스트를 가져오는 비동기 함수
export const getDeviceList = createAsyncThunk<
  ResDeviceListItem[],
  string,
  AsyncThunkConfig
>(`${DASHBOARD_SLICE}/getDeviceList`, getDeviceListThunk);

// // 위젯 편집시 전체 위젯의 레이아웃을 업데이트하는 비동기 함수
// export const updateLayoutItems = createAsyncThunk<
//   LayoutItem[],
//   LayoutItemWithId[],
//   AsyncThunkConfig
// >(`${DASHBOARD_SLICE}/updateLayoutItems`, updateLayoutItemsThunk);

// // 위젯 편집시 단일 위젯의 옵션을 업데이트하는 비동기 함수
// export const updateLayoutItemOptions = createAsyncThunk<
//   void,
//   { id: string; options: WidgetOptions },
//   AsyncThunkConfig
// >(`${DASHBOARD_SLICE}/updateLayoutItemOptions`, updateLayoutItemOptionsThunk);

// 역사별 장애 현황 위젯의 데이터를 가져오는 비동기 함수
export const getEventStatusByStation = createAsyncThunk<
  EventStatusByStationWidgetData,
  { id: string; page: number },
  AsyncThunkConfig
>(`${DASHBOARD_SLICE}/getEventStatusByStation`, getEventStatusByStationThunk);

// 장애 현황 위젯의 데이터를 가져오는 비동기 함수
export const getEventStatus = createAsyncThunk<
  EventStatusWidgetData,
  { id: string; page: number },
  AsyncThunkConfig
>(`${DASHBOARD_SLICE}/getEventStatus`, getEventStatusThunk);

// 본부별 토폴로지 선택시 사용할 리스트를 가져오는 비동기 함수
export const getTopologyOptionsByBusinessUnit = createAsyncThunk<
  TopologyDeviceOption[],
  number,
  AsyncThunkConfig
>(
  `${DASHBOARD_SLICE}/getTopologyOptionsByBusinessUnit`,
  getTopologyOptionsByBusinessUnitThunk,
);

// 본부별 랙실장도 선택시 사용할 리스트를 가져오는 비동기 함수
export const getRackLayoutOptions = createAsyncThunk<
  RackLayoutOption[],
  void,
  AsyncThunkConfig
>(`${DASHBOARD_SLICE}/getRackLayoutOptions`, getRackLayoutOptionsThunk);

// 본부별 노선도 선택시 사용할 리스트를 가져오는 비동기 함수
export const getRailwayMapOptions = createAsyncThunk<
  RailwayMapOption[],
  void,
  AsyncThunkConfig
>(`${DASHBOARD_SLICE}/getRailwayMapOptions`, getRailwayMapOptionsThunk);

export const dashboardSlice = createSlice({
  name: DASHBOARD_SLICE,
  initialState,
  reducers: {
    setEditMode: (state, { payload }) => {
      state.isEditMode = payload;
    },
    setFullScreenMode: (state, { payload }) => {
      state.isFullScreenMode = payload;
    },
    setFullScreenTarget: (state, { payload }) => {
      state.fullScreenTarget = payload;
    },
    setDroppingItem: (state, { payload }) => {
      state.droppingItem = payload;
    },
    setLayoutItems: (state, { payload }) => {
      state.layoutItems = payload;
    },
    setSelectValuesForDevice: (state, { payload }) => {
      state.selectOptions.device.selectedValues = payload;
    },
    setSelectValuesForTopology: (state, { payload }) => {
      state.selectOptions.topology.selectedValues = payload;
    },
    setPathOfTopology: (state, { payload }) => {
      state.selectOptions.topology.pathOfTopology = payload;
    },
    resetLv1DeviceSelectOptions: state => {
      state.selectOptions.device.businessUnitList =
        initialState.selectOptions.device.businessUnitList;
    },
    resetLv2DeviceSelectOptions: state => {
      state.selectOptions.device.stationList =
        initialState.selectOptions.device.stationList;
    },
    resetLv3DeviceSelectOptions: state => {
      state.selectOptions.device.deviceList =
        initialState.selectOptions.device.deviceList;
    },
    resetState: state => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder.addCase(getWidgets.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getWidgets.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      // state.layoutItems = payload;

      state.layoutItems = payload.resWidgets.map(w => {
        w.widgetInfo.data.id = w.seqNum.toString();

        return w.widgetInfo;
      });

      state.resWidgets = payload.resWidgets;

      payload.resWidgetData.forEach(widgetData => {
        if (!widgetData) return;
        state.widgetData[widgetData.id] = widgetData;
      });
    });
    builder.addCase(getWidgets.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    // builder.addCase(getWidgetData.pending, state => {
    //   // state.isLoading = true;
    // });
    // builder.addCase(getWidgetData.fulfilled, (state, { payload }) => {
    //   state.widgetData[payload.id] = payload;
    // });
    // builder.addCase(getWidgetData.rejected, (state, { payload }) => {
    //   // state.isLoading = false;
    //   if (payload) message.error(payload.message);
    // });
    // builder.addCase(updateLayoutItems.pending, state => {
    //   state.isLoading = true;
    // });
    // builder.addCase(updateLayoutItems.fulfilled, (state, { payload }) => {
    //   state.isLoading = false;
    //   // message.success('변경사항을 업데이트했습니다.');
    // });
    // builder.addCase(updateLayoutItems.rejected, (state, { payload }) => {
    //   state.isLoading = false;
    //   if (payload) message.error(payload.message);
    // });
    // builder.addCase(updateLayoutItemOptions.pending, state => {
    //   state.isLoading = true;
    // });
    // builder.addCase(updateLayoutItemOptions.fulfilled, (state, { payload }) => {
    //   state.isLoading = false;
    // });
    // builder.addCase(updateLayoutItemOptions.rejected, (state, { payload }) => {
    //   state.isLoading = false;
    //   if (payload) message.error(payload.message);
    // });
    builder.addCase(getEventStatus.pending, state => {
      // state.isLoading = true;
    });
    builder.addCase(getEventStatus.fulfilled, (state, { payload }) => {
      // state.isLoading = false;
      state.widgetData[payload.id] = payload;
    });
    builder.addCase(getEventStatus.rejected, (state, { payload }) => {
      // state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getEventStatusByStation.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getEventStatusByStation.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.widgetData[payload.id] = payload;
    });
    builder.addCase(getEventStatusByStation.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getBusinessUnitList.pending, state => {
      state.selectOptions.device.isLoading = true;
    });
    builder.addCase(getBusinessUnitList.fulfilled, (state, { payload }) => {
      state.selectOptions.device.isLoading = false;
      state.selectOptions.device.businessUnitList = payload;
    });
    builder.addCase(getBusinessUnitList.rejected, (state, { payload }) => {
      state.selectOptions.device.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getStationList.pending, state => {
      state.selectOptions.device.isLoading = true;
    });
    builder.addCase(getStationList.fulfilled, (state, { payload }) => {
      state.selectOptions.device.isLoading = false;
      state.selectOptions.device.stationList = payload;
    });
    builder.addCase(getStationList.rejected, (state, { payload }) => {
      state.selectOptions.device.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getDeviceList.pending, state => {
      state.selectOptions.device.isLoading = true;
    });
    builder.addCase(getDeviceList.fulfilled, (state, { payload }) => {
      state.selectOptions.device.isLoading = false;
      state.selectOptions.device.deviceList = payload;
    });
    builder.addCase(getDeviceList.rejected, (state, { payload }) => {
      state.selectOptions.device.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getTopologyOptionsByBusinessUnit.pending, state => {
      state.selectOptions.topology.isLoading = true;
    });
    builder.addCase(
      getTopologyOptionsByBusinessUnit.fulfilled,
      (state, { payload, meta }) => {
        state.selectOptions.topology.isLoading = false;
        state.selectOptions.topology.topologyList = payload.map(t => ({
          ...t,
          businessUnitId: meta.arg,
        }));
      },
    );
    builder.addCase(
      getTopologyOptionsByBusinessUnit.rejected,
      (state, { payload }) => {
        state.selectOptions.topology.isLoading = false;
        if (payload) message.error(payload.message);
      },
    );
    builder.addCase(getRackLayoutOptions.pending, state => {
      state.selectOptions.rackLayout.isLoading = true;
    });
    builder.addCase(
      getRackLayoutOptions.fulfilled,
      (state, { payload, meta }) => {
        state.selectOptions.rackLayout.isLoading = false;
        state.selectOptions.rackLayout.list = payload;
      },
    );
    builder.addCase(getRackLayoutOptions.rejected, (state, { payload }) => {
      state.selectOptions.rackLayout.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getRailwayMapOptions.pending, state => {
      state.selectOptions.railwayMap.isLoading = true;
    });
    builder.addCase(
      getRailwayMapOptions.fulfilled,
      (state, { payload, meta }) => {
        state.selectOptions.railwayMap.isLoading = false;
        state.selectOptions.railwayMap.list = payload;
      },
    );
    builder.addCase(getRailwayMapOptions.rejected, (state, { payload }) => {
      state.selectOptions.railwayMap.isLoading = false;
      if (payload) message.error(payload.message);
    });
    // 위젯리스트를 받아올 때마다 레이아웃아이템도 자동으로 업데이트
    builder.addMatcher(
      dashboardApi.endpoints.getWidgetList.matchFulfilled,
      (state, { payload }) => {
        state.layoutItems = payload.map(w => w.widgetInfo);
      },
    );
  },
});

export const {
  setEditMode,
  setFullScreenMode,
  setFullScreenTarget,
  setLayoutItems,
  setDroppingItem,
  setSelectValuesForDevice,
  resetLv1DeviceSelectOptions,
  resetLv2DeviceSelectOptions,
  resetLv3DeviceSelectOptions,
  setPathOfTopology,
  setSelectValuesForTopology,
  resetState,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
