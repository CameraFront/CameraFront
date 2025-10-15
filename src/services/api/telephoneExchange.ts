import { AppRootState } from '@/app/store';
import {
  resCallPeakTrendSchema,
  resCurrentCallTrendSchema,
  resPhoneCountSchema,
  resPhoneStatisticsByFilterSchema,
  resUnregisteredPhoneDetailsSchema,
  resUnregisteredPhonesByFilterScanSchema,
  resUnregisteredPhonesByFilterSchema,
} from '@/services/validation/telephoneExchange';
import {
  ResCallPeakTrend,
  ResCurrentCallTrend,
  ResPhoneCount,
  ResPhoneStatisticsByFilter,
  ResUnregisteredPhoneDetails,
  ResUnregisteredPhonesByFilter,
  ResUnregisteredPhonesByFilterScan,
  TelephoneExchangeSearchParams,
} from '@/types/api/telephoneExchange';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS } from '@/config';
import { DEVICE_PATH, SETTINGS_PATH } from './apiPaths';
import { baseApi } from './baseApi';

export const telephoneExchangeApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getUnregisteredPhonesByFilter: build.query<
      ResUnregisteredPhonesByFilter,
      TelephoneExchangeSearchParams & { branchId: number | undefined }
    >({
      providesTags: (result, error, args) => [
        {
          type: QUERY_TAG_IDS.TelephoneExchange.Type,
          id: QUERY_TAG_IDS.TelephoneExchange.UnregisteredPhonesByFilter,
        },
        {
          type: QUERY_TAG_IDS.TelephoneExchange.Type,
          id: `${QUERY_TAG_IDS.TelephoneExchange.Type}-${Object.values(args).join('')}`,
        },
      ],
      queryFn: async (
        { branchId, page = 1 },
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
          url: `${DEVICE_PATH}/listPhoneUnReg.do`,
          method: 'POST',
          body: { page, ...(branchId && { managementCdTree: branchId }) },
        })) as QueryResponse<ResUnregisteredPhonesByFilter>;

        if (res.error) return res;

        const { response } = res.data;
        const parsed = resUnregisteredPhonesByFilterSchema.safeParse(response);

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
    getUnregisteredPhonesByFilterScan: build.query<
      ResUnregisteredPhonesByFilterScan,
      TelephoneExchangeSearchParams & { branchId: number | undefined }
    >({
      providesTags: (result, error, args) => [
        {
          type: QUERY_TAG_IDS.TelephoneExchange.Type,
          id: QUERY_TAG_IDS.TelephoneExchange.UnregisteredPhonesByFilter,
        },
        {
          type: QUERY_TAG_IDS.TelephoneExchange.Type,
          id: `${QUERY_TAG_IDS.TelephoneExchange.Type}-${Object.values(args).join('')}`,
        },
      ],
      queryFn: async (
        { branchId, page = 1 },
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
          url: `${DEVICE_PATH}/listPhoneUnRegScan.do`,
          method: 'POST',
          body: { page, ...(branchId && { managementCdTree: branchId }) },
        })) as QueryResponse<ResUnregisteredPhonesByFilterScan>;

        if (res.error) return res;

        const { response } = res.data;
        const parsed = resUnregisteredPhonesByFilterScanSchema.safeParse(response);

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
    getUnregisteredPhoneDetails: build.query<
      ResUnregisteredPhoneDetails,
      number
    >({
      providesTags: (result, error, args) => [
        {
          type: QUERY_TAG_IDS.TelephoneExchange.Type,
          id: QUERY_TAG_IDS.TelephoneExchange.UnregisteredPhoneDetails,
        },
        {
          type: QUERY_TAG_IDS.TelephoneExchange.Type,
          id: `${QUERY_TAG_IDS.TelephoneExchange.Type}-${args}`,
        },
      ],
      queryFn: async (phoneKey, { getState }, _extraOptions, baseQuery) => {
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
          url: `${DEVICE_PATH}/getPhone.do`,
          method: 'POST',
          body: { phoneKey },
        })) as QueryResponse<ResUnregisteredPhoneDetails>;

        if (res.error) return res;

        const { response } = res.data;
        const parsed = resUnregisteredPhoneDetailsSchema.safeParse(response);

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
    getPhoneStatisticsByFilter: build.query<
      ResPhoneStatisticsByFilter,
      TelephoneExchangeSearchParams & { branchId: number | undefined }
    >({
      queryFn: async (
        { branchId, page = 1 },
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
          url: `${DEVICE_PATH}/listPhoneRegStat.do`,
          method: 'POST',
          body: { page, ...(branchId && { managementCdTree: branchId }) },
        })) as QueryResponse<ResPhoneStatisticsByFilter>;

        if (res.error) return res;

        const { response } = res.data;
        const parsed = resPhoneStatisticsByFilterSchema.safeParse(response);

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
    getCurrentCallTrend: build.query<ResCurrentCallTrend, number | void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.TelephoneExchange.Type,
          id: QUERY_TAG_IDS.TelephoneExchange.CurrentCallTrend,
        },
      ],
      // eslint-disable-next-line @typescript-eslint/default-param-last
      queryFn: async (limit = 7, { getState }, _extraOptions, baseQuery) => {
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
          url: `${DEVICE_PATH}/liveCallTrend.do`,
          method: 'POST',
          body: { limit },
        })) as QueryResponse<ResCurrentCallTrend>;

        if (res.error) return res;

        const { response } = res.data;
        const parsed = resCurrentCallTrendSchema.safeParse(response);

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
    getCallPeakTrend: build.query<ResCallPeakTrend, number | void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.TelephoneExchange.Type,
          id: QUERY_TAG_IDS.TelephoneExchange.CallPeakTrend,
        },
      ],
      // eslint-disable-next-line @typescript-eslint/default-param-last
      queryFn: async (limit = 7, { getState }, _extraOptions, baseQuery) => {
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
          url: `${DEVICE_PATH}/callPeakTrend.do`,
          method: 'POST',
          body: { limit },
        })) as QueryResponse<ResCallPeakTrend>;

        if (res.error) return res;

        const { response } = res.data;
        const parsed = resCallPeakTrendSchema.safeParse(response);

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
    getPhoneCount: build.query<ResPhoneCount, void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.TelephoneExchange.Type,
          id: QUERY_TAG_IDS.TelephoneExchange.PhoneCount,
        },
      ],

      queryFn: async (_args, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/getPhoneCountScan.do`,
          method: 'POST',
          body: {},
        })) as QueryResponse<ResPhoneCount>;

        if (res.error) return res;

        const { response } = res.data;
        const parsed = resPhoneCountSchema.safeParse(response);

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
  useGetUnregisteredPhonesByFilterQuery,
  useGetUnregisteredPhoneDetailsQuery,
  useGetPhoneStatisticsByFilterQuery,
  useGetCurrentCallTrendQuery,
  useGetCallPeakTrendQuery,
  useGetPhoneCountQuery,
  useGetUnregisteredPhonesByFilterScanQuery,
} = telephoneExchangeApi;
