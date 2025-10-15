import { AsyncThunkConfig, KnownError } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Key } from 'react';

import { SETTINGS_PATH } from '.';
import {
  DeviceFormValues,
  DevicesQueryParams,
  ResDevice,
  ResDevices,
  SETTINGS_SLICE,
} from '../types';

// 장비 리스트 조회
const getDevicesThunk: AsyncThunkPayloadCreator<
  ResDevices,
  DevicesQueryParams,
  AsyncThunkConfig
> = async ({ search = '', filters, page = 1 }, thunkAPI) => {
  const body = {
    ...(filters &&
      filters.businessUnitId && { managementCd: filters.businessUnitId }),
    ...(filters && filters.stationId && { stationCd: filters.stationId }),
    ...(filters &&
      filters.deviceTypeId && { deviceKind: filters.deviceTypeId }),
    search,
    page,
  };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listDevice.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 단일 장비 상세 조회
export const getDeviceThunk: AsyncThunkPayloadCreator<
  ResDevice,
  Key,
  AsyncThunkConfig
> = async (id, thunkAPI) => {
  const body = { deviceKey: id };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/getDevice.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 장비 생성
export const createDeviceThunk: AsyncThunkPayloadCreator<
  void,
  DeviceFormValues,
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = {
    ...formValues,
    // manageYn: formValues.manageYn ? 1 : 0,
    installDate: formValues.installDate.format('YYYY-MM-DD'),
  };

  try {
    await customFetch.post(`${SETTINGS_PATH}/createDevice.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 장비 수정
export const updateDeviceThunk: AsyncThunkPayloadCreator<
  void,
  DeviceFormValues & { deviceKey: number },
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = {
    ...formValues,
    installDate: formValues.installDate.format('YYYY-MM-DD'),
  };

  try {
    await customFetch.post(`${SETTINGS_PATH}/updateDevice.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getDevices = createAsyncThunk<
  ResDevices,
  DevicesQueryParams,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getDevices`, getDevicesThunk);

export const getDevice = createAsyncThunk<ResDevice, Key, AsyncThunkConfig>(
  `${SETTINGS_SLICE}/getDevice`,
  getDeviceThunk,
);

export const createDevice = createAsyncThunk<
  void,
  DeviceFormValues,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/createDevice`, createDeviceThunk);

export const updateDevice = createAsyncThunk<
  void,
  DeviceFormValues & { deviceKey: number },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/updateDevice`, updateDeviceThunk);
