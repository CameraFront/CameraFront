import { AppRootState } from '@/app/store';
import {
  resRoleGroupListSchema,
  resRoleListSchema,
  resRoleSchema,
} from '@/services/validation/settings';
import {
  ResRole,
  ResRoleGroupList,
  ResRoleList,
  RoleFormValues,
} from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS } from '@/config';
import { settingsApi } from '.';
import { SETTINGS_PATH } from '../apiPaths';

export const rolesApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    createRole: build.mutation<null, RoleFormValues>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.RoleList,
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
          url: `${SETTINGS_PATH}/createRole.do`,
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
    updateRole: build.mutation<null, RoleFormValues & { roleId: number }>({
      invalidatesTags: (result, error, { roleId }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.RoleList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.RoleDetails + roleId,
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
          url: `${SETTINGS_PATH}/updateRole.do`,
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
    deleteRole: build.mutation<null, number>({
      invalidatesTags: (result, error, roleId) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.RoleList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.RoleDetails + roleId,
        },
      ],
      queryFn: async (roleId, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/deleteRole.do`,
          method: 'POST',
          body: { roleId },
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
    getRoleGroupList: build.query<ResRoleGroupList, void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.RoleGroupList,
        },
      ],
      queryFn: async (_, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user) {
          return {
            error: { status: 401, data: '로그인이 필요합니다.' },
          };
        }

        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/listGroupRole.do`,
          method: 'POST',
          body: {},
        })) as QueryResponse<ResRoleGroupList>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
            },
          };
        }

        const { response } = res.data;
        const parsed = resRoleGroupListSchema.safeParse(response);

        if (!parsed.success) {
          return { error: { status: 422, data: parsed.error.issues } };
        }

        return { data: parsed.data };
      },
    }),
    getRoleList: build.query<ResRoleList, void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.RoleList,
        },
      ],
      queryFn: async (_, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/listRole.do`,
          method: 'POST',
          body: {},
        })) as QueryResponse<ResRoleList>;

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
        const parsed = resRoleListSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: { status: 422, data: parsed.error.issues },
          };
        }

        return { data: parsed.data };
      },
    }),
    getRole: build.query<ResRole, number | null>({
      providesTags: (result, error, roleId) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.RoleDetails + roleId,
        },
      ],
      queryFn: async (roleId, { getState }, _extraOptions, baseQuery) => {
        if (!roleId)
          return {
            error: { status: 400, data: '권한 아이디가 필요합니다.' },
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
          url: `${SETTINGS_PATH}/getRole.do`,
          method: 'POST',
          body: { roleId },
        })) as QueryResponse<ResRole>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
            },
          };
        }

        const { response } = res.data;
        const parsed = resRoleSchema.safeParse(response);

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
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRoleGroupListQuery,
  useGetRoleListQuery,
  useGetRoleQuery,
} = rolesApi;
