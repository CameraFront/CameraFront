import { z } from 'zod';
import {
  resRackLayoutDeviceImagesByDeviceTypeSchema,
  resRackLayoutDevicesByDeviceTypeSchema,
  resRackLayoutMapContentSchema,
  resRackLayoutMapListSchema,
} from '@/services/validation/rackLayout';

export type ResRackLayoutMapList = z.infer<typeof resRackLayoutMapListSchema>;

export type ResRackLayoutMapContent = z.infer<
  typeof resRackLayoutMapContentSchema
>;

export type ResRackLayoutDevicesByDeviceType = z.infer<
  typeof resRackLayoutDevicesByDeviceTypeSchema
>;

export type ResRackLayoutDeviceImagesByDeviceType = z.infer<
  typeof resRackLayoutDeviceImagesByDeviceTypeSchema
>;
