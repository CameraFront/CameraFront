import dayjs from 'dayjs';
import { AppRootState } from '@/app/store';
import {
  resDeviceListSchema,
  resDeviceSchema,
} from '@/services/validation/settings';
import {
  DeviceFormValues,
  DeviceListFilters,
  ResDevice,
  ResDeviceList,
} from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS, YEAR_DATE_FORMAT } from '@/config';
import { settingsApi } from '.';
import { SETTINGS_PATH } from '../apiPaths';

export const devicesApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    createDevice: build.mutation<null, DeviceFormValues>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceList,
        },
      ],
      queryFn: async (
        { installDate, ...formValues },
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
          url: `${SETTINGS_PATH}/createDevice.do`,
          method: 'POST',
          body: {
            ...formValues,
            installDate: installDate
              ? dayjs(installDate).format(YEAR_DATE_FORMAT)
              : '',
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

        return {
          data: null,
        };
      },
    }),
    updateDevice: build.mutation<
      null,
      DeviceFormValues & { deviceKey: number }
    >({
      invalidatesTags: (result, error, { deviceKey }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceDetails + deviceKey,
        },
      ],
      queryFn: async (
        { installDate, ...formValues },
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
          url: `${SETTINGS_PATH}/updateDevice.do`,
          method: 'POST',
          body: {
            ...formValues,
            installDate: installDate
              ? dayjs(installDate).format(YEAR_DATE_FORMAT)
              : '',
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

        return {
          data: null,
        };
      },
    }),
    deleteDevice: build.mutation<null, number>({
      invalidatesTags: (result, error, deviceKey) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceDetails + deviceKey,
        },
      ],
      queryFn: async (deviceKey, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/deleteDevice.do`,
          method: 'POST',
          body: { deviceKey },
        })) as QueryResponse<null>;

        if (res.error)
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
              message: res.error.data.message,
            },
          };

        return {
          data: null,
        };
      },
    }),
    getDeviceList: build.query<ResDeviceList, DeviceListFilters>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceList,
        },
      ],
      queryFn: async (
        {
          managementCd1,
          managementCd2,
          managementCd3,
          deviceType,
          search,
          page = 1,
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
        const managementCdTree =
          managementCd3 || managementCd2 || managementCd1;
        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/listDevice.do`,
          method: 'POST',
          body: {
            page,
            ...(managementCdTree && { managementCdTree }),
            ...(deviceType && { deviceKind: deviceType }),
            ...(search && { search }),
          },
        })) as QueryResponse<ResDeviceList>;

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
        const validated = resDeviceListSchema.safeParse(response);

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
    getDevice: build.query<ResDevice, number | null>({
      providesTags: (result, error, deviceKey) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceDetails + deviceKey,
        },
      ],
      queryFn: async (deviceKey, { getState }, _extraOptions, baseQuery) => {
        if (!deviceKey)
          return {
            error: {
              status: 400,
              data: '장비ID가 필요합니다.',
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
          url: `${SETTINGS_PATH}/getDevice.do`,
          method: 'POST',
          body: { deviceKey },
        })) as QueryResponse<ResDevice>;

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
        const validated = resDeviceSchema.safeParse(response);

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
  useCreateDeviceMutation,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
  useGetDeviceListQuery,
  useGetDeviceQuery,
} = devicesApi;
