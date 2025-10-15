import { Dayjs } from 'dayjs';
import {
  EventTypeEn,
  PathOfBranch,
  ResPaginationMeta,
  ResTreeNode,
} from '@/types/common';
// FIXME
// eslint-disable-next-line import/no-cycle
import { ResNumOfEvents, ResNumOfEventsByDate } from '../dashboardPage/types';

export interface EventsSliceState {
  isLoading: boolean;
  selectedTab: 'eventStatus' | 'eventHistory' | 'eventAnalysis';
  tree: {
    selectedBranch: ResTreeNode | null;
    resDeviceTree: ResTreeNode[];
    pathOfSelectedBranch: PathOfBranch | undefined;
  };
  conditions: {
    selectedRange: [Dayjs, Dayjs];
    search: string;
    checkedEventTypes: EventTypeEn[];
  };
  eventStatus: {
    numOfEvents: ResNumOfEvents | null;
    eventsByDate: ResNumOfEventsByDate[];
    eventDetailsList: ResUnhandledEventDetailsList | null;
  };
  eventHistory: {
    numOfEvents: ResNumOfEvents | null;
    eventsByDate: ResNumOfEventsByDate[];
    eventDetailsList: ResEventDetailsList | null;
    deviceEventRankings: ResDeviceEventRank[];
    commentInfo: ResEventComment | null;
  };
}

export type ResUnhandledEventDetailsList = {
  faultList: ResEventDevice[];
  page: ResPaginationMeta;
};

export type ResEventDetailsList = {
  faultHistoryList: (ResEventDevice & { recDate: string })[];
  page: ResPaginationMeta;
};

export interface ResEventDevice {
  cameraIp: string;
  deviceIp: string;
  deviceKey: number;
  deviceKind: number;
  deviceKindNm: string;
  deviceKindNmSub: string;
  deviceKindSub: number;
  deviceNm: string;
  eventCd: string;
  eventKey: number;
  eventMsg: string;
  eventNm: EventTypeEn;
  fsKey: number | null;
  gender: string | null;
  ifName: number | null;
  managementCd: number;
  managementNm: string;
  no: number;
  ocDate: string;
  portKey: number;
  pstnNm: string;
  sensorKey: number | null;
}

export interface ResDeviceEventRank {
  deviceKey: string;
  deviceNm: string;
  urgent: number;
  important: number;
  minor: number;
  total: number;
}

export interface ResEventComment {
  eventMsg: string;
  deviceNm: string;
  comment: string;
}

export interface EventCommentFormValues {
  eventKey: number;
  comment: string;
}
