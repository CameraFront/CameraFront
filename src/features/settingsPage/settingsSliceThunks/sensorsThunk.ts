import { AsyncThunkConfig, KnownError } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Key } from 'react';

import { SETTINGS_PATH } from '.';
import {
  DevicesQueryParams,
  ResSensor,
  ResSensors,
  SensorFormValues,
  SETTINGS_SLICE,
} from '../types';

// 센서 리스트 조회
const getSensorsThunk: AsyncThunkPayloadCreator<
  ResSensors,
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
      `${SETTINGS_PATH}/listSensor.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 센서 조회
export const getSensorThunk: AsyncThunkPayloadCreator<
  ResSensor,
  Key,
  AsyncThunkConfig
> = async (id, thunkAPI) => {
  const body = { deviceKey: id };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/getSensor.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 센서 생성
export const createSensorThunk: AsyncThunkPayloadCreator<
  void,
  Omit<SensorFormValues, 'deviceNm'> & { sensorNm: string },
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  try {
    const body = {
      ...formValues,
      ...(formValues.installDate && {
        installDate: formValues.installDate.format('YYYY-MM-DD'),
      }),
    };

    await customFetch.post(`${SETTINGS_PATH}/createSensor.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 센서 수정
export const updateSensorThunk: AsyncThunkPayloadCreator<
  void,
  Omit<SensorFormValues, 'deviceNm'> & { sensorNm: string; deviceKey: number },
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  try {
    const body = {
      ...formValues,
      ...(formValues.installDate && {
        installDate: formValues.installDate.format('YYYY-MM-DD'),
      }),
    };

    await customFetch.post(`${SETTINGS_PATH}/updateSensor.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getSensors = createAsyncThunk<
  ResSensors,
  DevicesQueryParams,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getSensors`, getSensorsThunk);

export const getSensor = createAsyncThunk<ResSensor, Key, AsyncThunkConfig>(
  `${SETTINGS_SLICE}/getSensor`,
  getSensorThunk,
);

export const createSensor = createAsyncThunk<
  void,
  Omit<SensorFormValues, 'deviceNm'> & { sensorNm: string },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/createSensor`, createSensorThunk);

export const updateSensor = createAsyncThunk<
  void,
  Omit<SensorFormValues, 'deviceNm'> & { sensorNm: string; deviceKey: number },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/updateSensor`, updateSensorThunk);
