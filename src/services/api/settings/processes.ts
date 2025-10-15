import { AppRootState } from '@/app/store';
import {
  resProcessListSchema,
  resProcessSchema,
  resSshDeviceListSchema,
} from '@/services/validation/settings';
import {
  ProcessFormValues,
  ProcessListFilters,
  ResProcess,
  ResProcessList,
  ResSshDeviceList,
} from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { ResBoolean } from '@/types/enum';
import { QUERY_TAG_IDS } from '@/config';
import { settingsApi } from '.';
import { SETTINGS_PATH } from '../apiPaths';

export const processesApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    createProcess: build.mutation<null, ProcessFormValues>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ProcessList,
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

        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/createProcess.do`,
          method: 'POST',
          body: formValues,
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
    updateProcess: build.mutation<
      null,
      ProcessFormValues & { seqNum: number; manageYn: ResBoolean }
    >({
      invalidatesTags: (result, error, { seqNum }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ProcessList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ProcessDetails + seqNum,
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

        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/updateProcess.do`,
          method: 'POST',
          body: formValues,
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
    deleteProcess: build.mutation<null, number>({
      invalidatesTags: (result, error, seqNum) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ProcessList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ProcessDetails + seqNum,
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
          url: `${SETTINGS_PATH}/deleteProcess.do`,
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
    getProcessList: build.query<ResProcessList, ProcessListFilters>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ProcessList,
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
          url: `${SETTINGS_PATH}/listProcess.do`,
          method: 'POST',
          body: {
            reqOption: 1,
            page,
            ...(deviceType && { deviceKind: deviceType }),
            ...(search && { search }),
          },
        })) as QueryResponse<ResProcessList>;

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
        const parsed = resProcessListSchema.safeParse(response);

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
    getProcess: build.query<ResProcess, number | null>({
      providesTags: (result, error, seqNum) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ProcessDetails + seqNum,
        },
      ],
      queryFn: async (seqNum, { getState }, _extraOptions, baseQuery) => {
        if (!seqNum)
          return {
            error: {
              status: 400,
              data: '프로세스ID가 필요합니다.',
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
          url: `${SETTINGS_PATH}/getProcess.do`,
          method: 'POST',
          body: { seqNum },
        })) as QueryResponse<ResProcess>;

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
        const validated = resProcessSchema.safeParse(response);

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
    getSshDeviceList: build.query<ResSshDeviceList, number>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.SshDeviceList,
        },
      ],
      queryFn: async (deviceKind, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/listDevicesForSsh.do`,
          method: 'POST',
          body: { deviceKind },
        })) as QueryResponse<ResSshDeviceList>;

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
        const parsed = resSshDeviceListSchema.safeParse(response);

        if (!parsed.success)
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };

        return {
          data: parsed.data,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProcessMutation,
  useUpdateProcessMutation,
  useDeleteProcessMutation,
  useGetProcessListQuery,
  useGetProcessQuery,
  useGetSshDeviceListQuery,
  useLazyGetSshDeviceListQuery,
} = processesApi;
