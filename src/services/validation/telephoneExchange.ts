import { z } from 'zod';
import { resPaginationSchema, stringDateSchema } from './common';
import { configPerfSearchParamsSchema } from './configPerf';

export const telephoneExchangeSearchParamsSchema =
  configPerfSearchParamsSchema.pick({
    page: true,
  });

export const resUnregisteredPhonesByFilterSchema = z.object({
  listPhoneUnReg: z.array(
    z.object({
      NO: z.number(),
      phoneLocation: z.string(),
      phoneKey: z.number(),
      // managementCd: z.number(),
      managementNm: z.string(),
      // phoneNm: z.string(),
      phoneTypeNm: z.string(),
      phoneType: z.number().nullable(),
      phoneStatus: z.string(),
      // externalNum: z.string(),
      internalNum: z.string(),
      ipAddr: z.string().nullable(),
      macAddr: z.string().nullable(),
      manageYn: z.number(),
      manageYnNm: z.string(),
      collectDateTime: stringDateSchema,
    }),
  ),
  page: resPaginationSchema,
});

export const resUnregisteredPhonesByFilterScanSchema = z.object({
  listPhoneUnReg: z.array(
    z.object({
      no: z.number(),
      phoneKey: z.number(),
      internalNum: z.string(),
      phoneType: z.string().nullable(),      
      phoneDepth1: z.string(),
      phoneDepth2: z.string(),
      manageYn: z.number(),
      manageYnNm: z.string(),
      collectDateTime: stringDateSchema,
    }),
  ),
  page: resPaginationSchema,
});

export const resUnregisteredPhoneDetailsSchema = z.object({
  phoneKey: z.number(),
  phoneNm: z.string(),
  managementCd: z.number(),
  managementNm: z.string(),
  parentKey: z.number().nullable(),
  macAddr: z.string(),
  ipAddr: z.string(),
  internalNum: z.string(),
  externalNum: z.string(),
  phoneType: z.number(),
  phoneTypeNm: z.string(),
  phoneClass: z.string().nullable(),
  chgStatus: z.number(),
  pingStatus: z.number(),
  phoneLocation: z.string(),
  manageYn: z.number(),
  phoneStatus: z.string(),
  regDt: stringDateSchema,
  updateDt: stringDateSchema.nullable(),
});

export const resPhoneStatisticsByFilterSchema = z.object({
  listPhoneRegStat: z.array(
    z.object({
      NO: z.number(),
      managementCd: z.number(),
      managementNm: z.string(),
      unRegCnt: z.number(),
      collectDateTime: stringDateSchema,
      totalPhones: z.number(),
    }),
  ),
  page: resPaginationSchema,
});

export const resCurrentCallTrendSchema = z.object({
  liveCallTrend: z.array(
    z.object({
      seqNum: z.number(), // 수집데이터 키
      total: z.number(), //  전체 통화 중 개수
      sip: z.number(), //  전체 SIP 통화 중 개수
      regSendOut: z.number(), //  국선발신(사업자) 통화 중 개수
      regSendIn: z.number(), //  국선착신(사업자) 통화 중 개수
      regRecvOut: z.number(), //  국선발신(GW연결) 통화 중 개수
      regRecvIn: z.number(), //  국선착신(GW연결) 통화 중 개수
      regOptOut: z.number(), //  국선발신(기타) 통화 중 개수
      regOptIn: z.number(), //  국선착신(기타) 통화 중 개수
      collectDateTime: stringDateSchema, //  수집일시
    }),
  ),
});

export const resCallPeakTrendSchema = z.object({
  callPeakTrend: z.array(
    z.object({
      seqNum: z.number(), // 수집데이터 키
      total: z.number(), // 전체 통화 피크
      outbound: z.number(), // 아웃바운드 피크
      inbound: z.number(), // 인바운드 피크
      tandem: z.number(), // 중계통화 피크
      internal: z.number(), // 내선통화 피크
      collectDateTime: stringDateSchema, // 수집일시
    }),
  ),
});

export const resPhoneCountSchema = z.object({
  phoneCount: z.number(),
});
