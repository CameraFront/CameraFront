import { RANGE_FROM_7DAYS } from '@/config';
import { EventsSliceState } from './types';

export const initialState: EventsSliceState = {
  isLoading: false,
  selectedTab: 'eventStatus',
  tree: {
    selectedBranch: null,
    resDeviceTree: [],
    pathOfSelectedBranch: [],
  },
  conditions: {
    selectedRange: RANGE_FROM_7DAYS,
    search: '',
    checkedEventTypes: ['urgent', 'important', 'minor'],
  },
  eventStatus: {
    numOfEvents: null,
    eventsByDate: [],
    eventDetailsList: null,
  },
  eventHistory: {
    numOfEvents: null,
    eventsByDate: [],
    eventDetailsList: null,
    deviceEventRankings: [],
    commentInfo: null,
  },
};
