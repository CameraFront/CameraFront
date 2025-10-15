import { AppRootState } from '@/app/store';
import { saveNodes } from '@/features/railwayMapPage/railwayMapSlice';
import { ReqUpdateMapViewMap, ResMapViewContent } from '@/types/api/mapView';
import { QueryResponse } from '@/types/common';
import { DEFAULT_MAP_VIEW_KEY } from '@/config/constants';
import { QUERY_TAG_IDS } from '@/config';
import { MAP_VIEW_EDIT_PATH, MAP_VIEW_PATH } from './apiPaths';
import { baseApi } from './baseApi';

export const mapViewApi = baseApi.injectEndpoints({
  endpoints: build => ({
    updateMapViewMap: build.mutation<null, ReqUpdateMapViewMap>({
      invalidatesTags: [
        {
          type: QUERY_TAG_IDS.MapView.Type,
          id: QUERY_TAG_IDS.MapView.MapViewContent,
        },
      ],
      queryFn: async (args, { getState }, _extraOptions, baseQuery) => {
        const state = getState() as AppRootState;
        const { user } = state.global;

        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        const { mapId = DEFAULT_MAP_VIEW_KEY, ...rest } = args;

        const res = (await baseQuery({
          url: `${MAP_VIEW_EDIT_PATH}/updateLineMap.do`,
          method: 'POST',
          body: { key: mapId, ...rest },
        })) as QueryResponse<ResMapViewContent>;

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
    getMapViewContent: build.query<ResMapViewContent, number | void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.MapView.Type,
          id: QUERY_TAG_IDS.MapView.MapViewContent,
        },
      ],
      queryFn: async (
        // eslint-disable-next-line @typescript-eslint/default-param-last
        mapId = DEFAULT_MAP_VIEW_KEY,
        { getState, dispatch },
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
          url: `${MAP_VIEW_PATH}/getLineMap.do`,
          method: 'POST',
          body: { key: mapId },
        })) as QueryResponse<ResMapViewContent>;

        if (res.error) {
          return {
            error: {
              status: res.error.status,
              data: res.error.data,
              message: res.error.data.message,
            },
          };
        }

        if (res.data.response && res.data.response.dataNode) {
          dispatch(saveNodes(res.data.response.dataNode));
        }

        // const { response } = res.data;
        // const validated = resMapViewContentSchema.safeParse(response);

        // if (!validated.success) {
        //   return {
        //     error: {
        //       status: 422,
        //       data: validated.error.issues,
        //     },
        //   };
        // }

        return {
          data: res.data.response,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdateMapViewMapMutation,
  useGetMapViewContentQuery,
  useLazyGetMapViewContentQuery,
} = mapViewApi;
