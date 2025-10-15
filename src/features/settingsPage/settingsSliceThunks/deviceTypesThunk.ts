import { AsyncThunkConfig, KnownError } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Key } from 'react';

import { SETTINGS_PATH } from '.';
import { ResDeviceType, ResDeviceTypeCategory, SETTINGS_SLICE } from '../types';

// 장비종류 리스트 조회
const getDeviceTypesThunk: AsyncThunkPayloadCreator<
  ResDeviceType[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const body = {};

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listDeviceKind.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 단일 장비종류 상세 조회
const getDeviceTypeThunk: AsyncThunkPayloadCreator<
  ResDeviceType,
  Key,
  AsyncThunkConfig
> = async (id, thunkAPI) => {
  const body = { id };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/getDeviceKind.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 장비종류 카테고리 리스트 조회
// level = 1 or 2, lv1은 level=2인 경우에만 lv1으로 필터링 위해 필요
const getDeviceTypeCategoriesThunk: AsyncThunkPayloadCreator<
  ResDeviceTypeCategory[],
  { level: number; lv1?: number },
  AsyncThunkConfig
> = async ({ level, lv1 }, thunkAPI) => {
  const body = { depth1: level, ...(lv1 && { deviceKind: lv1 }) };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listDeviceDepth.do`,
      body,
    );

    return data.response.deviceDepthList;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 장비종류 수정
const updateDeviceTypeThunk: AsyncThunkPayloadCreator<
  void,
  {
    id: number;
    depth1Cd: number;
    depth2Nm: string;
  },
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const { deviceType } = thunkAPI.getState().settings.deviceTypesTab;
  const body = { ...formValues, depth2Cd: deviceType?.depth2Cd };

  try {
    await customFetch.post(`${SETTINGS_PATH}/updateDeviceKind.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getDeviceTypes = createAsyncThunk<
  ResDeviceType[],
  void,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getDeviceTypes`, getDeviceTypesThunk);

export const getDeviceType = createAsyncThunk<
  ResDeviceType,
  Key,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getDeviceType`, getDeviceTypeThunk);

export const getDeviceTypeCategories = createAsyncThunk<
  ResDeviceTypeCategory[],
  { level: number; lv1?: number },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getDeviceTypeCategories`, getDeviceTypeCategoriesThunk);

export const updateDeviceType = createAsyncThunk<
  void,
  {
    id: number;
    depth1Cd: number;
    depth2Nm: string;
  },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/updateDeviceType`, updateDeviceTypeThunk);
