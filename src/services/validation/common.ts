import dayjs from 'dayjs';
import { z } from 'zod';
import { isNotNullish } from '@/utils/nullChecking';
import { EVENT_TYPES_EN } from '@/config';
import { ResIsCollected } from '@/types/enum';

export const anyObjectSchema = z.record(z.any());

export const intIdSchema = z
  .union([z.number(), z.string()])
  .pipe(z.coerce.number().int().positive())
  .transform(value => (isNotNullish(value) ? value : undefined))
  .catch(undefined);

export const dimensionSchema = z.object({
  w: z.number(),
  h: z.number(),
});

export const resPaginationSchema = z.object({
  records: z.number(),
  totalPage: z.number(),
  page: z.number(),
  rows: z.number(),
});

export const stringDateSchema = z.string().refine(
  dateString => {
    const date = new Date(dateString);
    return !Number.isNaN(date.getTime());
  },
  {
    message: 'Invalid date format',
  },
);

export const yearMonthDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: `Invalid date format, expected 'YYYY-MM-DD'`,
});

export const dateTimeSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, {
    message: `Invalid date format, expected 'YYYY-MM-DD HH:mm'`,
  });

export const dateTimeSecSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: "Invalid date format, expected 'YYYY-MM-DD HH:mm:ss'",
  });

export const genericDateSchema = z
  .string()
  .refine(date => dayjs(date).isValid(), {
    message: 'Invalid date format',
  })
  .transform(date => dayjs(date));

export const eventTypeEnSchema = z.enum(EVENT_TYPES_EN);

export const resParentBranchSchema = z.object({
  managementCd: z.number(),
  managementId: z.string(),
  managementNm: z.string(),
  path: z.string().regex(/^\/(\d+\/)*\d+$/),
  depth: z.number().positive(),
  parentNode: z.number().nullable(),
  endNode: z.enum(['Y', 'N']),
});

export const resParentBranchListSchema = z.array(resParentBranchSchema);

export const resDeviceTypeDepthListSchema = z.array(
  z.object({
    id: z.number(),
    depth1Cd: z.number(),
    depth2Cd: z.number(),
    depth1Nm: z.string(),
    depth2Nm: z.string(),
  }),
);

export const resDeviceTypeListSchema = z.array(
  z.object({
    seqNum: z.number(),
    deviceKind: z.number(),
    deviceKindNm: z.string(),
    deviceKindEnNm: z.string(),
  }),
);

export const resDeviceTypesByDepthsSchema = z.object({
  listDeviceKindDepth1: z.array(
    z.object({
      seqNum: z.number(),
      deviceKind: z.number(),
      deviceKindNm: z.string(),
    }),
  ),
  listDeviceKindDepth2: z.array(
    z.object({
      seqNum: z.number(),
      deviceKindSub: z.number(),
      deviceKindSubNm: z.string(),
      deviceKind: z.number(),
    }),
  ),
});

export const resPhoneTypeListSchema = z.object({
  listPhoneType: z.array(
    z.object({
      phoneType: z.number(),
      phoneTypeNm: z.string(),
    }),
  ),
  page: resPaginationSchema.optional(),
});

export const resDeviceDetailSchema = z.object({
  deviceIp: z.string(),
  deviceKind: z.number(),
  manageYn: z.number(),
  deviceKindNm: z.string(),
  productCompany: z.string(),
  os: z.string(),
  installCompany: z.string(),
  deviceKey: z.number(),
  deviceNm: z.string(),
  modelNm: z.string(),
  managerANm: z.string(),
  managerBNm: z.string(),
  managerA: z.number(),
  managerB: z.number(),
  device2Depth: z.number(),
  manageYnNm: z.string(),
  pstnNm: z.string().nullable(),
  installDate: z.string(),
  device1Depth: z.number(),
  managementNm: z.string(),
  managementCd: z.number(),
});

export const resLatestTemperatureDataSchema = z.object({
  temperatureData: z.object({
    temperature: z.number(),
    humidity: z.number(),
    linkedKey: z.number().nullable(),
    status: z.nativeEnum(ResIsCollected),
    regDateTime: dateTimeSchema,
  }),
});

export const resCheckPwdSchema = z.object({
  result: z.string()
});