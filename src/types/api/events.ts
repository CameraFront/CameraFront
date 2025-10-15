import { z } from 'zod';
import {
  eventsSearchParamsSchema,
  resDailyEventCountsByDateRangeSchema,
  resDeviceRankingsByEventSchema,
  resEventCommentSchema,
  resEventsByFiltersSchema,
  resTodayHourlyEventCountsSchema,
  resUnresolvedEventsByFiltersSchema,
} from '@/services/validation/events';

export type EventsSearchParams = z.infer<typeof eventsSearchParamsSchema>;

export interface ReqEventsByFilter {
  page: number;
  branchId?: number;
  deviceId?: number;
  eventTypes?: number[];
  deviceType?: number | undefined;
  search?: string | undefined;
  sort?: 'ASC' | 'DESC';
  fromDate?: string;
  toDate?: string;
}

export type ResTodayHourlyEventCounts = z.infer<
  typeof resTodayHourlyEventCountsSchema
>;

export type ResDailyEventCountsByDateRange = z.infer<
  typeof resDailyEventCountsByDateRangeSchema
>;

export type ResDeviceRankingsByEvent = z.infer<
  typeof resDeviceRankingsByEventSchema
>;

export type ResUnresolvedEventsByFilters = z.infer<
  typeof resUnresolvedEventsByFiltersSchema
>;

export type ResEventsByFilters = z.infer<typeof resEventsByFiltersSchema>;

export type ResEventComment = z.infer<typeof resEventCommentSchema>;
