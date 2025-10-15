import { AsyncThunkConfig, KnownError } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Key } from 'react';

import { SETTINGS_PATH } from '.';
import {
  DevicesQueryParams,
  ResCameraTypes,
  ResSwitch,
  ResSwitchPortKey,
  ResTerminal,
  ResTerminals,
  SETTINGS_SLICE,
  TerminalFormValues,
} from '../types';

// 단말 리스트 조회
const getTerminalsThunk: AsyncThunkPayloadCreator<
  ResTerminals,
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
      `${SETTINGS_PATH}/listCamera.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 단일 단말 상세 조회
const getTerminalThunk: AsyncThunkPayloadCreator<
  ResTerminal,
  Key,
  AsyncThunkConfig
> = async (id, thunkAPI) => {
  const body = { deviceKey: id };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/getCamera.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 단말 생성
export const createTerminalThunk: AsyncThunkPayloadCreator<
  void,
  Omit<TerminalFormValues, 'deviceNm'> & {
    switchPortNm: string;
  },
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  try {
    const body = {
      ...formValues,
      ...(formValues.installDate && {
        installDate: formValues.installDate.format('YYYY-MM-DD'),
      }),
    };

    await customFetch.post(`${SETTINGS_PATH}/createCamera.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 단말 수정
export const updateTerminalThunk: AsyncThunkPayloadCreator<
  void,
  Omit<TerminalFormValues, 'deviceNm'> & {
    switchPortNm: string;
    deviceKey: number;
  },
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  try {
    const body = {
      ...formValues,
      ...(formValues.installDate && {
        installDate: formValues.installDate.format('YYYY-MM-DD'),
      }),
    };
    
    await customFetch.post(`${SETTINGS_PATH}/updateCamera.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 카메라 종류 조회
const getCameraTypesThunk: AsyncThunkPayloadCreator<
  ResCameraTypes,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const body = {};

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listCameraKind.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 스위치 리스트 조회
const getSwitchesThunk: AsyncThunkPayloadCreator<
  ResSwitch[],
  string | null,
  AsyncThunkConfig
> = async (stationId, thunkAPI) => {
  if (!stationId) return [];

  const body = {
    stationCd: stationId,
  };

  try {
    const { data } = await customFetch.post(`${SETTINGS_PATH}/listL2.do`, body);

    return data.response.l2List;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 스위치 포트번호 리스트 조회
const getSwitchPortKeyListThunk: AsyncThunkPayloadCreator<
  ResSwitchPortKey[],
  string | null,
  AsyncThunkConfig
> = async (switchIp, thunkAPI) => {
  if (!switchIp) return [];

  const body = {
    switchIp,
  };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listPortKey.do`,
      body,
    );

    return data.response.portKeyList;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getTerminals = createAsyncThunk<
  ResTerminals,
  DevicesQueryParams,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getTerminals`, getTerminalsThunk);

export const getTerminal = createAsyncThunk<ResTerminal, Key, AsyncThunkConfig>(
  `${SETTINGS_SLICE}/getTerminal`,
  getTerminalThunk,
);

export const createTerminal = createAsyncThunk<
  void,
  Omit<TerminalFormValues, 'deviceNm'> & {
    switchPortNm: string;
  },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/createTerminal`, createTerminalThunk);

export const updateTerminal = createAsyncThunk<
  void,
  Omit<TerminalFormValues, 'deviceNm'> & {
    switchPortNm: string;
    deviceKey: number;
  },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/updateTerminal`, updateTerminalThunk);

export const getCameraTypes = createAsyncThunk<
  ResCameraTypes,
  void,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getCameraTypes`, getCameraTypesThunk);

export const getSwitches = createAsyncThunk<
  ResSwitch[],
  string,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getSwitches`, getSwitchesThunk);

export const getSwitchPortKeyList = createAsyncThunk<
  ResSwitchPortKey[],
  string,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getSwitchPortKeyList`, getSwitchPortKeyListThunk);
