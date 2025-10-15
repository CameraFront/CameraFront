import { z } from 'zod';
import { EventLv } from '@/types/enum';
import { resPaginationSchema, yearMonthDateSchema } from './common';
import { configPerfSearchParamsSchema } from './configPerf';

const eventTypeValues = Object.values(EventLv).filter(Number);

export const eventsSearchParamsSchema = configPerfSearchParamsSchema.extend({
  eventTypes: z
    .string()
    .optional()
    .transform(v => {
      if (!v) return eventTypeValues;
      const parsed = v.split(',').map(Number);
      return parsed.every(n => eventTypeValues.includes(n))
        ? parsed
        : eventTypeValues;
    })
    .pipe(z.array(z.nativeEnum(EventLv))),
});

export const resDailyEventCountsByDateRangeSchema = z.array(
  z.object({
    Day: z.string().date(),
    urgent: z.number(),
    important: z.number(),
    minor: z.number(),
    total: z.number(),
  }),
);

export const resTodayHourlyEventCountsSchema = z.array(
  z.object({
    Day: yearMonthDateSchema,
    Hour: z.coerce.number().int().min(0).max(23),
    urgent: z.number(),
    important: z.number(),
    minor: z.number(),
    total: z.number(),
  }),
);
export const resDeviceRankingsByEventSchema = z.array(
  z.object({
    ranking: z.number(),
    deviceKey: z.number(),
    deviceNm: z.string(),
    total: z.number().optional(),
    urgent: z.number().optional(),
    important: z.number().optional(),
    minor: z.number().optional(),
    urgimp: z.number().optional(),
    urgmin: z.number().optional(),
    impmin: z.number().optional(),
  }),
);

export const resUnresolvedEventsByFiltersSchema = z.object({
  faultList: z.array(
    z.object({
      no: z.number(), //   일련번호
      eventKey: z.number(), // 이벤트키
      managementCd: z.number(), // 분류코드
      managementNm: z.string(), // 분류명
      deviceKey: z.number(), // 장비키
      portKey: z.number(), // 포트키
      fsKey: z.string().nullable(), // 파일시스템키
      ifName: z.number().nullable(), // 인터페이스명
      gender: z.number().nullable(), // 화장실 구분
      eventCd: z.string(), // 이벤트코드
      sensorKey: z.string().nullable(), // 센서키
      cameraIp: z.string().nullable(), // 카메라IP
      ocDate: z.string(), // 발생일시
      eventMsg: z.string(), // 이벤트 메시지
      deviceKind: z.number(), // 장비 대분류코드
      deviceKindNm: z.string(), // 장비 대분류명
      deviceKindSub: z.number(), // 장비 소분류코드
      deviceKindNmSub: z.string(), // 장비 소분류명
      deviceIp: z.string(), // 장비아이피
      pstnNm: z.string().nullable(), // 위치
      deviceNm: z.string().optional(), // 장비명
      eventNm: z.string(), // 이벤트명
    }),
  ),
  page: resPaginationSchema,
});

export const resEventsByFiltersSchema = z.object({
  faultHistoryList: z.array(
    z.object({
      no: z.number(), //   일련번호
      eventKey: z.number(), // 이벤트키
      // managementCd: z.number(), // 분류코드
      managementNm: z.string(), // 분류명
      deviceKey: z.number(), // 장비키
      portKey: z.number(), // 포트키
      fsKey: z.string().nullable(), // 파일시스템키
      ifName: z.number().nullable(), // 인터페이스명
      gender: z.number().nullable(), // 화장실 구분
      eventCd: z.string(), // 이벤트코드
      // sensorKey: z.string().nullable(), // 센서키
      cameraIp: z.string().nullable(), // 카메라IP
      ocDate: z.string(), // 발생일시
      eventMsg: z.string(), // 이벤트 메시지
      deviceKind: z.number(), // 장비 대분류코드
      deviceKindNm: z.string(), // 장비 대분류명
      deviceKindSub: z.number(), // 장비 소분류코드
      deviceKindNmSub: z.string(), // 장비 소분류명
      deviceIp: z.string(), // 장비아이피
      pstnNm: z.string().nullable(), // 위치
      deviceNm: z.string().optional(), // 장비명
      eventNm: z.string(), // 이벤트명
      comment: z.string().nullable(),
      recDate: z.string(),
      sensorNum: z.number().nullable(),
    }),
  ),
  page: resPaginationSchema,
});

export const resEventCommentSchema = z.object({
  deviceNm: z.string(),
  eventMsg: z.string(),
  comment: z.string().nullable(),
});
