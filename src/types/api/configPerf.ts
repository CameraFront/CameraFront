import { z } from 'zod';
import {
  configPerfSearchParamsSchema,
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

export type ConfigPerfSearchParams = z.infer<
  typeof configPerfSearchParamsSchema
>;

export type ResConfigDevicesByFilter = z.infer<
  typeof resConfigDevicesByFilterSchema
>;

export type ReqDeviceByFilter = Omit<ConfigPerfSearchParams, 'expandedKeys'> & {
  selectedBranch: number | undefined;
};

export type ResConfigDeviceDetails = z.infer<
  typeof resConfigDeviceDetailsSchema
>;

export type ResPortList = z.infer<typeof resPortListSchema>;

export type ResPerfDevicesByFilter = z.infer<
  typeof resPerfDevicesByFilterSchema
>;

export type ResCpuPerfInfoByDevice = z.infer<
  typeof resCpuPerfInfoByDeviceSchema
>;

export type ResCpuPerfGraphInfoByDevice = z.infer<
  typeof resCpuPerfGraphInfoByDeviceSchema
>;

export type ResMemoryPerfInfoByDevice = z.infer<
  typeof resMemoryPerfInfoByDeviceSchema
>;

export type ResMemoryPerfChartInfoByDevice = z.infer<
  typeof resMemoryPerfChartInfoByDeviceSchema
>;

export type ResDiskPerfInfoByDevice = z.infer<
  typeof resDiskPerfInfoByDeviceSchema
>;

export type ResPortPerfInfoByDevice = z.infer<
  typeof resPortPerfInfoByDeviceSchema
>;

export type ResProcessesByFilter = z.infer<typeof resProcessesByFilterSchema>;

export type ResProcessDetails = z.infer<typeof resProcessDetailsSchema>;
