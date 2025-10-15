import { AsyncThunkConfig, KnownError } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Key } from 'react';

import { SETTINGS_PATH } from '.';
import {
  ResSingleThreshold,
  ResThresholds,
  SETTINGS_SLICE,
  ThresholdFormValues,
} from '../types';

// 임계치 리스트 조회
const getThresholdsThunk: AsyncThunkPayloadCreator<
  ResThresholds,
  { search?: string; page: number },
  AsyncThunkConfig
> = async ({ search = '', page = 1 }, thunkAPI) => {
  const body = { search, page };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listDeviceThr.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 단일 임계치 상세 조회
const getThresholdThunk: AsyncThunkPayloadCreator<
  ResSingleThreshold,
  Key,
  AsyncThunkConfig
> = async (id, thunkAPI) => {
  const body = { deviceKey: id };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/getDeviceThr.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 임계치 수정
const updateThresholdThunk: AsyncThunkPayloadCreator<
  void,
  ThresholdFormValues,
  AsyncThunkConfig
> = async ({ deviceNm, ...formValues }, thunkAPI) => {
  const body = formValues;

  try {
    await customFetch.post(`${SETTINGS_PATH}/updateDeviceThr.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getThresholds = createAsyncThunk<
  ResThresholds,
  { search?: string; page: number },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getThresholds`, getThresholdsThunk);

export const getThreshold = createAsyncThunk<
  ResSingleThreshold,
  Key,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getThreshold`, getThresholdThunk);

export const updateThreshold = createAsyncThunk<
  void,
  ThresholdFormValues,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/updateThreshold`, updateThresholdThunk);
