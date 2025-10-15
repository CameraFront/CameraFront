import { AppRootState } from '@/app/store';
import {
  resEventListSchema,
  resEventSchema,
} from '@/services/validation/settings';
import { EventFormValues, ResEvent, ResEventList } from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS } from '@/config';
import { settingsApi } from '.';
import { SETTINGS_PATH } from '../apiPaths';

export const eventsApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    updateEvent: build.mutation<null, EventFormValues & { fCd: string }>({
      invalidatesTags: (result, error, { fCd }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.EventList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.EventDetails + fCd,
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
          url: `${SETTINGS_PATH}/updateEvent.do`,
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
    getEventList: build.query<
      ResEventList,
      {
        page: number;
        search?: string;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.EventList,
        },
      ],
      queryFn: async (params, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/listEvent.do`,
          method: 'POST',
          body: {
            page: params.page,
            ...(params.search && { search: params.search }),
          },
        })) as QueryResponse<ResEventList>;
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
        const parsed = resEventListSchema.safeParse(response);
        if (!parsed.success) {
          return {
            error: { status: 422, data: parsed.error.issues },
          };
        }

        return { data: parsed.data };
      },
    }),
    getEvent: build.query<ResEvent, string | null>({
      providesTags: (result, error, fCd) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.EventDetails + fCd,
        },
      ],
      queryFn: async (fCd, { getState }, _extraOptions, baseQuery) => {
        if (!fCd)
          return {
            error: { status: 400, data: '장애코드가 필요합니다.' },
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
          url: `${SETTINGS_PATH}/getEvent.do`,
          method: 'POST',
          body: { fCd },
        })) as QueryResponse<ResEvent>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
            },
          };
        }

        const { response } = res.data;
        const parsed = resEventSchema.safeParse(response);

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
  useUpdateEventMutation,
  useGetEventListQuery,
  useGetEventQuery,
} = eventsApi;
