import { Node } from 'reactflow';
import { AppRootState } from '@/app/store';
import { isRackDisplayItemNode } from '@/features/rackLayoutPage/types';
import {
  resRackLayoutDeviceImagesByDeviceTypeSchema,
  resRackLayoutDevicesByDeviceTypeSchema,
  resRackLayoutMapContentSchema,
  resRackLayoutMapListSchema,
} from '@/services/validation/rackLayout';
import {
  ResRackLayoutDeviceImagesByDeviceType,
  ResRackLayoutDevicesByDeviceType,
  ResRackLayoutMapContent,
  ResRackLayoutMapList,
} from '@/types/api/rackLayout';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS } from '@/config';
import {
  RACK_LAYOUT_EDIT_PATH,
  RACK_LAYOUT_PATH,
  SETTINGS_PATH,
} from './apiPaths';
import { baseApi } from './baseApi';

export const rackLayoutApi = baseApi.injectEndpoints({
  endpoints: build => ({
    // 새 랙실장도 맵 생성
    createRackLayoutMap: build.mutation<
      null,
      {
        managementCd: number;
        rackNm: string;
      }
    >({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.RackLayout.Type,
          id: QUERY_TAG_IDS.RackLayout.RackLayoutMapList,
        },
      ],
      queryFn: async (
        { managementCd, rackNm },
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
          url: `${RACK_LAYOUT_EDIT_PATH}/createRack.do`,
          method: 'POST',
          body: { managementCd, rackNm },
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
    // 랙실장도 맵 삭제
    deleteRackLayoutMap: build.mutation<null, number>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.RackLayout.Type,
          id: QUERY_TAG_IDS.RackLayout.RackLayoutMapList,
        },
      ],
      queryFn: async (key, { getState }, _extraOptions, baseQuery) => {
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
          url: `${RACK_LAYOUT_PATH}/deleteRack.do`,
          method: 'POST',
          body: { key },
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
    updateRackLayoutMapName: build.mutation<
      null,
      { key: number; name: string }
    >({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.RackLayout.Type,
          id: QUERY_TAG_IDS.RackLayout.RackLayoutMapList,
        },
        {
          type: QUERY_TAG_IDS.RackLayout.Type,
          id: QUERY_TAG_IDS.RackLayout.RackLayoutMapContent,
        },
      ],
      queryFn: async (
        { key, name },
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
          url: `${RACK_LAYOUT_EDIT_PATH}/updateRackNm.do`,
          method: 'POST',
          body: { key, rackNm: name },
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
    updateRackLayoutMapContent: build.mutation<
      null,
      { key: number; dataNode: Node[] }
    >({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.RackLayout.Type,
          id: QUERY_TAG_IDS.RackLayout.RackLayoutMapContent,
        },
      ],
      queryFn: async (
        { key, dataNode },
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

        const staticNode = dataNode.filter(node => isRackDisplayItemNode(node));
        const res = (await baseQuery({
          url: `${RACK_LAYOUT_EDIT_PATH}/updateRack.do`,
          method: 'POST',
          body: { key, dataNode, staticNode },
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
    // 랙실장도 맵(트리 말단) 목록 조회
    getRackLayoutMapList: build.query<ResRackLayoutMapList, void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.RackLayout.Type,
          id: QUERY_TAG_IDS.RackLayout.RackLayoutMapList,
        },
      ],
      queryFn: async (_, { getState }, _extraOptions, baseQuery) => {
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
          url: `${RACK_LAYOUT_PATH}/listRack.do`,
          method: 'POST',
          body: {},
        })) as QueryResponse<ResRackLayoutMapList>;

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
        const validated = resRackLayoutMapListSchema.safeParse(response);

        if (!validated.success) {
          return {
            error: {
              status: 422,
              data: validated.error.issues,
            },
          };
        }

        return {
          data: validated.data,
        };
      },
    }),
    // 랙실장도 맵 컨텐츠 조회
    getRackLayoutMapContent: build.query<
      ResRackLayoutMapContent,
      number | undefined
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.RackLayout.Type,
          id: QUERY_TAG_IDS.RackLayout.RackLayoutMapContent,
        },
      ],
      queryFn: async (key, { getState }, _extraOptions, baseQuery) => {
        if (!key)
          return {
            error: {
              status: 400,
              data: '랙실장도 맵 키가 필요합니다.',
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
          url: `${RACK_LAYOUT_PATH}/getRack.do`,
          method: 'POST',
          body: { key },
        })) as QueryResponse<ResRackLayoutMapContent>;

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
        const validated = resRackLayoutMapContentSchema.safeParse(response);

        if (!validated.success) {
          return {
            error: {
              status: 422,
              data: validated.error.issues,
            },
          };
        }

        return {
          data: validated.data,
        };
      },
    }),
    getRackLayoutDevicesByDeviceType: build.query<
      ResRackLayoutDevicesByDeviceType,
      number | null
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.RackLayout.Type,
          id: QUERY_TAG_IDS.RackLayout.RackLayoutDeviceList,
        },
      ],
      queryFn: async (deviceTypeId, { getState }, _extraOptions, baseQuery) => {
        if (!deviceTypeId)
          return {
            error: {
              status: 400,
              data: '디바이스 종류를 선택하세요.',
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
          url: `${RACK_LAYOUT_EDIT_PATH}/listDevice.do`,
          method: 'POST',
          body: { deviceKind: deviceTypeId },
        })) as QueryResponse<ResRackLayoutDevicesByDeviceType>;

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
        const validated =
          resRackLayoutDevicesByDeviceTypeSchema.safeParse(response);

        if (!validated.success) {
          return {
            error: {
              status: 422,
              data: validated.error.issues,
            },
          };
        }

        return {
          data: validated.data,
        };
      },
    }),
    getRackLayoutDeviceImagesByDeviceType: build.query<
      ResRackLayoutDeviceImagesByDeviceType,
      { deviceTypeId?: number; page?: number } | void
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.RackLayout.Type,
          id: QUERY_TAG_IDS.RackLayout.RackLayoutDeviceImages,
        },
      ],
      queryFn: async (params, { getState }, _extraOptions, baseQuery) => {
        const { deviceTypeId, page } = params || {};

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
          url: `${SETTINGS_PATH}/listDeviceImage.do`,
          method: 'POST',
          body: { ...(deviceTypeId && { deviceKind: deviceTypeId }), page },
        })) as QueryResponse<ResRackLayoutDeviceImagesByDeviceType>;

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
        const validated =
          resRackLayoutDeviceImagesByDeviceTypeSchema.safeParse(response);

        if (!validated.success) {
          return {
            error: {
              status: 422,
              data: validated.error.issues,
            },
          };
        }

        return {
          data: validated.data,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateRackLayoutMapMutation,
  useDeleteRackLayoutMapMutation,
  useUpdateRackLayoutMapNameMutation,
  useUpdateRackLayoutMapContentMutation,
  useGetRackLayoutMapListQuery,
  useLazyGetRackLayoutMapListQuery,
  useGetRackLayoutMapContentQuery,
  useLazyGetRackLayoutMapContentQuery,
  useGetRackLayoutDevicesByDeviceTypeQuery,
  useLazyGetRackLayoutDevicesByDeviceTypeQuery,
  useGetRackLayoutDeviceImagesByDeviceTypeQuery,
  useLazyGetRackLayoutDeviceImagesByDeviceTypeQuery,
} = rackLayoutApi;
