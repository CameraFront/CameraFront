import { AppRootState } from '@/app/store';
import {
  resDeviceManagerListAllSchema,
  resDeviceManagerListSchema,
  resDeviceManagerSchema,
} from '@/services/validation/settings';
import {
  DeviceManagerFormValues,
  ResDeviceManager,
  ResDeviceManagerList,
  ResDeviceManagerListAll,
} from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS } from '@/config';
import { settingsApi } from '.';
import { SETTINGS_PATH } from '../apiPaths';

export const deviceManagersApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    createDeviceManager: build.mutation<null, DeviceManagerFormValues>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceManagerList,
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
          url: `${SETTINGS_PATH}/createEquipManager.do`,
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
    updateDeviceManager: build.mutation<
      null,
      DeviceManagerFormValues & { seqNum: number }
    >({
      invalidatesTags: (result, error, { seqNum }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceManagerList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceManagerDetails + seqNum,
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
          url: `${SETTINGS_PATH}/updateEquipManager.do`,
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
    deleteDeviceManager: build.mutation<null, number>({
      invalidatesTags: (result, error, seqNum) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceManagerList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceManagerDetails + seqNum,
        },
      ],
      queryFn: async (seqNum, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/deleteEquipManager.do`,
          method: 'POST',
          body: { seqNum },
        })) as QueryResponse<null>;

        if (res.error)
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
              message: res.error.data.message,
            },
          };

        return { data: null };
      },
    }),
    getDeviceManagerList: build.query<
      ResDeviceManagerList,
      {
        page: number;
        search?: string;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceManagerList,
        },
      ],
      queryFn: async (params, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user) {
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };
        }

        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/listEquipManager.do`,
          method: 'POST',
          body: {
            page: params.page,
            ...(params.search && { search: params.search }),
          },
        })) as QueryResponse<ResDeviceManagerList>;

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
        const parsed = resDeviceManagerListSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: { status: 422, data: parsed.error.issues },
          };
        }

        return { data: parsed.data };
      },
    }),
    getDeviceManagerListAll: build.query<ResDeviceManagerListAll, void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceManagerListAll,
        },
      ],
      queryFn: async (params, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user) {
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };
        }

        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/listEquipManager.do`,
          method: 'POST',
          body: { type: 1 },
        })) as QueryResponse<ResDeviceManagerListAll>;

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
        const parsed = resDeviceManagerListAllSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: { status: 422, data: parsed.error.issues },
          };
        }

        return { data: parsed.data };
      },
    }),
    getDeviceManager: build.query<ResDeviceManager, number | null>({
      providesTags: (result, error, seqNum) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceManagerDetails + seqNum,
        },
      ],
      queryFn: async (seqNum, { getState }, _extraOptions, baseQuery) => {
        if (!seqNum)
          return {
            error: { status: 400, data: '장비관리자 번호가 필요합니다.' },
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
          url: `${SETTINGS_PATH}/getEquipManager.do`,
          method: 'POST',
          body: { seqNum },
        })) as QueryResponse<ResDeviceManager>;

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
        const parsed = resDeviceManagerSchema.safeParse(response);

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
  useCreateDeviceManagerMutation,
  useUpdateDeviceManagerMutation,
  useDeleteDeviceManagerMutation,
  useGetDeviceManagerListQuery,
  useGetDeviceManagerListAllQuery,
  useGetDeviceManagerQuery,
} = deviceManagersApi;
