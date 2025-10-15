import { message } from 'antd';
import { AppRootState } from '@/app/store';
import {
  resDeviceManualListSchema,
  resDeviceManualSchema,
} from '@/services/validation/settings';
import {
  DeviceManualListFilters,
  DevicesManualFormValues,
  ResDeviceManual,
  ResDeviceManualList,
} from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { NO_VALUE } from '@/config/constants';
import { getSuccessMessage } from '@/config/messages';
import { QUERY_TAG_IDS } from '@/config';
import { settingsApi } from '.';
import { SETTINGS_PATH } from '../apiPaths';

export const deviceManualsApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    createDeviceManual: build.mutation<null, DevicesManualFormValues>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ManualList,
        },
      ],
      queryFn: async (formValues, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const body = new FormData();
        for (const [key, value] of Object.entries(formValues)) {
          if (key === 'fileList') {
            if (value[0]?.originFileObj)
              body.append('file', value[0].originFileObj);
          } else if (key === 'deviceKey') {
            if (value !== NO_VALUE) body.append(key, value.toString());
          } else if (value) body.append(key, value.toString());
        }

        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/createDeviceManual.do`,
          method: 'POST',
          body,
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

        message.success(getSuccessMessage('create', '매뉴얼이'));
        return {
          data: null,
        };
      },
    }),
    updateDeviceManual: build.mutation<
      null,
      DevicesManualFormValues & {
        seqNum: number;
      }
    >({
      invalidatesTags: (result, error, { seqNum }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ManualList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ManualDetails + seqNum,
        },
      ],
      queryFn: async (formValues, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const body = new FormData();
        for (const [key, value] of Object.entries(formValues)) {
          if (key === 'fileList') {
            if (value[0]?.originFileObj)
              body.append('file', value[0].originFileObj);
          } else if (key === 'deviceKey') {
            if (value !== NO_VALUE) body.append(key, value.toString());
          } else if (value) body.append(key, value.toString());
        }
        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/updateDeviceManual.do`,
          method: 'POST',
          body,
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

        message.success(getSuccessMessage('update', '매뉴얼이'));
        return {
          data: null,
        };
      },
    }),
    deleteDeviceManual: build.mutation<null, number>({
      invalidatesTags: (result, error, seqNum) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ManualList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ManualDetails + seqNum,
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
          url: `${SETTINGS_PATH}/deleteDeviceManual.do`,
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

        message.success(getSuccessMessage('delete', '매뉴얼이'));
        return {
          data: null,
        };
      },
    }),
    getDeviceManualList: build.query<
      ResDeviceManualList,
      DeviceManualListFilters
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ManualList,
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

        const { page = 1, deviceType, search } = params || {};
        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/listDeviceManual.do`,
          method: 'POST',
          body: {
            page,
            ...(deviceType && { depth1: deviceType }),
            ...(search && { search }),
          },
        })) as QueryResponse<ResDeviceManualList>;

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
        const parsed = resDeviceManualListSchema.safeParse(response);

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
    getDeviceManual: build.query<ResDeviceManual, number | null>({
      providesTags: (result, error, seqNum) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ManualDetails + seqNum,
        },
      ],
      queryFn: async (seqNum, { getState }, _extraOptions, baseQuery) => {
        if (!seqNum)
          return {
            error: {
              status: 400,
              data: '매뉴얼ID가 필요합니다.',
            },
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
          url: `${SETTINGS_PATH}/getDeviceManual.do`,
          method: 'POST',
          body: { seqNum },
        })) as QueryResponse<ResDeviceManual>;

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
        const validated = resDeviceManualSchema.safeParse(response);

        if (!validated.success)
          return {
            error: {
              status: 422,
              data: validated.error.issues,
            },
          };

        return {
          data: validated.data,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateDeviceManualMutation,
  useUpdateDeviceManualMutation,
  useDeleteDeviceManualMutation,
  useGetDeviceManualListQuery,
  useGetDeviceManualQuery,
} = deviceManualsApi;
