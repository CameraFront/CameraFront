import { message } from 'antd';
import dayjs from 'dayjs';
import { AppRootState } from '@/app/store';
import {
  resDeviceInspectionListSchema,
  resDeviceInspectionSchema,
} from '@/services/validation/settings';
import {
  DeviceInspectionFormValues,
  DeviceInspectionListFilters,
  ResDeviceInspection,
  ResDeviceInspectionList,
} from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { getSuccessMessage } from '@/config/messages';
import { QUERY_TAG_IDS, YEAR_DATE_FORMAT } from '@/config';
import { settingsApi } from '.';
import { DEVICE_PATH } from '../apiPaths';

export const deviceInspectionsApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    createDeviceInspection: build.mutation<null, DeviceInspectionFormValues>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.InspectionList,
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
          // eslint-disable-next-line no-continue
          if (key === 'deviceType') continue;
          if (key === 'reportFileList' || key === 'photoFileList') {
            if (value?.[0]?.originFileObj)
              body.append(key.replace('List', ''), value[0].originFileObj);
          } else if (key === 'checkDt') {
            body.append(key, dayjs(value).format(YEAR_DATE_FORMAT));
          } else if (value) body.append(key, value.toString());
        }

        const res = (await baseQuery({
          url: `${DEVICE_PATH}/insertDeviceCheckUp.do`,
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

        message.success(getSuccessMessage('create', '점검기록이'));
        return {
          data: null,
        };
      },
    }),
    updateDeviceInspection: build.mutation<
      null,
      DeviceInspectionFormValues & { seqNum: number }
    >({
      invalidatesTags: (result, error, { seqNum }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.InspectionList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.InspectionDetails + seqNum,
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
          // eslint-disable-next-line no-continue
          if (key === 'deviceType') continue;
          if (key === 'reportFileList' || key === 'photoFileList') {
            if (value?.[0]?.originFileObj)
              body.append(key.replace('List', ''), value[0].originFileObj);
          } else if (key === 'checkDt') {
            body.append(key, dayjs(value).format(YEAR_DATE_FORMAT));
          } else if (value) body.append(key, value.toString());
        }

        const res = (await baseQuery({
          url: `${DEVICE_PATH}/updateDeviceCheckUp.do`,
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

        message.success(getSuccessMessage('update', '점검기록이'));
        return {
          data: null,
        };
      },
    }),
    deleteDeviceInspection: build.mutation<null, number>({
      invalidatesTags: (result, error, seqNum) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.InspectionList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.InspectionDetails + seqNum,
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
          url: `${DEVICE_PATH}/deleteDeviceCheckUp.do`,
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

        return {
          data: null,
        };
      },
    }),
    getDeviceInspectionList: build.query<
      ResDeviceInspectionList,
      DeviceInspectionListFilters
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.InspectionList,
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
          url: `${DEVICE_PATH}/listDeviceCheckUp.do`,
          method: 'POST',
          body: {
            page,
            ...(deviceType && { deviceKind: deviceType }),
            ...(search && { search }),
          },
        })) as QueryResponse<ResDeviceInspectionList>;

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
        const parsed = resDeviceInspectionListSchema.safeParse(response);

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
    getDeviceInspection: build.query<ResDeviceInspection, number | null>({
      providesTags: (result, error, seqNum) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.InspectionDetails + seqNum,
        },
      ],
      queryFn: async (seqNum, { getState }, _extraOptions, baseQuery) => {
        if (!seqNum)
          return {
            error: {
              status: 400,
              data: '설비점검ID가 필요합니다.',
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
          url: `${DEVICE_PATH}/getDeviceCheckUp.do`,
          method: 'POST',
          body: { seqNum },
        })) as QueryResponse<ResDeviceInspection>;

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
        const validated = resDeviceInspectionSchema.safeParse(response);

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
  useCreateDeviceInspectionMutation,
  useUpdateDeviceInspectionMutation,
  useDeleteDeviceInspectionMutation,
  useGetDeviceInspectionListQuery,
  useGetDeviceInspectionQuery,
} = deviceInspectionsApi;
