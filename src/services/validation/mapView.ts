import { z } from 'zod';
import { reactFlowNodeCommonSchema } from './topology';

export const backgroundNodeDataSchema = z.object({});

export const spotItemNodeDataSchema = z.object({
  managementCd: z.number(),
  managementNm: z.string(),
  path: z.string().regex(/^\/(\d+\/)*\d+$/),
  urgent: z.number(),
  important: z.number(),
  minor: z.number(),
  total: z.number(),
});

export const mapViewNodeSchema = z.discriminatedUnion('type', [
  z
    .object({ type: z.literal('backgroundMap') })
    .merge(reactFlowNodeCommonSchema)
    .merge(z.object({ data: backgroundNodeDataSchema })),
  z
    .object({ type: z.literal('spotItem') })
    .merge(reactFlowNodeCommonSchema)
    .merge(z.object({ data: spotItemNodeDataSchema })),
]);

export const resMapViewContentSchema = z.object({
  lineMapNm: z.string(),
  dataNode: z.array(mapViewNodeSchema).nullable(),
});
