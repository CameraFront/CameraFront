import { AppRootState } from '@/app/store';
import {
  resConfigDeviceDetailsSchema,
  resConfigDevicesByFilterSchema,
  resCpuPerfGraphInfoByDeviceSchema,
  resCpuPerfInfoByDeviceSchema,
  resDiskPerfInfoByDeviceSchema,
  resMemoryPerfChartInfoByDeviceSchema,
  resMemoryPerfInfoByDeviceSchema,
  resPerfDevicesByFilterSchema,
  resPortListSchema,
  resPortPerfInfoByDeviceSchema,
  resProcessDetailsSchema,
  resProcessesByFilterSchema,
} from '@/services/validation/configPerf';
import {
  ReqDeviceByFilter,
  ResConfigDeviceDetails,
  ResConfigDevicesByFilter,
  ResCpuPerfGraphInfoByDevice,
  ResCpuPerfInfoByDevice,
  ResDiskPerfInfoByDevice,
  ResMemoryPerfChartInfoByDevice,
  ResMemoryPerfInfoByDevice,
  ResPerfDevicesByFilter,
  ResPortList,
  ResPortPerfInfoByDevice,
  ResProcessDetails,
  ResProcessesByFilter,
} from '@/types/api/configPerf';
import { QueryResponse } from '@/types/common';
import { ResManageYn } from '@/types/enum';
import { QUERY_TAG_IDS } from '@/config';
import { DEVICE_PATH } from './apiPaths';
import { baseApi } from './baseApi';

export const configPerfApi = baseApi.injectEndpoints({
  endpoints: build => ({
    updatePortManagedStatus: build.mutation<
      null,
      { deviceId: number; portId: number; isManaged: ResManageYn }
    >({
      invalidatesTags: (result, error, { deviceId }) => [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.PortList,
        },
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: `${QUERY_TAG_IDS.ConfigPerf.PortList}${deviceId}`,
        },
      ],
      queryFn: async (
        { deviceId, portId, isManaged },
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
          url: `${DEVICE_PATH}/updatePortMngYn.do`,
          method: 'POST',
          body: {
            deviceKey: deviceId,
            portKey: portId,
            manageYn: isManaged,
          },
        })) as QueryResponse<void>;

        if (res.error) return res;

        return { data: null };
      },
    }),
    getConfigDevicesByFilter: build.query<
      ResConfigDevicesByFilter,
      ReqDeviceByFilter
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.DevicesByFilter,
        },
      ],
      queryFn: async (
        { selectedBranch, deviceType, search, page = 1, sort = 'DESC' },
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
          url: `${DEVICE_PATH}/listDevice.do`,
          method: 'POST',
          body: {
            ...(selectedBranch && { managementCdTree: selectedBranch }),
            ...(deviceType && { deviceKind: deviceType }),
            ...(search && { search }),
            ...(page && { page }),
            ...(sort && { sort }),
          },
        })) as QueryResponse<ResConfigDevicesByFilter>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resConfigDevicesByFilterSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getConfigDeviceDetails: build.query<ResConfigDeviceDetails, number>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.DeviceDetails,
        },
      ],
      queryFn: async (deviceKey, { getState }, _extraOptions, baseQuery) => {
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
          url: `${DEVICE_PATH}/getDeviceDetail.do`,
          method: 'POST',
          body: {
            deviceKey,
          },
        })) as QueryResponse<ResConfigDeviceDetails>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resConfigDeviceDetailsSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getPortList: build.query<
      ResPortList,
      { deviceId: number; page?: number; pageSize?: number }
    >({
      providesTags: (result, error, { deviceId }) => [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.PortList,
        },
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: `${QUERY_TAG_IDS.ConfigPerf.PortList}${deviceId}`,
        },
      ],
      queryFn: async (
        { deviceId, page = 1, pageSize = 5 },
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
          url: `${DEVICE_PATH}/listPort.do`,
          method: 'POST',
          body: {
            deviceKey: deviceId,
            page,
            ...(pageSize && { rows: pageSize }),
          },
        })) as QueryResponse<ResPortList>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resPortListSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getPerfDevicesByFilter: build.query<
      ResPerfDevicesByFilter,
      ReqDeviceByFilter
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.DevicesByFilter,
        },
      ],
      queryFn: async (
        { selectedBranch, deviceType, search, page = 1, sort = 'DESC' },
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
          url: `${DEVICE_PATH}/listDevicePerformance.do`,
          method: 'POST',
          body: {
            ...(selectedBranch && { managementCdTree: selectedBranch }),
            ...(deviceType && { deviceKind: deviceType }),
            ...(search && { search }),
            ...(page && { page }),
            ...(sort && { sort }),
          },
        })) as QueryResponse<ResConfigDevicesByFilter>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resPerfDevicesByFilterSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getCpuPerfInfoByDevice: build.query<
      ResCpuPerfInfoByDevice,
      {
        deviceId: number;
        fromDate?: string;
        toDate?: string;
        page?: number;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.CpuPerfInfoByDevice,
        },
      ],
      queryFn: async (
        { deviceId, fromDate, toDate, page = 1 },
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
          url: `${DEVICE_PATH}/listCpuPerformance.do`,
          method: 'POST',
          body: {
            deviceKey: deviceId,
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
            ...(page && { page }),
          },
        })) as QueryResponse<ResCpuPerfInfoByDevice>;

        if (res.error) return res;

        const { response } = res.data;
        const parsed = resCpuPerfInfoByDeviceSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getCpuPerfGraphInfoByDevice: build.query<
      ResCpuPerfGraphInfoByDevice,
      {
        deviceId: number;
        fromDate?: string;
        toDate?: string;
        page?: number;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.CpuPerfInfoByDevice,
        },
      ],
      queryFn: async (
        { deviceId, fromDate, toDate, page = 1 },
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
          url: `${DEVICE_PATH}/listDeviceCpuPerformanceTopN.do`,
          method: 'POST',
          body: {
            deviceKey: deviceId,
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
            ...(page && { page }),
          },
        })) as QueryResponse<ResCpuPerfGraphInfoByDevice>;

        if (res.error) return res;

        const { response } = res.data;
        const parsed = resCpuPerfGraphInfoByDeviceSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getMemoryPerfInfoByDevice: build.query<
      ResMemoryPerfInfoByDevice,
      {
        deviceId: number;
        fromDate?: string;
        toDate?: string;
        page?: number;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.MemoryPerfInfoByDevice,
        },
      ],
      queryFn: async (
        { deviceId, fromDate, toDate, page = 1 },
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
          url: `${DEVICE_PATH}/listMemoryPerformance.do`,
          method: 'POST',
          body: {
            deviceKey: deviceId,
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
            ...(page && { page }),
          },
        })) as QueryResponse<ResMemoryPerfInfoByDevice>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resMemoryPerfInfoByDeviceSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getMemoryPerfChartInfoByDevice: build.query<
      ResMemoryPerfChartInfoByDevice,
      {
        deviceId: number;
        fromDate?: string;
        toDate?: string;
        page?: number;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.MemoryPerfInfoByDevice,
        },
      ],
      queryFn: async (
        { deviceId, fromDate, toDate, page = 1 },
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
          url: `${DEVICE_PATH}/listDeviceMemPerformanceTopN.do`,
          method: 'POST',
          body: {
            deviceKey: deviceId,
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
            ...(page && { page }),
          },
        })) as QueryResponse<ResMemoryPerfChartInfoByDevice>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resMemoryPerfChartInfoByDeviceSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getDiskPerfInfoByDevice: build.query<
      ResDiskPerfInfoByDevice,
      {
        deviceId: number;
        fromDate?: string;
        toDate?: string;
        page?: number;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.DiskPerfInfoByDevice,
        },
      ],
      queryFn: async (
        { deviceId, fromDate, toDate, page = 1 },
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
          url: `${DEVICE_PATH}/listFsPerformance.do`,
          method: 'POST',
          body: {
            deviceKey: deviceId,
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
            ...(page && { page }),
          },
        })) as QueryResponse<ResDiskPerfInfoByDevice>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resDiskPerfInfoByDeviceSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getPortPerfInfoByDevice: build.query<
      ResPortPerfInfoByDevice,
      {
        deviceId: number;
        fromDate?: string;
        toDate?: string;
        page?: number;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.PortPerfInfoByDevice,
        },
      ],
      queryFn: async (
        { deviceId, fromDate, toDate, page = 1 },
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
          url: `${DEVICE_PATH}/listNetworkPerformance.do`,
          method: 'POST',
          body: {
            deviceKey: deviceId,
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
            ...(page && { page }),
          },
        })) as QueryResponse<ResPortPerfInfoByDevice>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resPortPerfInfoByDeviceSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getProcessesByFilter: build.query<ResProcessesByFilter, ReqDeviceByFilter>({
      providesTags: [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.ProcessesByFilter,
        },
      ],
      queryFn: async (
        { selectedBranch, search, deviceType, page = 1, sort = 'DESC' },
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
          url: `${DEVICE_PATH}/listProcessCollect.do`,
          method: 'POST',
          body: {
            ...(selectedBranch && { managementCdTree: selectedBranch }),
            ...(deviceType && { deviceKind: deviceType }),
            ...(search && { search }),
            ...(page && { page }),
          },
        })) as QueryResponse<ResProcessesByFilter>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resProcessesByFilterSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
    getProcessDetails: build.query<
      ResProcessDetails,
      {
        deviceKey: number;
        page?: number;
      }
    >({
      providesTags: [
        {
          type: QUERY_TAG_IDS.ConfigPerf.Type,
          id: QUERY_TAG_IDS.ConfigPerf.ProcessDetails,
        },
      ],
      queryFn: async (
        { deviceKey, page = 1 },
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
          url: `${DEVICE_PATH}/listProcessWithStat.do`,
          method: 'POST',
          body: {
            deviceKey,
            ...(page && { page }),
          },
        })) as QueryResponse<ResProcessDetails>;

        if (res.error) return res;

        const { response } = res.data;

        const parsed = resProcessDetailsSchema.safeParse(response);

        if (!parsed.success) {
          return {
            error: {
              status: 422,
              data: parsed.error.issues,
            },
          };
        }

        return { data: parsed.data };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdatePortManagedStatusMutation,
  useGetConfigDevicesByFilterQuery,
  useLazyGetConfigDevicesByFilterQuery,
  useGetConfigDeviceDetailsQuery,
  useLazyGetConfigDeviceDetailsQuery,
  useGetPortListQuery,
  useLazyGetPortListQuery,
  useGetPerfDevicesByFilterQuery,
  useLazyGetPerfDevicesByFilterQuery,
  useGetCpuPerfInfoByDeviceQuery,
  useLazyGetCpuPerfInfoByDeviceQuery,
  useGetCpuPerfGraphInfoByDeviceQuery,
  useGetMemoryPerfInfoByDeviceQuery,
  useLazyGetMemoryPerfInfoByDeviceQuery,
  useGetMemoryPerfChartInfoByDeviceQuery,
  useGetDiskPerfInfoByDeviceQuery,
  useLazyGetDiskPerfInfoByDeviceQuery,
  useGetPortPerfInfoByDeviceQuery,
  useLazyGetPortPerfInfoByDeviceQuery,
  useGetProcessesByFilterQuery,
  useLazyGetProcessesByFilterQuery,
  useGetProcessDetailsQuery,
} = configPerfApi;
