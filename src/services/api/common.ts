import { isAxiosError } from 'axios';
import { AppRootState } from '@/app/store';
import {
  resCheckPwdSchema,
  resDeviceTypeDepthListSchema,
  resDeviceTypeListSchema,
  resDeviceTypesByDepthsSchema,
  resLatestTemperatureDataSchema,
  resParentBranchListSchema,
} from '@/services/validation/common';
import {
  ResCheckPwd,
  ResDeviceTypeDepthList,
  ResDeviceTypeList,
  ResDeviceTypesByDepths,
  ResLatestTemperatureData,
  ResParentBranchList,
} from '@/types/api/common';
import { ResDeviceTypesByDepth } from '@/types/api/settings';
import { QueryResponse } from '@/types/common';
import customFetch from '@/utils/axios';
import { QUERY_TAG_IDS } from '@/config';
import { resDeviceTypesByDepthSchema } from '../validation/settings';
import { DEVICE_PATH, SETTINGS_PATH } from './apiPaths';
import { baseApi } from './baseApi';

export const commonApi = baseApi.injectEndpoints({
  endpoints: build => ({
    downloadExcel: build.mutation<null, { urlPath: string; filename: string; body?: Record<string, any> }>({
      queryFn: async ({ urlPath, filename, body }, { getState }) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              data: '로그인이 필요합니다.',
            },
          };

        try {
          const res = await customFetch.post<Blob>(
            urlPath,
            body || {},
            { responseType: 'blob' },
          );

          const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();

          window.URL.revokeObjectURL(downloadUrl);
          link.parentNode?.removeChild(link);

          return {
            data: null,
          };
        } catch (error) {
          return {
            error: { status: 500, data: '다운로드 중 오류가 발생했습니다.' },
          };
        }
      },
    }),
    uploadExcel: build.mutation<null, { urlPath: string; formData: FormData }>({
      queryFn: async ({ urlPath, formData }, { getState }) => {
        const state = getState() as AppRootState;
        const { user } = state.global;
        if (!user)
          return {
            error: {
              status: 401,
              message: '로그인이 필요합니다.',
            },
          };

        try {
          await customFetch.post(urlPath, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          return {
            data: null,
          };
        } catch (error) {
          if (isAxiosError(error) && error.response?.data?.status === '6013') {
            return {
              error: {
                status: 400,
                data: error.response?.data,
                message: '기존 데이터와 중복된 데이터가 존재합니다.',
              },
            };
          }

          return {
            error: {
              status: 500,
              message: '파일 업로드 중 오류가 발생했습니다.',
            },
          };
        }
      },
    }),
    getParentBranchList: build.query<
      ResParentBranchList,
      {
        depth?: number;
        managementCdTree?: number;
      } | void
    >({
      providesTags: (_, __, params) => [
        {
          type: QUERY_TAG_IDS.Common.Type,
          id: QUERY_TAG_IDS.Common.ParentBranchList,
        },
        {
          type: QUERY_TAG_IDS.Common.Type,
          id: QUERY_TAG_IDS.Common.ParentBranchList + JSON.stringify(params),
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
          url: `${SETTINGS_PATH}/listManagement.do`,
          method: 'POST',
          body: {
            ...(params && {
              ...(params.depth && { depth: params.depth }),
              ...(params.managementCdTree && {
                managementCdTree: params.managementCdTree,
              }),
            }),
          },
        })) as QueryResponse<ResParentBranchList>;

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
        const validated = resParentBranchListSchema.safeParse(response);
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
    getDeviceTypeDepthList: build.query<ResDeviceTypeDepthList, number | void>({
      providesTags: (result, error, deviceType) => [
        {
          type: QUERY_TAG_IDS.Common.Type,
          id: QUERY_TAG_IDS.Common.DeviceTypeDepthList + deviceType,
        },
      ],
      // deviceType: 장비종류옵션 (0: 전체장비종류 1: 성능장비종류)
      queryFn: async (deviceType, { getState }, _extraOptions, baseQuery) => {
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
          url: `${SETTINGS_PATH}/listDeviceKind.do`,
          method: 'POST',
          body: {
            ...(deviceType && { reqOption: deviceType }),
          },
        })) as QueryResponse<ResDeviceTypeDepthList>;

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
        const validated = resDeviceTypeDepthListSchema.safeParse(response);

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
    getDeviceTypeList: build.query<ResDeviceTypeList, boolean | void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Common.Type,
          id: QUERY_TAG_IDS.Common.DeviceTypeList,
        },
      ],
      queryFn: async (
        // eslint-disable-next-line @typescript-eslint/default-param-last
        isPerf = false,
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
          url: `${DEVICE_PATH}/listDeviceKind.do`,
          method: 'POST',
          body: {
            // 1 : 성능장비종류  null, else 전체장비종류
            ...(isPerf && { reqOption: 1 }),
          },
        })) as QueryResponse<ResDeviceTypeList>;

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
        const parsed = resDeviceTypeListSchema.safeParse(response);

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
    getDeviceTypesByDepths: build.query<ResDeviceTypesByDepths, number | void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Common.Type,
          id: QUERY_TAG_IDS.Common.DeviceTypesByDepths,
        },
      ],
      // deviceType: 장비종류옵션 (0: 전체장비종류 1: 성능장비종류)
      queryFn: async (deviceType, { getState }, _extraOptions, baseQuery) => {
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
          url: `${DEVICE_PATH}/listDeviceKindByDepth.do`,
          method: 'POST',
          body: {
            ...(deviceType && { reqOption: deviceType }),
          },
        })) as QueryResponse<ResDeviceTypesByDepths>;

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
        const parsed = resDeviceTypesByDepthsSchema.safeParse(response);

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
    getDeviceTypesByDepth: build.query<
      ResDeviceTypesByDepth,
      { depth: number; deviceType?: number }
    >({
      providesTags: (result, error, { depth, deviceType }) => [
        {
          type: QUERY_TAG_IDS.Settings.Type,
          id: QUERY_TAG_IDS.Settings.DeviceTypesByDepth + depth + deviceType,
        },
      ],
      queryFn: async (
        { depth, deviceType },
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
          url: `${SETTINGS_PATH}/listDeviceDepth.do`,
          method: 'POST',
          body: { depth1: depth, deviceKind: deviceType },
        })) as QueryResponse<ResDeviceTypesByDepth>;

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
        const validated = resDeviceTypesByDepthSchema.safeParse(response);

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
    getLatestTemperatureData: build.query<ResLatestTemperatureData, void>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Common.Type,
          id: QUERY_TAG_IDS.Common.LatestTemperatureData,
        },
      ],
      queryFn: async (_args, { getState }, _extraOptions, baseQuery) => {
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
          url: `${DEVICE_PATH}/getLatestTemperatureData.do`,
          method: 'POST',
          body: {},
        })) as QueryResponse<ResLatestTemperatureData>;

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
        const parsed = resLatestTemperatureDataSchema.safeParse(response);

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
    checkPwd: build.query<ResCheckPwd, { pwd: string; }>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.Common.Type,
          id: QUERY_TAG_IDS.Common.LatestTemperatureData,
        },
      ],
      queryFn: async ({ pwd }, { getState }, _extraOptions, baseQuery) => {
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
          url: `checkPwd.do`,
          method: 'POST',
          body: { checkPwd: pwd },
        })) as QueryResponse<ResCheckPwd>;

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
        console.log(pwd, res.data);
        const parsed = resCheckPwdSchema.safeParse(response);

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
  }),
  overrideExisting: false,
});

export const {
  useDownloadExcelMutation,
  useUploadExcelMutation,
  useGetParentBranchListQuery,
  useLazyGetParentBranchListQuery,
  useGetDeviceTypeDepthListQuery,
  useGetDeviceTypeListQuery,
  useGetDeviceTypesByDepthQuery,
  useLazyGetDeviceTypesByDepthQuery,
  useGetDeviceTypesByDepthsQuery,
  useGetLatestTemperatureDataQuery,
  useCheckPwdQuery,
} = commonApi;
