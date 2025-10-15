import { AsyncThunkConfig, KnownError } from '@/app/store';
import { ResTreeNode } from '@/types/common';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import axios from 'axios';

import { getDeviceParamFromPath } from '../../utils/helpers';
import { ResNumOfEvents, ResNumOfEventsByDate } from '../dashboardPage/types';
import {
  EventCommentFormValues,
  ResDeviceEventRank,
  ResEventComment,
  ResEventDetailsList,
  ResUnhandledEventDetailsList,
} from './types';

export const EVENTS_PATH = 'event';

export const getWholeDeviceTreeThunk: AsyncThunkPayloadCreator<
  ResTreeNode[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const body = {};

  try {
    const { data } = await customFetch.post(
      `${EVENTS_PATH}/listDeviceTree.do`,
      body,
    );

    return data.response.treeList;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getUnhandledNumOfEventsThunk: AsyncThunkPayloadCreator<
  ResNumOfEvents,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const {
    tree: { pathOfSelectedBranch },
    conditions: { selectedRange },
  } = thunkAPI.getState().events;
  if (!pathOfSelectedBranch) throw new Error('선택된 노드가 없습니다.');

  const body = {
    // fromDate: selectedRange[0].format('YYYY-MM-DD'),
    // toDate: selectedRange[1].format('YYYY-MM-DD'),
    ...getDeviceParamFromPath(pathOfSelectedBranch),
  };

  try {
    const { data } = await customFetch.post(
      `${EVENTS_PATH}/getFaultCnt.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getRecentEventsThunk: AsyncThunkPayloadCreator<
  ResNumOfEventsByDate[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const {
    tree: { pathOfSelectedBranch },
    conditions: { selectedRange },
  } = thunkAPI.getState().events;
  if (!pathOfSelectedBranch) throw new Error('선택된 노드가 없습니다.');

  const body = {
    fromDate: selectedRange[0].format('YYYY-MM-DD'),
    toDate: selectedRange[1].format('YYYY-MM-DD'),
    ...getDeviceParamFromPath(pathOfSelectedBranch),
  };
  try {
    const { data } = await customFetch.post(
      `${EVENTS_PATH}/listFaultTrend.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getUnhandledEventListThunk: AsyncThunkPayloadCreator<
  ResUnhandledEventDetailsList,
  { page: number },
  AsyncThunkConfig
> = async ({ page = 1 }, thunkAPI) => {
  const {
    tree: { pathOfSelectedBranch },
    conditions: { selectedRange, search, checkedEventTypes },
  } = thunkAPI.getState().events;
  if (!pathOfSelectedBranch) throw new Error('선택된 노드가 없습니다.');

  const body = {
    ...(checkedEventTypes.length && {
      eventLv: checkedEventTypes
        .map(el => {
          if (el === 'urgent') {
            return 1;
          }
          if (el === 'important') {
            return 2;
          }
          if (el === 'minor') {
            return 3;
          }
        })
        .toString(),
    }),
    search,
    page,
    // fromDate: selectedRange[0].format('YYYY-MM-DD'),
    // toDate: selectedRange[1].format('YYYY-MM-DD'),
    ...getDeviceParamFromPath(pathOfSelectedBranch),
  };

  try {
    const { data } = await customFetch.post(
      `${EVENTS_PATH}/listFault.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getNumOfEventsByRangeThunk: AsyncThunkPayloadCreator<
  ResNumOfEvents,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const {
    tree: { pathOfSelectedBranch },
    conditions: { selectedRange },
  } = thunkAPI.getState().events;
  if (!pathOfSelectedBranch) throw new Error('선택된 노드가 없습니다.');

  const body = {
    fromDate: selectedRange[0].format('YYYY-MM-DD'),
    toDate: selectedRange[1].format('YYYY-MM-DD'),
    ...getDeviceParamFromPath(pathOfSelectedBranch),
  };

  try {
    const { data } = await customFetch.post(
      `${EVENTS_PATH}/getFaultHistoryCnt.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getEventsOfDayByRangeThunk: AsyncThunkPayloadCreator<
  ResNumOfEventsByDate[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const {
    tree: { pathOfSelectedBranch },
    conditions: { selectedRange },
  } = thunkAPI.getState().events;
  if (!pathOfSelectedBranch) throw new Error('선택된 노드가 없습니다.');

  const body = {
    fromDate: selectedRange[0].format('YYYY-MM-DD'),
    toDate: selectedRange[1].format('YYYY-MM-DD'),
    ...getDeviceParamFromPath(pathOfSelectedBranch),
  };

  try {
    const { data } = await customFetch.post(
      `${EVENTS_PATH}/listFaultHistoryTrend.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getDeviceEventRankingsByRangeThunk: AsyncThunkPayloadCreator<
  ResDeviceEventRank[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const {
    tree: { pathOfSelectedBranch },
    conditions: { selectedRange },
  } = thunkAPI.getState().events;
  if (!pathOfSelectedBranch) throw new Error('선택된 노드가 없습니다.');

  const body = {
    fromDate: selectedRange[0].format('YYYY-MM-DD'),
    toDate: selectedRange[1].format('YYYY-MM-DD'),
    ...getDeviceParamFromPath(pathOfSelectedBranch),
  };

  try {
    const { data } = await customFetch.post(
      `${EVENTS_PATH}/listDeviceFaultHistoryRanking.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getEventDetailsListByRangeThunk: AsyncThunkPayloadCreator<
  ResEventDetailsList,
  { page: number },
  AsyncThunkConfig
> = async ({ page = 1 }, thunkAPI) => {
  const {
    tree: { pathOfSelectedBranch },
    conditions: { selectedRange, search, checkedEventTypes },
  } = thunkAPI.getState().events;
  if (!pathOfSelectedBranch) throw new Error('선택된 노드가 없습니다.');

  const body = {
    search,
    page,
    ...(checkedEventTypes.length && {
      eventLv: checkedEventTypes
        .map(el => {
          if (el === 'urgent') {
            return 1;
          }
          if (el === 'important') {
            return 2;
          }
          if (el === 'minor') {
            return 3;
          }
        })
        .toString(),
    }),
    fromDate: selectedRange[0].format('YYYY-MM-DD'),
    toDate: selectedRange[1].format('YYYY-MM-DD'),
    ...getDeviceParamFromPath(pathOfSelectedBranch),
  };

  try {
    const { data } = await customFetch.post(
      `${EVENTS_PATH}/listFaultHistory.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getEventCommentByIdThunk: AsyncThunkPayloadCreator<
  ResEventComment,
  number,
  AsyncThunkConfig
> = async (eventKey, thunkAPI) => {
  const body = {
    eventKey,
  };

  try {
    const { data } = await customFetch.post(
      `${EVENTS_PATH}/getFaultHistComment.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const updateEventCommentThunk: AsyncThunkPayloadCreator<
  void,
  EventCommentFormValues,
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = {
    ...formValues,
  };

  try {
    const { data } = await customFetch.post(
      `${EVENTS_PATH}/updateFaultHistComment.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};
