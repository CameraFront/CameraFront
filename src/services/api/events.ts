import { AppRootState } from '@/app/store';
import { resNumOfEventsDataSchema } from '@/services/validation/dashboard';
import {
  resDailyEventCountsByDateRangeSchema,
  resDeviceRankingsByEventSchema,
  resEventCommentSchema,
  resEventsByFiltersSchema,
  resTodayHourlyEventCountsSchema,
  resUnresolvedEventsByFiltersSchema,
} from '@/services/validation/events';
import { ResNumOfEventsData } from '@/types/api/dashboard';
import {
  ReqEventsByFilter,
  ResDailyEventCountsByDateRange,
  ResDeviceRankingsByEvent,
  ResEventComment,
  ResEventsByFilters,
  ResTodayHourlyEventCounts,
  ResUnresolvedEventsByFilters,
} from '@/types/api/events';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS } from '@/config';
import { EVENTS_PATH } from './apiPaths';
import { baseApi } from './baseApi';

// 장애 메뉴 API
export const eventsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // 장애 코멘트 업데이트
    updateEventComment: build.mutation<
      null,
      { eventKey: number; comment: string | null }
    >({
      invalidatesTags: (_result, _error, { eventKey }) => [
        { type: QUERY_TAG_IDS.Events.Type, id: `EventComment-${eventKey}` },
      ],
      queryFn: async (
        { eventKey, comment },
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

        const res = (await baseQuery({
          url: `${EVENTS_PATH}/updateFaultHistComment.do`,
          method: 'POST',
          body: {
            eventKey,
            comment,
          },
        })) as QueryResponse<null>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
              message: res.error.data.message,
            },
          };
        }

        return { data: null };
      },
    }),
    // 장애 코멘트 조회
    getEventCommentById: build.query<ResEventComment, number>({
      providesTags: (result, error, eventKey) => [
        { type: QUERY_TAG_IDS.Events.Type, id: `EventComment-${eventKey}` },
      ],
      queryFn: async (eventKey, { getState }, _extraOptions, baseQuery) => {
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
          url: `${EVENTS_PATH}/getFaultHistComment.do`,
          method: 'POST',
          body: {
            eventKey,
          },
        })) as QueryResponse<ResEventComment>;

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

        const parsed = resEventCommentSchema.safeParse(response);

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
    // 미처리 장애 건수 조회
    getNumOfUnresolvedEvents: build.query<
      ResNumOfEventsData,
      {
        branchId?: number;
        deviceId?: number;
        // 조회기간 없으면 최근 7일 조회
        fromDate?: string;
        toDate?: string;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Events.Type,
          id: QUERY_TAG_IDS.Events.NumOfUnresolvedEvents,
        },
      ],
      queryFn: async (
        { branchId, deviceId, fromDate, toDate },
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

        const res = (await baseQuery({
          url: `${EVENTS_PATH}/getFaultCnt.do`,
          method: 'POST',
          body: {
            ...(branchId && { managementCdTree: branchId }),
            ...(deviceId && { deviceKey: deviceId }),
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
          },
        })) as QueryResponse<ResNumOfEventsData>;

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
    getTodayHourlyUnresolvedEventCounts: build.query<
      ResTodayHourlyEventCounts,
      {
        branchId?: number;
        deviceId?: number;
        deviceType?: number;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Events.Type,
          id: QUERY_TAG_IDS.Events.TodayHourlyUnresolvedEventCounts,
        },
      ],
      queryFn: async (
        { branchId, deviceId, deviceType },
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

        const res = (await baseQuery({
          url: `${EVENTS_PATH}/listFaultsByTimeTrend.do`,
          method: 'POST',
          body: {
            ...(branchId && { managementCdTree: branchId }),
            ...(deviceId && { deviceKey: deviceId }),
            ...(deviceType && { deviceKind: deviceType }),
          },
        })) as QueryResponse<ResTodayHourlyEventCounts>;

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

        const parsed = resTodayHourlyEventCountsSchema.safeParse(response);

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
    // 일별 장애 건수 조회
    getDailyUnresolvedEventCountsByDateRange: build.query<
      ResDailyEventCountsByDateRange,
      {
        branchId?: number;
        deviceId?: number;
        deviceType?: number;
        fromDate?: string;
        toDate?: string;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Events.Type,
          id: QUERY_TAG_IDS.Events.DailyUnresolvedEventCountsByDateRange,
        },
      ],
      queryFn: async (
        { branchId, deviceId, deviceType, fromDate, toDate },
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

        const res = (await baseQuery({
          url: `${EVENTS_PATH}/listFaultTrend.do`,
          method: 'POST',
          body: {
            ...(branchId && { managementCdTree: branchId }),
            ...(deviceId && { deviceKey: deviceId }),
            ...(deviceType && { deviceKind: deviceType }),
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
          },
        })) as QueryResponse<ResDailyEventCountsByDateRange>;

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

        const parsed = resDailyEventCountsByDateRangeSchema.safeParse(response);

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
    // 미처리 장애 장비 순위 조회
    getDeviceRankingsByUnresolvedEvent: build.query<
      ResDeviceRankingsByEvent,
      {
        branchId?: number;
        deviceId?: number;
        deviceType?: number;
        eventTypes?: number[];
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Events.Type,
          id: QUERY_TAG_IDS.Events.DeviceRankingsByUnresolvedEvent,
        },
      ],
      queryFn: async (
        { branchId, deviceId, deviceType, eventTypes },
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

        const res = (await baseQuery({
          url: `${EVENTS_PATH}/listDeviceFaultRanking.do`,
          method: 'POST',
          body: {
            ...(branchId && { managementCdTree: branchId }),
            ...(deviceId && { deviceKey: deviceId }),
            ...(deviceType && { deviceKind: deviceType }),
            ...(eventTypes && { eventLv: eventTypes.join(',') }),
          },
        })) as QueryResponse<ResDeviceRankingsByEvent>;

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
        const parsed = resDeviceRankingsByEventSchema.safeParse(response);

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
    // 미처리 장애 목록 조회
    getUnresolvedEventsByFilters: build.query<
      ResUnresolvedEventsByFilters,
      ReqEventsByFilter
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Events.Type,
          id: QUERY_TAG_IDS.Events.UnresolvedEventsByFilters,
        },
      ],
      queryFn: async (
        { page, branchId, deviceId, eventTypes, deviceType, search, sort },
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

        const res = (await baseQuery({
          url: `${EVENTS_PATH}/listFault.do`,
          method: 'POST',
          body: {
            page,
            sort,
            ...(branchId && { managementCdTree: branchId }),
            ...(deviceId && { deviceKey: deviceId }),
            ...(eventTypes && { eventLv: eventTypes.join(',') }),
            ...(deviceType && { deviceKind: deviceType }),
            ...(search && { search }),
          },
        })) as QueryResponse<ResUnresolvedEventsByFilters>;

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

        const parsed = resUnresolvedEventsByFiltersSchema.safeParse(response);

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
    getNumOfEvents: build.query<
      ResNumOfEventsData,
      {
        branchId?: number;
        deviceId?: number;
        // 조회기간 없으면 최근 7일 조회
        fromDate?: string;
        toDate?: string;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Events.Type,
          id: QUERY_TAG_IDS.Events.NumOfEvents,
        },
      ],
      queryFn: async (
        { branchId, deviceId, fromDate, toDate },
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

        const res = (await baseQuery({
          url: `${EVENTS_PATH}/getFaultHistoryCnt.do`,
          method: 'POST',
          body: {
            ...(branchId && { managementCdTree: branchId }),
            ...(deviceId && { deviceKey: deviceId }),
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
          },
        })) as QueryResponse<ResNumOfEventsData>;

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
    // 오늘 시간별 장애 건수 조회
    getTodayHourlyEventCounts: build.query<
      ResTodayHourlyEventCounts,
      {
        branchId?: number;
        deviceId?: number;
        deviceType?: number;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Events.Type,
          id: QUERY_TAG_IDS.Events.TodayHourlyEventCounts,
        },
      ],
      queryFn: async (
        { branchId, deviceId, deviceType },
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

        const res = (await baseQuery({
          url: `${EVENTS_PATH}/listFaultsHistoryByTimeTrend.do`,
          method: 'POST',
          body: {
            ...(branchId && { managementCdTree: branchId }),
            ...(deviceId && { deviceKey: deviceId }),
            ...(deviceType && { deviceKind: deviceType }),
          },
        })) as QueryResponse<ResTodayHourlyEventCounts>;

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

        const parsed = resTodayHourlyEventCountsSchema.safeParse(response);

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
    // 일별 장애 건수 조회
    getDailyEventCountsByDateRange: build.query<
      ResDailyEventCountsByDateRange,
      {
        branchId?: number;
        deviceId?: number;
        deviceType?: number;
        fromDate?: string;
        toDate?: string;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Events.Type,
          id: QUERY_TAG_IDS.Events.DailyEventCountsByDateRange,
        },
      ],
      queryFn: async (
        { branchId, deviceId, deviceType, fromDate, toDate },
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

        const res = (await baseQuery({
          url: `${EVENTS_PATH}/listFaultHistoryTrend.do`,
          method: 'POST',
          body: {
            ...(branchId && { managementCdTree: branchId }),
            ...(deviceId && { deviceKey: deviceId }),
            ...(deviceType && { deviceKind: deviceType }),
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
          },
        })) as QueryResponse<ResDailyEventCountsByDateRange>;

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

        const parsed = resDailyEventCountsByDateRangeSchema.safeParse(response);

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
    getDeviceRankingsByEvent: build.query<
      ResDeviceRankingsByEvent,
      {
        branchId?: number;
        deviceId?: number;
        deviceType?: number;
        eventTypes?: number[];
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Events.Type,
          id: QUERY_TAG_IDS.Events.DeviceRankingsByEvent,
        },
      ],
      queryFn: async (
        { branchId, deviceId, deviceType, eventTypes },
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

        const res = (await baseQuery({
          url: `${EVENTS_PATH}/listDeviceFaultHistoryRanking.do`,
          method: 'POST',
          body: {
            ...(branchId && { managementCdTree: branchId }),
            ...(deviceId && { deviceKey: deviceId }),
            ...(deviceType && { deviceKind: deviceType }),
            ...(eventTypes && { eventLv: eventTypes.join(',') }),
          },
        })) as QueryResponse<ResDeviceRankingsByEvent>;

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

        const parsed = resDeviceRankingsByEventSchema.safeParse(response);

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
    getEventsByFilters: build.query<ResEventsByFilters, ReqEventsByFilter>({
      providesTags: (result, error, args) => [
        {
          type: QUERY_TAG_IDS.Events.Type,
          id: QUERY_TAG_IDS.Events.EventsByFilters,
        },
        {
          type: QUERY_TAG_IDS.Events.Type,
          id: `EventsByFilters-${Object.values(args).join('')}`,
        },
      ],
      queryFn: async (
        {
          page,
          branchId,
          deviceId,
          eventTypes,
          deviceType,
          search,
          sort,
          fromDate,
          toDate,
        },
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

        const res = (await baseQuery({
          url: `${EVENTS_PATH}/listFaultHistory.do`,
          method: 'POST',
          body: {
            page,
            sort,
            ...(branchId && { managementCdTree: branchId }),
            ...(deviceId && { deviceKey: deviceId }),
            ...(eventTypes && { eventLv: eventTypes.join(',') }),
            ...(deviceType && { deviceKind: deviceType }),
            ...(search && { search }),
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
          },
        })) as QueryResponse<ResUnresolvedEventsByFilters | ResEventsByFilters>;

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

        const parsed = resEventsByFiltersSchema.safeParse(response);

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
    clearFaultEventByAdmin: build.mutation<null, { eventKey: number}>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Dashboard.Type,
          id: QUERY_TAG_IDS.Dashboard.WidgetList,
        },
      ],
      queryFn: async ({eventKey}, { getState }, _extraOptions, baseQuery) => {
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
          url: `${EVENTS_PATH}/faultEventClearByAdmin.do`,
          method: 'POST',
          body: { eventKey: eventKey },
        });

        if (res.error) return res;

        return {
          data: null,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdateEventCommentMutation,
  useGetEventCommentByIdQuery,
  useGetNumOfUnresolvedEventsQuery,
  useLazyGetNumOfUnresolvedEventsQuery,
  useGetTodayHourlyUnresolvedEventCountsQuery,
  useLazyGetTodayHourlyUnresolvedEventCountsQuery,
  useGetDailyUnresolvedEventCountsByDateRangeQuery,
  useLazyGetDailyUnresolvedEventCountsByDateRangeQuery,
  useGetDeviceRankingsByUnresolvedEventQuery,
  useLazyGetDeviceRankingsByUnresolvedEventQuery,
  useGetUnresolvedEventsByFiltersQuery,
  useLazyGetUnresolvedEventsByFiltersQuery,
  useGetNumOfEventsQuery,
  useLazyGetNumOfEventsQuery,
  useGetTodayHourlyEventCountsQuery,
  useLazyGetTodayHourlyEventCountsQuery,
  useGetDailyEventCountsByDateRangeQuery,
  useLazyGetDailyEventCountsByDateRangeQuery,
  useGetDeviceRankingsByEventQuery,
  useLazyGetDeviceRankingsByEventQuery,
  useGetEventsByFiltersQuery,
  useLazyGetEventsByFiltersQuery,
  useClearFaultEventByAdminMutation,
} = eventsApi;
