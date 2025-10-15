import { AppRootState } from '@/app/store';
import {
  resDevicesByTypeSchema,
  resTopologyMapContentSchema,
  resTopologyTreeMapListSchema,
} from '@/services/validation/topology';
import {
  ReqUpdateTopologyMap,
  ResDevicesByType,
  ResTopologyMapContent,
  ResTopologyMapList,
} from '@/types/api/topology';
import { QueryResponse } from '@/types/common';
import { QUERY_TAG_IDS } from '@/config';
import { TOPOLOGY_EDIT_PATH, TOPOLOGY_PATH } from './apiPaths';
import { baseApi } from './baseApi';

export const topologyApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getTopologyMapList: build.query<ResTopologyMapList, void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Topology.Type,
          id: QUERY_TAG_IDS.Topology.TopologyMapList,
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
          url: `${TOPOLOGY_PATH}/listTopologyMap.do`,
          method: 'POST',
          body: {},
        })) as QueryResponse<ResTopologyMapList>;

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
        const validated = resTopologyTreeMapListSchema.safeParse(response);

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
    getTopologyMapContent: build.query<
      ResTopologyMapContent,
      number | undefined
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Topology.Type,
          id: QUERY_TAG_IDS.Topology.TopologyMapContent,
        },
      ],
      queryFn: async (key, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;

        if (!key)
          return {
            error: {
              status: 400,
              data: '토폴로지맵 키가 필요합니다.',
            },
          };

        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const res = (await baseQuery({
          url: `${TOPOLOGY_PATH}/getTopologyMap.do`,
          method: 'POST',
          body: { key },
        })) as QueryResponse<ResTopologyMapContent>;

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

        if (!response.dataNode || !response.edgeNode) {
          return {
            data: {
              ...response,
              dataNode: [],
              edgeNode: [],
            },
          };
        }

        const validated = resTopologyMapContentSchema.safeParse(response);

        if (!validated.success) {
          return {
            error: {
              status: 422,
              data: validated.error.issues,
            },
          };
        }

        const { hasStream } = state.topology.canvasOptions;

        return {
          data: {
            ...validated.data,
            edgeNode:
              validated.data.edgeNode &&
              validated.data.edgeNode.map(edge => ({
                ...edge,
                animated: hasStream,
              })),
          },
        };
      },
    }),
    // *** 토폴로지 에디터 ***
    // 토폴로지맵 이름 또는 내용 수정
    updateTopologyMap: build.mutation<null, ReqUpdateTopologyMap>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.Topology.Type,
          id: QUERY_TAG_IDS.Topology.TopologyMapContent,
        },
        {
          type: QUERY_TAG_IDS.Topology.Type,
          id: QUERY_TAG_IDS.Topology.TopologyMapList,
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

        const body =
          'topologyName' in params
            ? { key: params.key, topologyNm: params.topologyName }
            : { key: params.key, ...params.content };

        const res = await baseQuery({
          url: `${TOPOLOGY_EDIT_PATH}/updateTopologyMap.do`,
          method: 'POST',
          body,
        });

        if (res.error) return res;

        return {
          data: null,
        };
      },
    }),
    // 장비종류에 따른 장비목록 조회
    getDevicesByType: build.query<ResDevicesByType, number>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Topology.Type,
          id: QUERY_TAG_IDS.Topology.DeviceListByType,
        },
      ],
      queryFn: async (deviceType, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;

        if (!user)
          return {
            error: {
              status: 401,
            },
          };

        const res = (await baseQuery({
          url: `${TOPOLOGY_EDIT_PATH}/listDevice.do`,
          method: 'POST',
          body: { deviceKind: deviceType },
        })) as QueryResponse<ResDevicesByType>;

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
        const validated = resDevicesByTypeSchema.safeParse(response);

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
  useGetTopologyMapListQuery,
  useLazyGetTopologyMapListQuery,
  useGetTopologyMapContentQuery,
  useLazyGetTopologyMapContentQuery,
  useGetDevicesByTypeQuery,
  useLazyGetDevicesByTypeQuery,
  useUpdateTopologyMapMutation,
} = topologyApi;
