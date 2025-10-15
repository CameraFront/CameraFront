import { z } from 'zod';
import { ResBoolean, ResManageYn } from '@/types/enum';
import { EVENT_TYPES_EN } from '@/config';
import { resPaginationSchema, stringDateSchema } from './common';
import { reactFlowNodeCommonSchema } from './topology';

export const resRackLayoutMapListSchema = z.array(
  z.object({
    managementCd: z.number(),
    seqNum: z.number(),
    rackNm: z.string(),
  }),
);

export const resRackLayoutEventListSchema = z.array(
  z.object({
    eventLv: z.enum(EVENT_TYPES_EN),
    eventMsg: z.string(),
    eventKey: z.number(),
    eventRegDate: stringDateSchema,
  }),
);

export const rackNodeDataSchema = z.object({
  label: z.string(),
});

export const rackItemNodeDataSchema = z.object({
  unit: z.number(),
  deviceTypeId: z.number(),
  deviceTypeName: z.string(),
  deviceImageId: z.number(),
  deviceId: z.number(),
  deviceName: z.string(),
});

export const rackDisplayItemNodeDataSchema = rackItemNodeDataSchema.pick({
  deviceImageId: true,
  unit: true,
  deviceTypeId: true,
  deviceTypeName: true,
});

export const rackLayoutNodeSchema = z.discriminatedUnion('type', [
  z
    .object({ type: z.literal('rack') })
    .merge(reactFlowNodeCommonSchema)
    .merge(z.object({ data: rackNodeDataSchema })),
  z
    .object({ type: z.literal('rackItem') })
    .merge(reactFlowNodeCommonSchema)
    .merge(z.object({ data: rackItemNodeDataSchema })),
  z
    .object({ type: z.literal('rackItemDisplay') })
    .merge(reactFlowNodeCommonSchema)
    .merge(z.object({ data: rackDisplayItemNodeDataSchema })),
]);

export const resRackLayoutFaultSchema = z.object({
  deviceKey: z.number(),
  urgent: z.number(),
  important: z.number(),
  minor: z.number(),
  totalCnt: z.number(),
  managementYn: z.nativeEnum(ResManageYn).nullable(),
  manualYn: z.nativeEnum(ResBoolean),
  eventList: resRackLayoutEventListSchema,
});

export const resRackLayoutMapContentSchema = z.object({
  rackFaultList: z.array(resRackLayoutFaultSchema).optional(),
  dataNode: z.array(rackLayoutNodeSchema).nullable(),
});

export const resRackLayoutDevicesByDeviceTypeSchema = z.array(
  z.object({
    deviceKey: z.number(),
    managementCd: z.number(),
    deviceNm: z.string(),
    os: z.string(),
    deviceIp: z.string(),
  }),
);

export const resRackLayoutDeviceImagesByDeviceTypeSchema = z.object({
  listDeviceImage: z.array(
    z.object({
      no: z.number(),
      seqNum: z.number(),
      deviceKind: z.number(),
      deviceKindNm: z.string(),
      deviceFileNm: z.string(),
      unit: z.number(),
      fileNm: z.string(),
    }),
  ),
  page: resPaginationSchema,
});
