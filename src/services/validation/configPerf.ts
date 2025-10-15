import { z } from 'zod';
import { PerfDataInterval, ResManageYn } from '@/types/enum';
import {
  resPaginationSchema,
  stringDateSchema,
  yearMonthDateSchema,
} from './common';

export const configPerfSearchParamsSchema = z.object({
  search: z.coerce.string().optional().catch(''),
  deviceType: z.coerce.number().optional().catch(undefined),
  page: z.coerce.number().optional().default(1).catch(1),
  sort: z.enum(['ASC', 'DESC']).optional().default('DESC').catch('DESC'),
  fromDate: yearMonthDateSchema.optional().catch(undefined),
  toDate: yearMonthDateSchema.optional().catch(undefined),
  contentType: z
    .enum(['cpu', 'memory', 'disk', 'port'])
    .optional()
    .catch('cpu'),
});

export const resConfigDevicesByFilterSchema = z.object({
  deviceList: z.array(
    z.object({
      device1Depth: z.number(),
      device2Depth: z.number(),
      deviceIp: z.string(),
      deviceKey: z.number(),
      deviceKindNm: z.string(),
      deviceKindNm2: z.string().nullable(),
      deviceNm: z.string(),
      installCompany: z
        .string()
        .nullable()
        .transform(v => v || ''),
      installDate: z
        .string()
        .nullable()
        .transform(v => v || ''),
      manageYn: z.nativeEnum(ResManageYn),
      manageYnNm: z.string(),
      managementCd: z.number(),
      managementNm: z.string(),
      managerANm: z
        .string()
        .nullable()
        .transform(v => v || ''),
      managerBNm: z
        .string()
        .nullable()
        .transform(v => v || ''),
      modelNm: z
        .string()
        .nullable()
        .transform(v => v || ''),
      no: z.number(),
      os: z.string(),
      productCompany: z
        .string()
        .nullable()
        .transform(v => v || ''),
      pstnNm: z
        .string()
        .nullable()
        .transform(v => v || ''),
    }),
  ),
  page: resPaginationSchema,
});

export const resConfigDeviceDetailsSchema = z.object({
  deviceKey: z.number(),
  managementNm: z.string(),
  deviceKind: z.number(),
  deviceKindNm: z.string(),
  deviceKindSub: z.number(),
  deviceNm: z.string(),
  deviceIp: z.string(),
  pstnNm: z
    .string()
    .nullable()
    .transform(v => v || ''),
  manageYn: z.nativeEnum(ResManageYn),
  manageYnNm: z.string(),
  installCompany: z
    .string()
    .nullable()
    .transform(v => v || ''),
  productCompany: z
    .string()
    .nullable()
    .transform(v => v || ''),
  installDate: z
    .string()
    .nullable()
    .transform(v => v || ''),
  modelNm: z
    .string()
    .nullable()
    .transform(v => v || ''),
  managerANm: z
    .string()
    .nullable()
    .transform(v => v || ''),
  managerBNm: z
    .string()
    .nullable()
    .transform(v => v || ''),
  departmentA: z
    .string()
    .nullable()
    .transform(v => v || ''),
  departmentB: z
    .string()
    .nullable()
    .transform(v => v || ''),
  phoneA: z
    .string()
    .nullable()
    .transform(v => v || ''),
  phoneB: z
    .string()
    .nullable()
    .transform(v => v || ''),
  emailA: z
    .string()
    .nullable()
    .transform(v => v || ''),
  emailB: z
    .string()
    .nullable()
    .transform(v => v || ''),
  regDate: z.string(),
  sysUptime: z.string().nullable(),
  os: z.string().optional().catch(''),
  cpuUtil: z.string().optional().catch(''),
  memUtil: z.string().optional().catch(''),
  fsNm: z.string().optional().catch(''),
  usageUtil: z.string().optional().catch(''),
});

export const resPerfDevicesByFilterSchema = z.object({
  devicePerformanceList: z.array(
    z.object({
      no: z.number(),
      managementNm: z.string(),
      managementCd: z.number(),
      os: z.string(),
      deviceKindNm: z.string(),
      deviceKindNm2: z.string().nullable(),
      deviceKey: z.number(),
      deviceNm: z.string(),
      deviceIp: z.string(),
      manageYnNm: z.string(),
      cpuUtil: z.string(),
      memUtil: z.string(),
      // fsNm: z.string(),
      // usageUtil: z.string(),
      // inBpsPortNum: z.string(),
      // inBps: z.string(),
      // outBpsPortNum: z.string(),
      // outBps: z.string(),
    }),
  ),
  page: resPaginationSchema,
});

export const resProcessesByFilterSchema = z.object({
  listProcess: z.array(
    z.object({
      no: z.number(),
      seqNum: z.number(),
      deviceKey: z.number(),
      deviceNm: z.string(),
      procNm: z.string(),
      procPath: z.string(),
      procParam: z.string().nullable(),
      procStat: z.number(),
      manageYn: z.nativeEnum(ResManageYn),
      regDt: stringDateSchema,
    }),
  ),
  page: resPaginationSchema,
});

export const resProcessDetailsSchema = z.object({
  listProcess: z.array(
    z.object({
      no: z.number(),
      seqNum: z.number(),
      deviceKey: z.number(),
      deviceNm: z.string(),
      procNm: z.string(),
      procPath: z.string(),
      procParam: z.string().nullable(),
      manageYn: z.nativeEnum(ResManageYn),
      regDt: stringDateSchema,
      procStat: z.number().nullable(),
      chkDt: stringDateSchema.nullable(),
    }),
  ),
  page: resPaginationSchema,
});

export const resPortListSchema = z.object({
  portList: z.array(
    z.object({
      no: z.number(),
      deviceKey: z.number(),
      portKey: z.number(),
      deviceNm: z.string(),
      deviceIp: z.string(),
      manageYn: z.nativeEnum(ResManageYn),
      fault: z.string(),
    }),
  ),
  page: resPaginationSchema,
});

export const resCpuPerfInfoByDeviceSchema = z.object({
  deviceNm: z.string(),
  interval: z.nativeEnum(PerfDataInterval),
  cpuPerformanceList: z.array(
    z.object({
      no: z.number(),
      skey: z.number(),
      date: stringDateSchema,
      cpuUtil: z.number(),
      cpuStatus: z.string(),
    }),
  ),
  page: resPaginationSchema,
});

export const resCpuPerfGraphInfoByDeviceSchema = z.array(
  z.object({
    date: stringDateSchema,
    cpuUtil: z.number(),
    cpuStatus: z.string(),
  }),   
);

export const resMemoryPerfInfoByDeviceSchema = z.object({
  deviceNm: z.string(),
  interval: z.nativeEnum(PerfDataInterval),
  memPerformanceList: z.array(
    z.object({
      no: z.number(),
      skey: z.number(),
      date: stringDateSchema,
      totalMem: z.number(), // 단위 kB
      avgUseMem: z.number(), // 단위 kB
      memUtil: z.number(),
      memStatus: z.string(),
    }),
  ),
  page: resPaginationSchema,
});

export const resMemoryPerfChartInfoByDeviceSchema = z.array(
  z.object({
    date: stringDateSchema,
    totalMem: z.number(), // 단위 kB
    avgUseMem: z.number(), // 단위 kB
    memUtil: z.number(),
    memStatus: z.string(),
  }),   
);

export const resDiskPerfInfoByDeviceSchema = z.object({
  deviceNm: z.string(),
  interval: z.nativeEnum(PerfDataInterval),
  fsPerformanceList: z.array(
    z.object({
      no: z.number(),
      skey: z.string(),
      //fsNm: z.string(),
      date: stringDateSchema,
      totalSize: z.number(), // 단위 kB
      avgUseSize: z.number(), // 단위 kB
      usageUtil: z.number(),
      fsStatus: z.string(),
    }),
  ),
  page: resPaginationSchema,
});

export const resPortPerfInfoByDeviceSchema = z.object({
  deviceNm: z.string(),
  interval: z.nativeEnum(PerfDataInterval),
  networkPerformanceList: z.array(
    z.object({
      no: z.number(),
      skey: z.number(),
      date: stringDateSchema,
      speed: z.string(),
      inBps: z.number(),
      outBps: z.number(),
      inbnd: z.number(),
      outbnd: z.number(),
      networkStatus: z.string(),
    }),
  ),
  page: resPaginationSchema,
});
