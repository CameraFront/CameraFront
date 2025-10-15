import { AsyncThunkConfig, KnownError } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Key } from 'react';

import { SETTINGS_PATH } from '.';
import {
  DeviceImageFormValues,
  ResDeviceImages,
  ResSingleDeviceImage,
  SETTINGS_SLICE,
} from '../types';

// 디바이스 이미지 리스트 조회
const getDeviceImagesThunk: AsyncThunkPayloadCreator<
  ResDeviceImages,
  { page: number; deviceType?: number },
  AsyncThunkConfig
> = async ({ page = 1, deviceType }, thunkAPI) => {
  const body = { page, ...(deviceType && { deviceKind: deviceType }) };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listDeviceImage.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 단일 디바이스 이미지 상세 조회
export const getDeviceImageThunk: AsyncThunkPayloadCreator<
  ResSingleDeviceImage,
  Key,
  AsyncThunkConfig
> = async (id, thunkAPI) => {
  const body = { seqNum: id };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/getDeviceImage.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 디바이스 이미지 생성
export const createDeviceImageThunk: AsyncThunkPayloadCreator<
  void,
  DeviceImageFormValues,
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = new FormData();

  for (const [key, value] of Object.entries(formValues)) {
    body.append(key, value);
  }

  try {
    const boundary = `----${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}`;

    await customFetch.post(`${SETTINGS_PATH}/createDeviceImage.do`, body, {
      headers: {
        'content-type': `multipart/form-data; boundary=${boundary}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 디바이스 이미지 수정
export const updateDeviceImageThunk: AsyncThunkPayloadCreator<
  void,
  DeviceImageFormValues & { seqNum: number },
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = new FormData();

  for (const [key, value] of Object.entries(formValues)) {
    body.append(key, value);
  }

  try {
    const boundary = `----${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}`;

    await customFetch.post(`${SETTINGS_PATH}/updateDeviceImage.do`, body, {
      headers: {
        'content-type': `multipart/form-data; boundary=${boundary}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 디바이스 이미지 삭제
export const deleteDeviceImagesThunk: AsyncThunkPayloadCreator<
  void,
  Key[],
  AsyncThunkConfig
> = async (ids, thunkAPI) => {
  const body = { seqNumArray: ids };

  try {
    await customFetch.post(`${SETTINGS_PATH}/deleteMultiDeviceImage.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getDeviceImages = createAsyncThunk<
  ResDeviceImages,
  { page: number; deviceType?: number },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getDeviceImages`, getDeviceImagesThunk);

export const getDeviceImage = createAsyncThunk<
  ResSingleDeviceImage,
  Key,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getDeviceImage`, getDeviceImageThunk);

export const createDeviceImage = createAsyncThunk<
  void,
  DeviceImageFormValues,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/createDeviceImage`, createDeviceImageThunk);

export const updateDeviceImage = createAsyncThunk<
  void,
  DeviceImageFormValues & { seqNum: number },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/updateDeviceImage`, updateDeviceImageThunk);

export const deleteDeviceImages = createAsyncThunk<
  void,
  Key[],
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/deleteDeviceImages`, deleteDeviceImagesThunk);
