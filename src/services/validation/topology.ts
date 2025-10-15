import { z } from 'zod';
import { ResBoolean, ResManageYn } from '@/types/enum';
import {
  anyObjectSchema,
  eventTypeEnSchema,
  genericDateSchema,
} from './common';

export const resTopologyTreeMapSchema = z.object({
  managementCd: z.number(),
  seqNum: z.number(),
  topologyNm: z.string(),
});

export const resTopologyTreeMapListSchema = z.array(resTopologyTreeMapSchema);

export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const eventSchema = z.object({
  eventLv: eventTypeEnSchema,
  eventMsg: z.string(),
  eventKey: z.number(),
  eventRegDate: genericDateSchema,
});

export const sectionNodeDataSchema = z.object({
  label: z.string(),
});

export const networkNodeDataSchema = z.object({
  depth1Cd: z.number(),
  depth1Nm: z.string(),
  depth2Cd: z.number(),
  depth2Nm: z.string(),
  deviceId: z.number(),
  deviceName: z.string(),
});

export const reactFlowNodeCommonSchema = z.object({
  dragging: z.boolean().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  id: z.string(),
  position: positionSchema,
  positionAbsolute: positionSchema.optional(),
  selected: z.boolean().optional(),
  style: anyObjectSchema.optional(),
});

export const topologyNodeSchema = z.discriminatedUnion('type', [
  z
    .object({ type: z.literal('network') })
    .merge(reactFlowNodeCommonSchema)
    .merge(z.object({ data: networkNodeDataSchema })),
  z
    .object({ type: z.literal('section') })
    .merge(reactFlowNodeCommonSchema)
    .merge(z.object({ data: sectionNodeDataSchema })),
]);

export const topologyEdgeSchema = z.object({
  sourceHandle: z.string(),
  animated: z.boolean().optional(),
  style: anyObjectSchema,
  source: z.string(),
  id: z.string(),
  // NOTE: reactflow의 `Edge`의 `type`이 string으로 정의되어 있어서 일단 string으로 정의
  // type: z.enum(['smoothstep', 'straight', 'step', 'bezier']),
  type: z.string(),
  targetHandle: z.string(),
  target: z.string(),
  selected: z.boolean().optional(),
});

export const resTopologyFaultSchema = z.object({
  deviceKey: z.number(),
  important: z.number(),
  managementYn: z.nativeEnum(ResManageYn).nullable(),
  totalCnt: z.number(),
  eventList: z.array(eventSchema),
  minor: z.number(),
  manualYn: z.nativeEnum(ResBoolean),
  urgent: z.number(),
});

export const resTopologyMapContentSchema = z.object({
  dataNode: z.array(topologyNodeSchema).nullable(),
  edgeNode: z.array(topologyEdgeSchema).nullable(),
  topologyInfo: z.object({
    depth1: z.string(),
    depth2: z.string().optional(),
    depth3: z.string().optional(),
    topologyNm: z.string(),
  }),
  topologyFaultList: z.array(resTopologyFaultSchema),
});

export const resDevicesByTypeSchema = z.array(
  z.object({
    deviceKey: z.number(),
    managementCd: z.number(),
    deviceNm: z.string(),
    os: z.string(),
    deviceIp: z.string().ip(),
  }),
);
