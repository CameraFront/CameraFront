import { AppRootState } from '@/app/store';
import {
  resL2SwitchListSchema,
  resPortKeyListSchema,
  resTerminalListSchema,
  resTerminalSchema,
} from '@/services/validation/settings';
import {
  ResL2SwitchList,
  ResPortKeyList,
  ResTerminal,
  ResTerminalList,
  TerminalFormValues,
  TerminalListFilters,
} from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS } from '@/config';
import { settingsApi } from '.';
import { SETTINGS_PATH } from '../apiPaths';

export const terminalsApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    createTerminal: build.mutation<null, TerminalFormValues>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.TerminalList,
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
          url: `${SETTINGS_PATH}/createCamera.do`,
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
    updateTerminal: build.mutation<
      null,
      TerminalFormValues & { deviceKey: number }
    >({
      invalidatesTags: (result, error, { deviceKey }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.TerminalList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.TerminalDetails + deviceKey,
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
          url: `${SETTINGS_PATH}/updateCamera.do`,
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
    deleteTerminal: build.mutation<null, number>({
      invalidatesTags: (result, error, deviceKey) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.TerminalList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.TerminalDetails + deviceKey,
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
          url: `${SETTINGS_PATH}/deleteCamera.do`,
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

    getTerminalList: build.query<ResTerminalList, TerminalListFilters>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.TerminalList,
        },
      ],
      queryFn: async (
        { managementCd1, managementCd2, managementCd3, search, page = 1 },
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
        const managementCd = managementCd3 || managementCd2 || managementCd1;
        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/listCamera.do`,
          method: 'POST',
          body: {
            page,
            ...(managementCd && { managementCd }),
            ...(search && { search }),
          },
        })) as QueryResponse<ResTerminalList>;

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
        const validated = resTerminalListSchema.safeParse(response);

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
    getTerminal: build.query<ResTerminal, number | null>({
      providesTags: (result, error, deviceKey) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.TerminalDetails + deviceKey,
        },
      ],
      queryFn: async (deviceKey, { getState }, _extraOptions, baseQuery) => {
        if (!deviceKey)
          return {
            error: {
              status: 400,
              data: '단말기ID가 필요합니다.',
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
          url: `${SETTINGS_PATH}/getCamera.do`,
          method: 'POST',
          body: { deviceKey },
        })) as QueryResponse<ResTerminal>;

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
        const validated = resTerminalSchema.safeParse(response);

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
    getL2SwitchList: build.query<ResL2SwitchList, number | null>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.L2SwitchList,
        },
      ],
      queryFn: async (managementCd, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/listL2.do`,
          method: 'POST',
          body: { managementCd },
        })) as QueryResponse<ResL2SwitchList>;

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
        const validated = resL2SwitchListSchema.safeParse(response);

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
    getPortKeyList: build.query<ResPortKeyList, string | null>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.PortKeyList,
        },
      ],
      queryFn: async (switchIp, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/listPortKey.do`,
          method: 'POST',
          body: { switchIp },
        })) as QueryResponse<ResPortKeyList>;

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
        const validated = resPortKeyListSchema.safeParse(response);

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
  useCreateTerminalMutation,
  useUpdateTerminalMutation,
  useDeleteTerminalMutation,
  useGetTerminalListQuery,
  useGetTerminalQuery,
  useGetL2SwitchListQuery,
  useGetPortKeyListQuery,
  useLazyGetL2SwitchListQuery,
  useLazyGetPortKeyListQuery,
} = terminalsApi;
