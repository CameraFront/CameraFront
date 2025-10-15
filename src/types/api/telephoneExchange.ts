import { z } from 'zod';
import {
  resCallPeakTrendSchema,
  resCurrentCallTrendSchema,
  resPhoneCountSchema,
  resPhoneStatisticsByFilterSchema,
  resUnregisteredPhoneDetailsSchema,
  resUnregisteredPhonesByFilterScanSchema,
  resUnregisteredPhonesByFilterSchema,
  telephoneExchangeSearchParamsSchema,
} from '@/services/validation/telephoneExchange';

export type TelephoneExchangeSearchParams = z.infer<
  typeof telephoneExchangeSearchParamsSchema
>;

export type ResUnregisteredPhonesByFilter = z.infer<
  typeof resUnregisteredPhonesByFilterSchema
>;

export type ResUnregisteredPhonesByFilterScan = z.infer<
  typeof resUnregisteredPhonesByFilterScanSchema
>;


export type ResUnregisteredPhoneDetails = z.infer<
  typeof resUnregisteredPhoneDetailsSchema
>;

export type ResPhoneStatisticsByFilter = z.infer<
  typeof resPhoneStatisticsByFilterSchema
>;

export type ResCurrentCallTrend = z.infer<typeof resCurrentCallTrendSchema>;

export type ResCallPeakTrend = z.infer<typeof resCallPeakTrendSchema>;

export type ResPhoneCount = z.infer<typeof resPhoneCountSchema>;
