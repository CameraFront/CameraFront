import { AppRootState } from '@/app/store';
import {
  resThresholdListSchema,
  resThresholdSchema,
} from '@/services/validation/settings';
import {
  ResThreshold,
  ResThresholdList,
  ThresholdFormValues,
} from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS } from '@/config';
import { settingsApi } from '.';
import { SETTINGS_PATH } from '../apiPaths';

export const thresholdsApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    updateThreshold: build.mutation<
      null,
      ThresholdFormValues & { deviceKey: number }
    >({
      invalidatesTags: (result, error, { deviceKey }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ThresholdList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ThresholdDetails + deviceKey,
        },
      ],
      queryFn: async (params, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/updateDeviceThr.do`,
          method: 'POST',
          body: params,
        })) as QueryResponse<null>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
            },
          };
        }

        return { data: null };
      },
    }),

    getThresholdList: build.query<
      ResThresholdList,
      {
        page: number;
        search?: string;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ThresholdList,
        },
      ],
      queryFn: async (params, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user) {
          return {
            error: {
              status: 401,
              data: null,
            },
          };
        }

        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/listDeviceThr.do`,
          method: 'POST',
          body: {
            page: params.page,
            ...(params.search && { search: params.search }),
          },
        })) as QueryResponse<ResThresholdList>;

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
        const parsed = resThresholdListSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: { status: 422, data: parsed.error.issues },
          };
        }

        return { data: parsed.data };
      },
    }),
    getThreshold: build.query<ResThreshold, number | null>({
      providesTags: (result, error, deviceKey) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ThresholdDetails + deviceKey,
        },
      ],
      queryFn: async (deviceKey, { getState }, _extraOptions, baseQuery) => {
        if (!deviceKey)
          return {
            error: { status: 400, data: '장비 번호가 필요합니다.' },
          };

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
          url: `${SETTINGS_PATH}/getDeviceThr.do`,
          method: 'POST',
          body: { deviceKey },
        })) as QueryResponse<ResThreshold>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
            },
          };
        }

        const { response } = res.data;
        const parsed = resThresholdSchema.safeParse(response);

        if (!parsed.success) {
          return { error: { status: 422, data: parsed.error.issues } };
        }

        return { data: parsed.data };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdateThresholdMutation,
  useGetThresholdListQuery,
  useGetThresholdQuery,
} = thresholdsApi;
