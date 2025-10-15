import { AppRootState } from '@/app/store';
import {
  resPhoneListScanSchema,
  resPhoneListSchema,
  resPhoneSchema,
  resPhoneTypeListSchema,
} from '@/services/validation/settings';
import {
  PhoneFormValues,
  PhoneListFilters,
  ResPhone,
  ResPhoneList,
  ResPhoneListScan,
  ResPhoneTypeList,
} from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS } from '@/config';
import { settingsApi } from '.';
import { SETTINGS_PATH } from '../apiPaths';

export const phonesApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    createPhone: build.mutation<null, PhoneFormValues>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.PhoneList,
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
          url: `${SETTINGS_PATH}/createPhone.do`,
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
    updatePhone: build.mutation<null, PhoneFormValues & { phoneKey: number }>({
      invalidatesTags: (result, error, { phoneKey }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.PhoneList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.PhoneDetails + phoneKey,
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
          url: `${SETTINGS_PATH}/updatePhone.do`,
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
    deletePhone: build.mutation<null, number>({
      invalidatesTags: (result, error, phoneKey) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.PhoneList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.PhoneDetails + phoneKey,
        },
      ],
      queryFn: async (phoneKey, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/deletePhone.do`,
          method: 'POST',
          body: { phoneKey },
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
    getPhoneTypeList: build.query<
      ResPhoneTypeList,
      {
        hasPagination?: boolean;
        phoneType?: number;
      } | void
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.PhoneTypeList,
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

        const { hasPagination = false, phoneType } = params || {};
        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/listPhoneType.do`,
          method: 'POST',
          body: {
            type: hasPagination ? 1 : null,
            ...(phoneType && { phoneType }),
          },
        })) as QueryResponse<ResPhoneTypeList>;

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
        const parsed = resPhoneTypeListSchema.safeParse(response);

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
    getPhoneList: build.query<ResPhoneList, PhoneListFilters>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.PhoneList,
        },
      ],
      queryFn: async (
        { managementCd, phoneType, search, page = 1 },
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
          url: `${SETTINGS_PATH}/listPhone.do`,
          method: 'POST',
          body: {
            page,
            ...(managementCd && { managementCd }),
            ...(phoneType && { phoneType }),
            ...(search && { search }),
          },
        })) as QueryResponse<ResPhoneList>;

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
        const validated = resPhoneListSchema.safeParse(response);

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
    getPhoneListScan: build.query<ResPhoneListScan, PhoneListFilters>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.PhoneList,
        },
      ],
      queryFn: async (
        { managementCd, phoneType, search, page = 1 },
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
          url: `${SETTINGS_PATH}/listPhoneScan.do`,
          method: 'POST',
          body: {
            page,
            ...(managementCd && { managementCd }),
            ...(phoneType && { phoneType }),
            ...(search && { search }),
          },
        })) as QueryResponse<ResPhoneListScan>;

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
        const validated = resPhoneListScanSchema.safeParse(response);

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
    getPhone: build.query<ResPhone, number | null>({
      providesTags: (result, error, phoneKey) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.PhoneDetails + phoneKey,
        },
      ],
      queryFn: async (phoneKey, { getState }, _extraOptions, baseQuery) => {
        if (!phoneKey)
          return {
            error: {
              status: 400,
              data: '전화기ID가 필요합니다.',
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
          url: `${SETTINGS_PATH}/getPhone.do`,
          method: 'POST',
          body: { phoneKey },
        })) as QueryResponse<ResPhone>;

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
        const validated = resPhoneSchema.safeParse(response);

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
  useCreatePhoneMutation,
  useUpdatePhoneMutation,
  useDeletePhoneMutation,
  useGetPhoneTypeListQuery,
  useGetPhoneListQuery,
  useGetPhoneQuery,
  useGetPhoneListScanQuery,
} = phonesApi;
