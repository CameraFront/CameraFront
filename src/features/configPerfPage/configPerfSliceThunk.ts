import { AsyncThunkConfig, KnownError } from '@/app/store';
import { RANGE_FROM_YESTERDAY } from '@/config';
import { RangeValue, ResTreeNode } from '@/types/common';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { getDeviceParamFromBranch } from '@/utils/helpers';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import axios from 'axios';

import {
  ResConfigDeviceDetails,
  ResConfigDeviceList,
  ResPerfDeviceDetails,
  ResPerfDeviceList,
  ResPerfUsageRankTop5,
  ResPort,
} from './types';

export const getWholeDeviceTreeThunk: AsyncThunkPayloadCreator<
  ResTreeNode[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const body = {};

  try {
    const { data } = await customFetch.post('device/listDeviceTree.do', body);

    return data.response.treeList;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error)) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }

    return error;
  }
};

export const getConfigDeviceListThunk: AsyncThunkPayloadCreator<
  ResConfigDeviceList,
  { search?: string; page: number },
  AsyncThunkConfig
> = async ({ search = '', page = 1 }, thunkAPI) => {
  const { selectedBranch } = thunkAPI.getState().configPerf;
  if (!selectedBranch) throw new Error('노드가 선택되지 않았습니다.');

  const body = {
    search,
    page,
    ...getDeviceParamFromBranch(selectedBranch),
  };

  try {
    const { data } = await customFetch.post('device/listDevice.do', body);

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error)) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }

    return error;
  }
};

export const getConfigDeviceDetailsThunk: AsyncThunkPayloadCreator<
  ResConfigDeviceDetails,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const { selectedBranch } = thunkAPI.getState().configPerf;
  if (!selectedBranch) throw new Error('노드가 선택되지 않았습니다.');
  if (selectedBranch.type !== 'dv')
    throw new Error('선택된 노드가 단일 디바이스가 아닙니다.');

  const body = {
    deviceKey: selectedBranch.realKey,
  };

  try {
    const { data } = await customFetch.post('device/getDeviceDetail.do', body);

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error)) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }

    return error;
  }
};

export const getPerfDeviceListThunk: AsyncThunkPayloadCreator<
  ResPerfDeviceList,
  { search?: string; page: number },
  AsyncThunkConfig
> = async ({ search = '', page = 1 }, thunkAPI) => {
  const { selectedBranch } = thunkAPI.getState().configPerf;
  if (!selectedBranch) throw new Error('노드가 선택되지 않았습니다.');

  const body = {
    search,
    page,
    ...getDeviceParamFromBranch(selectedBranch),
  };

  try {
    const { data } = await customFetch.post(
      'device/listDevicePerformance.do',
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error)) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }

    return error;
  }
};

export const getPerfUsageTop5Thunk: AsyncThunkPayloadCreator<
  ResPerfUsageRankTop5,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const body = {};

  try {
    const { data } = await customFetch.post(
      'device/listDeviceResourcePerformanceRanking.do',
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error)) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }

    return error;
  }
};

export const getPerfDeviceDetailsThunk: AsyncThunkPayloadCreator<
  ResPerfDeviceDetails,
  RangeValue | void,
  AsyncThunkConfig
> = async (range = RANGE_FROM_YESTERDAY, thunkAPI) => {
  const { selectedBranch } = thunkAPI.getState().configPerf;
  if (!selectedBranch || !range) return;

  const body = {
    deviceKey: selectedBranch.realKey,
    fromDate: range[0]?.format('YYYY-MM-DD'),
    toDate: range[1]?.format('YYYY-MM-DD'),
  };
  try {
    const { data } = await customFetch.post(
      'device/listDeviceResourcePerformance.do',
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error)) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }

    return error;
  }
};

export const getPortsBySwitchThunk: AsyncThunkPayloadCreator<
  ResPort[],
  number,
  AsyncThunkConfig
> = async (switchId, thunkAPI) => {
  const body = {
    deviceKey: switchId,
  };
  try {
    const { data } = await customFetch.post('device/listPort.do', body);

    return data.response.portList;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error)) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }

    return error;
  }
};
