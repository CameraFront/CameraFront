import { AppRootState } from '@/app/store';
import {
  resUserListSchema,
  resUserSchema,
} from '@/services/validation/settings';
import {
  ResUser,
  ResUserList,
  ResValidateUserId,
  UserFormValues,
} from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS } from '@/config';
import { settingsApi } from '.';
import { SETTINGS_PATH } from '../apiPaths';

export const usersApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    createUser: build.mutation<null, UserFormValues>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.UserList,
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
          url: `${SETTINGS_PATH}/createUser.do`,
          method: 'POST',
          body: params,
        })) as QueryResponse<ResUser>;

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
    updateUser: build.mutation<null, UserFormValues>({
      invalidatesTags: (result, error, { userId }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.UserList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.UserDetails + userId,
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
          url: `${SETTINGS_PATH}/updateUser.do`,
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
    deleteUser: build.mutation<null, string>({
      invalidatesTags: (result, error, userId) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.UserList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.UserDetails + userId,
        },
      ],
      queryFn: async (userId, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/deleteUser.do`,
          method: 'POST',
          body: { userId },
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
    validateUserId: build.mutation<boolean, string>({
      queryFn: async (userId, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/idDuplicateCheck.do`,
          method: 'POST',
          body: { userId },
        })) as QueryResponse<ResValidateUserId>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
              message: res.error.data.message,
            },
          };
        }

        return { data: res.data.response.cnt === 0 };
      },
    }),
    getUserList: build.query<ResUserList, void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.UserList,
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
          url: `${SETTINGS_PATH}/listUser.do`,
          method: 'POST',
          body: {},
        })) as QueryResponse<ResUserList>;

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
        const parsed = resUserListSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: { status: 422, data: parsed.error.issues },
          };
        }

        return { data: parsed.data };
      },
    }),
    getUser: build.query<ResUser, string | null>({
      providesTags: (result, error, userId) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.UserDetails + userId,
        },
      ],
      queryFn: async (userId, { getState }, _extraOptions, baseQuery) => {
        if (!userId)
          return {
            error: { status: 400, data: '사용자 아이디가 필요합니다.' },
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
          url: `${SETTINGS_PATH}/getUser.do`,
          method: 'POST',
          body: { userId },
        })) as QueryResponse<ResUser>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
            },
          };
        }

        const { response } = res.data;
        const parsed = resUserSchema.safeParse(response);

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
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useValidateUserIdMutation,
  useGetUserListQuery,
  useGetUserQuery,
} = usersApi;
