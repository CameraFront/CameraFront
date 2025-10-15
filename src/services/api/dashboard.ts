import { ZodIssue } from 'zod';
import { createNextState } from '@reduxjs/toolkit';
import { AppRootState } from '@/app/store';
import {
  resCallPeakTrendsDataSchema,
  resDeviceListByDeviceTypeSchema,
  resDevicePerformanceTrendsDataSchema,
  resDeviceRankingsByResourceDataSchema,
  resEnvironmentalFactorsDataSchema,
  resEventStatusByDeviceTypeDataSchema,
  resEventStatusByDeviceTypesDataSchema,
  resEventStatusByStationDataSchema,
  resEventStatusDataSchema,
  resEventTrendsDataSchema,
  resHrInfoUpdateTimeDataSchema,
  resLiveCallTrendsDataSchema,
  resMapViewDataSchema,
  resNumOfEventsDataSchema,
  resRackLayoutDataSchema,
  resStationRankingsByEventDataSchema,
  resUnregisteredPhoneListDataSchema,
  resUnregisteredPhonesByTypeDataSchema,
  resWidgetSchema,
  resWidgetTemplateListSchema,
} from '@/services/validation/dashboard';
import {
  GetWidgetDataDefaultArgs,
  LayoutItem,
  ResCallPeakTrendsData,
  ResDashboardWidgets,
  ResDeviceListByDeviceType,
  ResDevicePerformanceTrendsData,
  ResDeviceRankingsByResourceData,
  ResEnvironmentalFactorsData,
  ResEventStatusByDeviceTypeData,
  ResEventStatusByDeviceTypesData,
  ResEventStatusByStationData,
  ResEventStatusData,
  ResEventTrendsData,
  ResHrInfoUpdateTimeData,
  ResLiveCallTrendsData,
  ResMapViewData,
  ResNumOfEventsData,
  ResRackLayoutData,
  ResStationRankingsByEventData,
  ResUnregisteredPhoneListData,
  ResUnregisteredPhonesByTypeData,
  ResWidget,
  ResWidgetTemplateList,
  WidgetAvailable,
  WidgetOptions,
} from '@/types/api/dashboard';
import { ResTopologyMapContent } from '@/types/api/topology';
import { QueryResponse } from '@/types/common';
import { WidgetApiUrl } from '@/types/enum';
import { isNotNullish } from '@/utils/nullChecking';
import { PATH_TO_TRIM } from '@/config/constants';
import {
  ALL_EVENT_TYPES_SELECTED,
  ALL_ITEMS_SELECTED,
  NONE_SELECTED,
  QUERY_TAG_IDS,
} from '@/config';
import { DASHBOARD_EDIT_PATH, DASHBOARD_PATH } from './apiPaths';
import { baseApi } from './baseApi';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // 위젯 레이아웃 업데이트: 새 위젯 추가시, 위젯 위치 변경시
    updateWidgetLayouts: build.mutation<null, LayoutItem[]>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: QUERY_TAG_IDS.Dashboard.WidgetList,
        },
      ],
      queryFn: async (layoutItems, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;

        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };
        const cachedData = dashboardApi.endpoints.getWidgetList.select()(state);

        if ((!cachedData || !cachedData.data) && layoutItems.length) {
          return {
            error: {
              status: 400,
              data: '위젯 정보가 없습니다.',
            },
          };
        }

        const body = layoutItems.map(item => {
          const found = cachedData.data?.find(
            w => w.seqNum.toString() === item.i,
          );

          return {
            dashboardId: user.dashboard.dashboardId,
            widgetId: item.data.type,
            widgetInfo: item,
            // 신규 위젯인 경우 아직 seqNum 없음
            ...(found && { seqNum: found.seqNum }),
          };
        });

        const res = await baseQuery({
          url: `${DASHBOARD_EDIT_PATH}/updateDashboard.do`,
          method: 'POST',
          body,
        });

        if (res.error) return res;

        return {
          data: null,
        };
      },
    }),
    // 위젯 옵션 업데이트: 위젯 옵션 변경시
    updateWidgetOptions: build.mutation<
      null,
      { id: string; options: WidgetOptions }
    >({
      invalidatesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: QUERY_TAG_IDS.Dashboard.WidgetList,
        },
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { id, options },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        const { layoutItems } = state.dashboard;

        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        if (!layoutItems)
          return {
            error: {
              status: 400,
              data: '레이아웃 정보가 없습니다.',
            },
          };

        const {
          updateInterval: updtCycleCd,
          rankCount: indctCntCd,
          chartType: indctTypeCd,
          selectedMap: seqNum,
          selectedResource: rsrcCd,
          selectedDevice: deviceKey,
          order: sortTypeCd,
          managementCd,
        } = options;

        // 요청을 보내기 전 데이터에 추가 처리가 필요한 옵션들
        const deviceKindSubArr =
          options.deviceTypes && options.deviceTypes.join(',');
        const deviceType = options.deviceType && options.deviceType.toString();
        const eventLv = options.eventTypes && options.eventTypes.join(',');
        const callPeakTypes =
          options.callPeakTypes && options.callPeakTypes.join(',');
        const callTypes = options.callTypes && options.callTypes.join(',');
        const phoneTypeArr = options.phoneTypes && options.phoneTypes.join(',');
        const phoneType = options.phoneType && options.phoneType.toString();

        const body = {
          dashboardId: user.dashboard.dashboardId,
          seqNum: parseInt(id),
          widgetConf: {
            ...(isNotNullish(options.updateInterval) && { updtCycleCd }),
            ...(isNotNullish(options.rankCount) && { indctCntCd }),
            ...(isNotNullish(options.chartType) && { indctTypeCd }),
            ...(isNotNullish(options.selectedMap) && { seqNum }),
            ...(isNotNullish(options.selectedResource) && { rsrcCd }),
            ...(isNotNullish(options.selectedDevice) && { deviceKey }),
            ...(isNotNullish(options.managementCd) && { managementCd }),
            ...(isNotNullish(options.order) && { sortTypeCd }),
            ...(isNotNullish(options.deviceTypes) && { deviceKindSubArr }),
            ...(isNotNullish(options.deviceType) && { deviceType }),
            ...(isNotNullish(options.eventTypes) && { eventLv }),
            ...(isNotNullish(options.callPeakTypes) && { callPeakTypes }),
            ...(isNotNullish(options.callTypes) && { callTypes }),
            ...(isNotNullish(options.phoneTypes) && { phoneTypeArr }),
            ...(isNotNullish(options.phoneType) && { phoneType }),
          },
        };

        const res = await baseQuery({
          url: `${DASHBOARD_EDIT_PATH}/updateWidgetConf.do`,
          method: 'POST',
          body,
        });

        if (res.error) return res;

        return {
          data: null,
        };
      },
      // NOTE: Widget options 변경하면 Widget layout의 `data.options`도 직접 업데이트해줘야 함
      onQueryStarted: async (
        { id, options },
        { getState, dispatch, queryFulfilled },
      ) => {
        const state = getState() as AppRootState;
        const { layoutItems } = state.dashboard;

        const newLayoutItems = layoutItems.map(item => {
          if (item.i === id) {
            return createNextState(item, oldItem => {
              oldItem.data.options = options;
            });
          }

          return item;
        });

        await queryFulfilled;

        dispatch(
          dashboardApi.endpoints.updateWidgetLayouts.initiate(newLayoutItems),
        );
      },
    }),
    saveCurrentLayoutAsBackup: build.mutation<null, void>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: QUERY_TAG_IDS.Dashboard.WidgetList,
        },
      ],
      queryFn: async (_, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;

        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { layoutItems } = state.dashboard;
        const res = await baseQuery({
          url: `${DASHBOARD_EDIT_PATH}/dashboardWidgetBackup.do`,
          method: 'POST',
          body: { layoutItems },
        });

        if (res.error) return res;

        return {
          data: null,
        };
      },
    }),
    restoreLayoutFromBackup: build.mutation<null, void>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: QUERY_TAG_IDS.Dashboard.WidgetList,
        },
      ],
      queryFn: async (_, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;

        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const res = await baseQuery({
          url: `${DASHBOARD_EDIT_PATH}/dashboardWidgetRestore.do`,
          method: 'POST',
          body: {},
        });

        if (res.error) return res;

        return {
          data: null,
        };
      },
    }),
    getDeviceListByDeviceType: build.query<ResDeviceListByDeviceType, number>({
      providesTags: (_, __, deviceType) => [
        {
          type: QUERY_TAG_IDS.Common.Type,
          id: `${QUERY_TAG_IDS.Common.DeviceListByDeviceType}-${deviceType}`,
        },
      ],
      queryFn: async (deviceType, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const res = (await baseQuery({
          url: `${DASHBOARD_EDIT_PATH}/listDevice.do`,
          method: 'POST',
          body: {
            deviceKind: deviceType,
          },
        })) as QueryResponse<ResDeviceListByDeviceType>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
              message: res.error.data.message,
            },
          };
        }

        const { response } = res.data;
        const parsed = resDeviceListByDeviceTypeSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return {
          data: parsed.data,
        };
      },
    }),
    // 위젯 템플릿 목록 조회: 새 위젯 추가시 사용할 기본 옵션값 등 데이터를 포함하고 있음
    getDefaultWidgetList: build.query<WidgetAvailable[], void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: QUERY_TAG_IDS.Dashboard.DefaultWidgetList,
        },
      ],
      queryFn: async (_, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;

        const res = (await baseQuery({
          url: `${DASHBOARD_PATH}/listWidgetTemplate.do`,
          method: 'POST',
          body: {
            dashboardId,
          },
        })) as QueryResponse<ResWidgetTemplateList>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
              message: res.error.data.message,
            },
          };
        }

        const { response } = res.data;

        const parsedWidgetTemplateList =
          resWidgetTemplateListSchema.safeParse(response);

        if (!parsedWidgetTemplateList.success)
          return {
            error: { status: 422, data: parsedWidgetTemplateList.error.issues },
          };

        // 응답 위젯 옵션들의 변수명 변경
        const normalized = parsedWidgetTemplateList.data.map(item => {
          const {
            updtCycleCd: updateInterval,
            indctCntCd: rankCount,
            indctTypeCd: chartType,
            seqNum: selectedMap,
            rsrcCd: selectedResource,
            deviceKey: selectedDevice,
            managementCd,
            sortTypeCd: order,
            listOption: listType,
          } = item.widgetConf;

          // NOTE: 배열을 서버에는 string으로 저장하고 클라이언트단에서 배열로 전환해서 사용
          // deviceKindSubArr값이 '0'이면 장비종류 전체선택을 의미. 해당 값은 계속 전체선택으로 처리
          // eventLv값이 '0'이면 장애유형 전체선택을 의미. 해당 값은 최초 위젯 생성시에만 전체선택으로 처리 (urgent값이 `0`이여서 장비종류처럼 '0'을 전체선택으로 계속 사용불가)
          const deviceTypes =
            item.widgetConf?.deviceKindSubArr &&
            item.widgetConf.deviceKindSubArr === ALL_ITEMS_SELECTED.join(',')
              ? ALL_ITEMS_SELECTED.slice()
              : item.widgetConf.deviceKindSubArr
                  ?.split(',')
                  .filter(Boolean)
                  .map(el => parseInt(el));
          const deviceType =
            item.widgetConf.deviceKindSub &&
            item.widgetConf.deviceKindSub === ALL_ITEMS_SELECTED.join(',')
              ? NONE_SELECTED
              : Number(item.widgetConf.deviceKindSub);
          const eventTypes =
            item.widgetConf.eventLv && item.widgetConf.eventLv === '0'
              ? ALL_EVENT_TYPES_SELECTED.slice()
              : item.widgetConf.eventLv
                  ?.split(',')
                  .filter(Boolean)
                  .map(el => parseInt(el));
          const phoneTypes =
            item.widgetConf.phoneTypeArr &&
            item.widgetConf.phoneTypeArr === ALL_ITEMS_SELECTED.join(',')
              ? ALL_ITEMS_SELECTED.slice()
              : item.widgetConf.phoneTypeArr
                  ?.split(',')
                  .filter(Boolean)
                  .map(el => parseInt(el));
          const phoneType =
            item.widgetConf.phoneType &&
            item.widgetConf.phoneType === ALL_ITEMS_SELECTED.join(',')
              ? NONE_SELECTED
              : Number(item.widgetConf.phoneType);
          const callPeakTypes =
            item.widgetConf.callPeakTypes &&
            item.widgetConf.callPeakTypes === ALL_ITEMS_SELECTED.join(',')
              ? ALL_ITEMS_SELECTED.slice()
              : item.widgetConf.callPeakTypes
                  ?.split(',')
                  .filter(Boolean)
                  .map(el => parseInt(el));
          const callTypes =
            item.widgetConf.callTypes &&
            item.widgetConf.callTypes === ALL_ITEMS_SELECTED.join(',')
              ? ALL_ITEMS_SELECTED.slice()
              : item.widgetConf.callTypes
                  ?.split(',')
                  .filter(Boolean)
                  .map(el => parseInt(el));

          return {
            type: item.widgetId,
            title: item.widgetNm,
            group: item.kind,
            dimension: { ...item.dimension },
            apiUrl: item.url.replace(PATH_TO_TRIM, '') as WidgetApiUrl,
            options: {
              updateInterval,
              ...(isNotNullish(rankCount) && { rankCount }),
              ...(isNotNullish(chartType) && { chartType }),
              ...(isNotNullish(selectedMap) && { selectedMap }),
              ...(isNotNullish(selectedResource) && {
                selectedResource,
              }),
              ...(isNotNullish(selectedDevice) && { selectedDevice }),
              ...(isNotNullish(managementCd) && { managementCd }),
              ...(isNotNullish(order) && { order }),
              ...(isNotNullish(listType) && { listType }),
              ...(isNotNullish(item.widgetConf.deviceKindSubArr) && {
                deviceTypes,
              }),
              ...(isNotNullish(item.widgetConf.deviceKindSub) && {
                deviceType,
              }),
              ...(isNotNullish(item.widgetConf.eventLv) && { eventTypes }),
              ...(isNotNullish(item.widgetConf.callPeakTypes) && {
                callPeakTypes,
              }),
              ...(isNotNullish(item.widgetConf.callTypes) && { callTypes }),
              ...(isNotNullish(item.widgetConf.phoneTypeArr) && {
                phoneTypes,
              }),
              ...(isNotNullish(item.widgetConf.phoneType) && { phoneType }),
            },
          };
        });

        return {
          data: normalized,
        };
      },
    }),
    // 현재 저장된 위젯 목록 조회
    getWidgetList: build.query<ResWidget[], void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: QUERY_TAG_IDS.Dashboard.WidgetList,
        },
      ],
      queryFn: async (_, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;

        const res = (await baseQuery({
          url: `${DASHBOARD_PATH}/listDashBoardWidget.do`,
          method: 'POST',
          body: {
            dashboardId,
          },
        })) as QueryResponse<ResDashboardWidgets>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
              message: res.error.data.message,
            },
          };
        }

        const { response } = res.data;
        const validationErrors: ZodIssue[][] = [];
        const validatedData = response.dashboard.map(widget => {
          const parsed = resWidgetSchema.safeParse(widget);
          if (!parsed.success) {
            validationErrors.push(parsed.error.issues);
          }

          widget.widgetInfo.i = widget.seqNum.toString();
          widget.widgetInfo.data.id = widget.seqNum.toString();

          if (widget.widgetConf.eventLv === '0') {
            widget.widgetInfo.data.options.eventTypes =
              ALL_EVENT_TYPES_SELECTED.slice();
          }
          return widget;
        });

        if (validationErrors.length > 0)
          return { error: { status: 422, data: validationErrors } };

        return {
          data: validatedData,
        };
      },
    }),
    getNumOfEventsData: build.query<
      ResNumOfEventsData,
      GetWidgetDataDefaultArgs & { deviceTypes: number[] }
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id, deviceTypes },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;
        const deviceKindSubArr =
          deviceTypes.join(',') === ALL_ITEMS_SELECTED.join(',')
            ? null
            : deviceTypes.join(',');

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id),
            deviceKindSubArr,
          },
        })) as QueryResponse<ResNumOfEventsData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resNumOfEventsDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getStationRankingsByEventData: build.query<
      ResStationRankingsByEventData,
      GetWidgetDataDefaultArgs & { deviceTypes: number[]; eventTypes: number[] }
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id, deviceTypes, eventTypes },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;
        // deviceKindSubArr에 null을 보내면 장비종류 전체선택
        const deviceKindSubArr =
          deviceTypes.join(',') === ALL_ITEMS_SELECTED.join(',')
            ? null
            : deviceTypes.join(',');
        const eventLv = eventTypes.join(',');

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id),
            deviceKindSubArr,
            eventLv,
          },
        })) as QueryResponse<ResStationRankingsByEventData>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
              message: res.error.data.message,
            },
          };
        }

        const { response } = res.data;

        const parsed = resStationRankingsByEventDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getEventStatusData: build.query<
      ResEventStatusData,
      GetWidgetDataDefaultArgs & {
        deviceTypes: number[];
        eventTypes: number[];
        page?: number;
        rows?: number;
      }
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id, deviceTypes, eventTypes, page = 1, rows = 6 },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;
        const deviceKindSubArr =
          deviceTypes.join(',') === ALL_ITEMS_SELECTED.join(',')
            ? null
            : deviceTypes.join(',');
        const eventLv = eventTypes.join(',');

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id, 10),
            deviceKindSubArr,
            eventLv,
            page,
            rows,
          },
        })) as QueryResponse<ResEventStatusData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resEventStatusDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getEventTrendsData: build.query<
      ResEventTrendsData,
      GetWidgetDataDefaultArgs & {
        deviceTypes: number[];
        eventTypes: number[];
      }
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id, deviceTypes, eventTypes },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;
        const deviceKindSubArr =
          deviceTypes.join(',') === ALL_ITEMS_SELECTED.join(',')
            ? null
            : deviceTypes.join(',');
        const eventLv = eventTypes.join(',');
        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id),
            deviceKindSubArr,
            eventLv,
          },
        })) as QueryResponse<ResEventTrendsData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resEventTrendsDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getEventStatusByStationData: build.query<
      ResEventStatusByStationData,
      GetWidgetDataDefaultArgs & {
        deviceTypes: number[];
        page?: number;
        rows?: number;
      }
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id, deviceTypes, page = 1, rows = 5 },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;
        const deviceKindSubArr =
          deviceTypes.join(',') === ALL_ITEMS_SELECTED.join(',')
            ? null
            : deviceTypes.join(',');
        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id),
            deviceKindSubArr,
            page,
            rows,
          },
        })) as QueryResponse<ResEventStatusByStationData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resEventStatusByStationDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getTopologyData: build.query<
      ResTopologyMapContent,
      GetWidgetDataDefaultArgs
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: id,
          },
        })) as QueryResponse<ResTopologyMapContent>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
              message: res.error.data.message,
            },
          };
        }

        const { response } = res.data;

        if (!response.dataNode || !response.edgeNode) {
          return {
            data: {
              ...response,
              dataNode: [],
              edgeNode: [],
            },
          };
        }

        // TEMP:
        // const validated = resTopologyMapContentSchema.safeParse(response);

        // if (!validated.success) {
        //   return {
        //     error: {
        //       status: 422,
        //       data: validated.error.issues,
        //     },
        //   };
        // }

        // return {
        //   data: {
        //     ...validated.data,
        //     edgeNode:
        //       validated.data.edgeNode &&
        //       validated.data.edgeNode.map(edge => ({
        //         ...edge,
        //         animated: true,
        //       })),
        //   },
        // };

        return {
          data: {
            ...response,
            edgeNode:
              response.edgeNode &&
              response.edgeNode.map(edge => ({
                ...edge,
                animated: true,
              })),
          },
        };
      },
    }),
    getMapViewData: build.query<ResMapViewData, GetWidgetDataDefaultArgs>({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id, 10),
          },
        })) as QueryResponse<ResMapViewData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resMapViewDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getRackLayoutData: build.query<ResRackLayoutData, GetWidgetDataDefaultArgs>(
      {
        providesTags: (_result, _error, { id }) => [
          {
            type: QUERY_TAG_IDS.Dashboard.Type,
            id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
          },
        ],
        queryFn: async (
          { apiUrl, type, id },
          { getState },
          _extraOptions,
          baseQuery,
        ) => {
          const state = getState() as AppRootState;
          const { user } = state.global;
          if (!user)
            return {
              error: {
                status: 401,
                data: '로그인이 필요합니다.',
              },
            };

          const { dashboardId } = user.dashboard;

          const res = (await baseQuery({
            url: apiUrl,
            method: 'POST',
            body: {
              dashboardId,
              widgetId: type,
              seqNum: parseInt(id, 10),
            },
          })) as QueryResponse<ResRackLayoutData>;

          if (res.error) return res;

          const { response } = res.data;

          const parsed = resRackLayoutDataSchema.safeParse(response);

          if (!parsed.success) {
            return {
              error: {
                status: 422,
                data: parsed.error.issues,
              },
            };
          }

          return { data: parsed.data };
        },
      },
    ),
    getEventStatusByDeviceTypesData: build.query<
      ResEventStatusByDeviceTypesData,
      GetWidgetDataDefaultArgs & { deviceTypes: number[]; eventTypes: number[] }
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id, deviceTypes, eventTypes },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;
        const deviceKindSubArr =
          deviceTypes.join(',') === ALL_ITEMS_SELECTED.join(',')
            ? null
            : deviceTypes.join(',');
        const eventLv = eventTypes.join(',');

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id, 10),
            deviceKindSubArr,
            eventLv,
          },
        })) as QueryResponse<ResEventStatusByDeviceTypesData>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
              message: res.error.data.message,
            },
          };
        }

        const { response } = res.data;

        const parsed =
          resEventStatusByDeviceTypesDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getDevicePerformanceTrendsData: build.query<
      ResDevicePerformanceTrendsData,
      GetWidgetDataDefaultArgs
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id, 10),
          },
        })) as QueryResponse<ResDevicePerformanceTrendsData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resDevicePerformanceTrendsDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getDeviceRankingsByResourceData: build.query<
      ResDeviceRankingsByResourceData,
      GetWidgetDataDefaultArgs
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id, 10),
          },
        })) as QueryResponse<ResDeviceRankingsByResourceData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed =
          resDeviceRankingsByResourceDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),

    getEnvironmentalFactorsData: build.query<
      ResEnvironmentalFactorsData,
      GetWidgetDataDefaultArgs
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id, 10),
          },
        })) as QueryResponse<ResEnvironmentalFactorsData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resEnvironmentalFactorsDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getHrInfoUpdateTimeData: build.query<
      ResHrInfoUpdateTimeData,
      GetWidgetDataDefaultArgs
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id, 10),
          },
        })) as QueryResponse<ResHrInfoUpdateTimeData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resHrInfoUpdateTimeDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getCallPeakTrendsData: build.query<
      ResCallPeakTrendsData,
      GetWidgetDataDefaultArgs
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id, 10),
          },
        })) as QueryResponse<ResCallPeakTrendsData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resCallPeakTrendsDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getLiveCallTrendsData: build.query<
      ResLiveCallTrendsData,
      GetWidgetDataDefaultArgs
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id, 10),
          },
        })) as QueryResponse<ResLiveCallTrendsData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resLiveCallTrendsDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getUnregisteredPhoneListData: build.query<
      ResUnregisteredPhoneListData,
      GetWidgetDataDefaultArgs & {
        phoneTypes: number[];
        page?: number;
        rows?: number;
      }
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id, phoneTypes, page = 1, rows = 20 },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id, 10),
            phoneTypeArr: phoneTypes.join(','),
            page,
            rows,
          },
        })) as QueryResponse<ResUnregisteredPhoneListData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resUnregisteredPhoneListDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getUnregisteredPhonesByTypeData: build.query<
      ResUnregisteredPhonesByTypeData,
      GetWidgetDataDefaultArgs & { phoneType: number }
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id, phoneType },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id, 10),
            phoneType: phoneType === NONE_SELECTED ? undefined : phoneType,
          },
        })) as QueryResponse<ResUnregisteredPhonesByTypeData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed =
          resUnregisteredPhonesByTypeDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getEventStatusByDeviceTypeData: build.query<
      ResEventStatusByDeviceTypeData,
      GetWidgetDataDefaultArgs & {
        deviceType: number;
        eventTypes: number[];
      }
    >({
      providesTags: (_result, _error, { id }) => [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: `${QUERY_TAG_IDS.Dashboard.Type}-${id}`,
        },
      ],
      queryFn: async (
        { apiUrl, type, id, deviceType, eventTypes },
        { getState },
        _extraOptions,
        baseQuery,
      ) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { dashboardId } = user.dashboard;
        const deviceKindSub =
          deviceType === NONE_SELECTED ? undefined : deviceType;
        const eventLv = eventTypes.join(',');

        const res = (await baseQuery({
          url: apiUrl,
          method: 'POST',
          body: {
            dashboardId,
            widgetId: type,
            seqNum: parseInt(id, 10),
            deviceKindSub,
            eventLv,
          },
        })) as QueryResponse<ResEventStatusByDeviceTypeData>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resEventStatusByDeviceTypeDataSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdateWidgetLayoutsMutation,
  useUpdateWidgetOptionsMutation,
  useSaveCurrentLayoutAsBackupMutation,
  useRestoreLayoutFromBackupMutation,
  useGetDeviceListByDeviceTypeQuery,
  useLazyGetDeviceListByDeviceTypeQuery,
  useGetDefaultWidgetListQuery,
  useLazyGetDefaultWidgetListQuery,
  useGetWidgetListQuery,
  useLazyGetWidgetListQuery,
  useGetNumOfEventsDataQuery,
  useGetStationRankingsByEventDataQuery,
  useGetEventStatusByDeviceTypesDataQuery,
  useGetEventStatusDataQuery,
  useLazyGetEventStatusDataQuery,
  useGetEventTrendsDataQuery,
  useGetEventStatusByStationDataQuery,
  useLazyGetEventStatusByStationDataQuery,
  useGetTopologyDataQuery,
  useGetMapViewDataQuery,
  useGetRackLayoutDataQuery,
  useGetDevicePerformanceTrendsDataQuery,
  useGetDeviceRankingsByResourceDataQuery,
  useGetEnvironmentalFactorsDataQuery,
  useGetHrInfoUpdateTimeDataQuery,
  useGetCallPeakTrendsDataQuery,
  useGetLiveCallTrendsDataQuery,
  useGetUnregisteredPhoneListDataQuery,
  useLazyGetUnregisteredPhoneListDataQuery,
  useGetUnregisteredPhonesByTypeDataQuery,
  useGetEventStatusByDeviceTypeDataQuery,
} = dashboardApi;
