import { AppRootState } from '@/app/store';
import {
  resManagementListSchema,
  resManagementSchema,
} from '@/services/validation/settings';
import {
  CreateManagementFormValues,
  ResManagement,
  ResManagementList,
  UpdateManagementFormValues,
} from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS } from '@/config';
import { settingsApi } from '.';
import { SETTINGS_PATH } from '../apiPaths';

export const managementApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    createManagement: build.mutation<null, CreateManagementFormValues>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ManagementList,
        },
        {
          type: QUERY_TAG_IDS.Common.Type,
          id: QUERY_TAG_IDS.Common.ParentBranchList,
        },
      ],
      queryFn: async (
        { parentNodes, ...rest },
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
          url: `${SETTINGS_PATH}/createManagement.do`,
          method: 'POST',
          body: { ...rest, parentNode: parentNodes[parentNodes.length - 1] },
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
    updateManagement: build.mutation<null, UpdateManagementFormValues>({
      invalidatesTags: (result, error, arg) => [
        {
          type: QUERY_TAG_IDS.Common.Type,
          id: QUERY_TAG_IDS.Common.ParentBranchList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ManagementList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: `${QUERY_TAG_IDS.Settings.ManagementDetails}-${arg.managementCd}`,
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
          url: `${SETTINGS_PATH}/updateManagement.do`,
          method: 'POST',
          body: params,
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
    deleteManagement: build.mutation<null, number>({
      invalidatesTags: (result, error, managementCd) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ManagementList,
        },
        {
          type: QUERY_TAG_IDS.Common.Type,
          id: QUERY_TAG_IDS.Common.ParentBranchList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: `${QUERY_TAG_IDS.Settings.ManagementDetails}-${managementCd}`,
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
          url: `${SETTINGS_PATH}/deleteManagement.do`,
          method: 'POST',
          body: { managementCd },
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
    getManagementList: build.query<
      ResManagementList,
      {
        depth: number;
        page: number;
        search?: string;
        managementCdTree?: number | null;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.ManagementList,
        },
      ],
      queryFn: async (
        { depth, managementCdTree, page, search },
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
          url: `${SETTINGS_PATH}/listManagementWithPage.do`,
          method: 'POST',
          body: {
            page,
            depth,
            ...(managementCdTree && { managementCdTree }),
            ...(search && { search }),
          },
        })) as QueryResponse<ResManagementList>;

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
        const validated = resManagementListSchema.safeParse(response);

        if (!validated.success) {
          return {
            error: {
              status: 422,
              data: validated.error.issues,
            },
          };
        }

        return {
          data: response,
        };
      },
    }),
    getManagement: build.query<ResManagement, number | undefined>({
      providesTags: (_result, _error, managementCd) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: `${QUERY_TAG_IDS.Settings.ManagementDetails}-${managementCd}`,
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

        if (!managementCd)
          return {
            error: {
              status: 400,
              data: '소속 코드가 필요합니다.',
            },
          };

        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/getManagement.do`,
          method: 'POST',
          body: { managementCd },
        })) as QueryResponse<ResManagement>;

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
        const validated = resManagementSchema.safeParse(response);

        if (!validated.success) {
          return {
            error: {
              status: 422,
              data: validated.error.issues,
            },
          };
        }

        return {
          data: response,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateManagementMutation,
  useUpdateManagementMutation,
  useDeleteManagementMutation,
  useGetManagementListQuery,
  useGetManagementQuery,
} = managementApi;
