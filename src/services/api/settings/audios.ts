import { AppRootState } from '@/app/store';
import {
  resAllAudiosSchema,
  resAudioListSchema,
  resAudioSchema,
} from '@/services/validation/settings';
import {
  AudioFormValues,
  ResAllAudios,
  ResAudio,
  ResAudioList,
} from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import { HasPagination } from '@/types/enum';
import { QUERY_TAG_IDS } from '@/config';
import { settingsApi } from '.';
import { SETTINGS_PATH } from '../apiPaths';

export const audiosApi = settingsApi.injectEndpoints({
  endpoints: build => ({
    createAudio: build.mutation<null, AudioFormValues>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.AudioList,
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

        const body = new FormData();
        body.append('soundNm', params.soundNm);
        body.append('type', params.type.toString());
        body.append('file', params.file);

        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/createAudio.do`,
          method: 'POST',
          body,
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
    updateAudio: build.mutation<null, AudioFormValues & { seqNum: number }>({
      invalidatesTags: (result, error, { seqNum }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.AudioList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.AudioDetails + seqNum,
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

        const body = new FormData();
        body.append('seqNum', params.seqNum.toString());
        body.append('soundNm', params.soundNm);
        body.append('type', params.type.toString());
        body.append('file', params.file);

        const res = (await baseQuery({
          url: `${SETTINGS_PATH}/updateAudio.do`,
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

        return { data: null };
      },
    }),
    deleteAudio: build.mutation<null, number>({
      invalidatesTags: (result, error, seqNum) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.AudioList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.AudioDetails + seqNum,
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
          url: `${SETTINGS_PATH}/deleteAudio.do`,
          method: 'POST',
          body: { seqNum },
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

        return { data: null };
      },
    }),
    getAllAudios: build.query<ResAllAudios, void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.AudioList,
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
          url: `${SETTINGS_PATH}/listAudio.do`,
          method: 'POST',
          body: {
            type: HasPagination.False,
          },
        })) as QueryResponse<ResAllAudios>;
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
        const parsed = resAllAudiosSchema.safeParse(response);
        if (!parsed.success) {
          return { error: { status: 422, data: parsed.error.issues } };
        }

        return { data: parsed.data };
      },
    }),

    getAudioList: build.query<
      ResAudioList,
      {
        page: number;
        search?: string;
      }
    >({
      providesTags: (result, error, params) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.AudioList,
        },
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.AudioList + JSON.stringify(params),
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
          url: `${SETTINGS_PATH}/listAudio.do`,
          method: 'POST',
          body: {
            type: HasPagination.True,
            page: params.page,
            ...(params.search && { search: params.search }),
          },
        })) as QueryResponse<ResAudioList>;
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
        const parsed = resAudioListSchema.safeParse(response);
        if (!parsed.success) {
          return {
            error: { status: 422, data: parsed.error.issues },
          };
        }

        return { data: parsed.data };
      },
    }),
    getAudio: build.query<ResAudio, number | null>({
      providesTags: (result, error, seqNum) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.AudioDetails + seqNum,
        },
      ],
      queryFn: async (seqNum, { getState }, _extraOptions, baseQuery) => {
        if (!seqNum)
          return {
            error: { status: 400, data: '오디오아이디가 필요합니다.' },
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
          url: `${SETTINGS_PATH}/getAudio.do`,
          method: 'POST',
          body: { seqNum },
        })) as QueryResponse<ResAudio>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
            },
          };
        }

        const { response } = res.data;
        const parsed = resAudioSchema.safeParse(response);

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
  useCreateAudioMutation,
  useUpdateAudioMutation,
  useDeleteAudioMutation,
  useGetAllAudiosQuery,
  useGetAudioListQuery,
  useGetAudioQuery,
} = audiosApi;
