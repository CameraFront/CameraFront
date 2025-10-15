import axios from 'axios';
import { AsyncThunkPayloadCreator, createNextState } from '@reduxjs/toolkit';
import { AsyncThunkConfig, KnownError } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { isNotNullish } from '@/utils/nullChecking';
// import { getWidgets, updateLayoutItems } from './dashboardSlice';
import {
  EventStatusByStationWidgetData,
  EventStatusWidgetData,
  LayoutItem,
  LayoutItemWithId,
  RackLayoutOption,
  RailwayMapOption,
  ResBusinessUnitListItem,
  ResDeviceListItem,
  ResStationListItem,
  ResWidget,
  ResWidgetsWithData,
  TopologyDeviceOption,
  WidgetData,
  WidgetOptions,
  WidgetType,
} from './types';

const DASHBOARD_PATH = 'dashboard';
const DASHBOARD_EDITOR_PATH = 'dashboardEditor';

export const getWidgetsWithDataThunk: AsyncThunkPayloadCreator<
  ResWidgetsWithData,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const { user } = thunkAPI.getState().global;
  if (!user) return;

  try {
    const { data } = await customFetch.post(
      `${DASHBOARD_PATH}/listDashBoardWidget.do`,
      {
        dashboardId: user.dashboard.dashboardId,
      },
    );

    const resWidgets: ResWidget[] = data.response.dashboard.map(
      (widget: ResWidget) => {
        widget.widgetInfo.i = widget.seqNum.toString();
        return widget;
      },
    );

    const responses: (WidgetData | null)[] = await Promise.all(
      resWidgets.map(async w => {
        try {
          const { data } = await customFetch.post(
            w.actionUrl.replace('/yeollim/', ''),
            {
              dashboardId: user.dashboard.dashboardId,
              widgetId: w.widgetInfo.data.type,
              seqNum: w.seqNum,
            },
          );
          return {
            ...data.response,
            id: w.seqNum.toString(),
            type: w.widgetId,
          };
        } catch (error) {
          return null;
        }
      }),
    );

    return { resWidgets, resWidgetData: responses };
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getWidgetDataThunk: AsyncThunkPayloadCreator<
  WidgetData,
  LayoutItemWithId['data'],
  AsyncThunkConfig
> = async (widgetData, thunkAPI) => {
  const { user } = thunkAPI.getState().global;
  if (!user) return;

  try {
    const { data } = await customFetch.post(widgetData.apiUrl, {
      dashboardId: user.dashboard.dashboardId,
      widgetId: widgetData.type,
      seqNum: widgetData.id,
    });
    return {
      ...data.response,
      id: widgetData.id,
      type: widgetData.type,
    };
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getBusinessUnitListThunk: AsyncThunkPayloadCreator<
  ResBusinessUnitListItem[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const body = {};

  try {
    const { data } = await customFetch.post(
      `${DASHBOARD_EDITOR_PATH}/listManagement.do`,
      body,
    );

    return data.response.map((d: Omit<ResStationListItem, 'isLeaf'>) => ({
      ...d,
      isLeaf: false,
    }));
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getStationListThunk: AsyncThunkPayloadCreator<
  ResStationListItem[],
  number,
  AsyncThunkConfig
> = async (businessUnitId, thunkAPI) => {
  const body = { managementCd: businessUnitId };

  try {
    const { data } = await customFetch.post(
      `${DASHBOARD_EDITOR_PATH}/listStation.do`,
      body,
    );

    return data.response.map(
      (d: Omit<ResStationListItem, 'parentId' | 'isLeaf'>) => ({
        ...d,
        parentId: businessUnitId,
        isLeaf: false,
      }),
    );
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};
export const getDeviceListThunk: AsyncThunkPayloadCreator<
  ResDeviceListItem[],
  string,
  AsyncThunkConfig
> = async (stationId, thunkAPI) => {
  const body = { stationCd: stationId };

  try {
    const { data } = await customFetch.post(
      `${DASHBOARD_EDITOR_PATH}/listDevice.do`,
      body,
    );

    return data.response.map(
      (d: Omit<ResDeviceListItem, 'parentId' | 'isLeaf'>) => ({
        ...d,
        parentId: stationId,
        isLeaf: true,
      }),
    );
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// export const updateLayoutItemsThunk: AsyncThunkPayloadCreator<
//   // void,
//   LayoutItem[],
//   LayoutItemWithId[],
//   AsyncThunkConfig
// > = async (layoutItems, thunkAPI) => {
//   const { user } = thunkAPI.getState().global;
//   const { resWidgets } = thunkAPI.getState().dashboard;

//   if (!user) return;

//   const body = layoutItems.map(item => {
//     const found = resWidgets.find(w => w.seqNum.toString() === item.i);

//     return {
//       dashboardId: user.dashboard.dashboardId,
//       widgetId: item.data.type,
//       widgetInfo: item,
//       seqNum: found ? found.seqNum : '',
//     };
//   });

//   try {
//     await customFetch.post(`${DASHBOARD_EDITOR_PATH}/updateDashboard.do`, body);
//     // setLayoutItemsLocalStorage(layoutItems);

//     thunkAPI.dispatch(getWidgets());
//   } catch (error) {
//     if (axios.isAxiosError<KnownError>(error))
//       return checkForUnauthorizedResponse(error, thunkAPI);

//     return error;
//   }
// };

// export const updateLayoutItemOptionsThunk: AsyncThunkPayloadCreator<
//   void,
//   { id: string; options: WidgetOptions },
//   AsyncThunkConfig
// > = async (optionsData, thunkAPI) => {
//   const { user } = thunkAPI.getState().global;
//   const { layoutItems } = thunkAPI.getState().dashboard;
//   if (!user) return;

//   const {
//     updateInterval: updtCycleCd,
//     rankCount: indctCntCd,
//     chartType: indctTypeCd,
//     selectedMap: seqNum,
//     selectedResource: rsrcCd,
//     selectedDevice: deviceKey,
//     order: sortTypeCd,
//   } = optionsData.options;

//   const newOptionsBody = {
//     dashboardId: user.dashboard.dashboardId,
//     widgetId: optionsData.options.chartType,
//     seqNum: optionsData.id,
//     widgetConf: {
//       ...(isNotNullish(updtCycleCd) && { updtCycleCd }),
//       ...(isNotNullish(indctCntCd) && { indctCntCd }),
//       ...(isNotNullish(indctTypeCd) && { indctTypeCd }),
//       ...(isNotNullish(seqNum) && { seqNum }),
//       ...(isNotNullish(rsrcCd) && { rsrcCd }),
//       ...(isNotNullish(deviceKey) && { deviceKey }),
//       ...(isNotNullish(sortTypeCd) && { sortTypeCd }),
//     },
//   };

//   const newLayoutItems = layoutItems.map(item => {
//     if (item.i === optionsData.id) {
//       return createNextState(item, item => {
//         item.data.options = optionsData.options;
//       });
//     }

//     return item;
//   });

//   try {
//     await customFetch.post(
//       `${DASHBOARD_EDITOR_PATH}/updateWidgetConf.do`,
//       newOptionsBody,
//     );
//     await thunkAPI.dispatch(updateLayoutItems(newLayoutItems));
//   } catch (error) {
//     if (axios.isAxiosError<KnownError>(error))
//       return checkForUnauthorizedResponse(error, thunkAPI);

//     return error;
//   }
// };

export const getEventStatusByStationThunk: AsyncThunkPayloadCreator<
  EventStatusByStationWidgetData,
  { id: string; page: number },
  AsyncThunkConfig
> = async ({ id, page }, thunkAPI) => {
  const { user } = thunkAPI.getState().global;

  if (!user) return;

  const body = {
    dashboardId: user.dashboard.dashboardId,
    widgetId: WidgetType.EventStatusByStation,
    seqNum: id,
    page,
  };

  try {
    const { data } = await customFetch.post(
      `${DASHBOARD_PATH}/listStationFault.do`,
      body,
    );

    return {
      id,
      type: WidgetType.EventStatusByStation,
      ...data.response,
    };
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getEventStatusThunk: AsyncThunkPayloadCreator<
  EventStatusWidgetData,
  { id: string; page: number },
  AsyncThunkConfig
> = async ({ id, page }, thunkAPI) => {
  const { user } = thunkAPI.getState().global;

  if (!user) return;

  const body = {
    dashboardId: user.dashboard.dashboardId,
    widgetId: WidgetType.EventStatus,
    seqNum: id,
    page,
  };

  try {
    const { data } = await customFetch.post(
      `${DASHBOARD_PATH}/listFault.do`,
      body,
    );

    return {
      id,
      type: WidgetType.EventStatus,
      ...data.response,
    };
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getTopologyOptionsByBusinessUnitThunk: AsyncThunkPayloadCreator<
  TopologyDeviceOption[],
  number,
  AsyncThunkConfig
> = async (businessUnitId, thunkAPI) => {
  const { user } = thunkAPI.getState().global;

  if (!user) return;

  const body = {
    managementCd: businessUnitId,
  };

  try {
    const { data } = await customFetch.post(
      `${DASHBOARD_EDITOR_PATH}/listTopologyMap.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getRackLayoutOptionsThunk: AsyncThunkPayloadCreator<
  RackLayoutOption[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const { user } = thunkAPI.getState().global;

  if (!user) return;

  const body = {};

  try {
    const { data } = await customFetch.post(
      `${DASHBOARD_EDITOR_PATH}/listRackMap.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};
export const getRailwayMapOptionsThunk: AsyncThunkPayloadCreator<
  RailwayMapOption[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const { user } = thunkAPI.getState().global;

  if (!user) return;

  const body = {};

  try {
    const { data } = await customFetch.post(
      `${DASHBOARD_EDITOR_PATH}/listLineMap.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};
