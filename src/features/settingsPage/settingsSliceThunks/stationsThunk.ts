import { AsyncThunkConfig, KnownError } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Key } from 'react';

import { SETTINGS_PATH } from '.';
import { ResStation, ResStations, SETTINGS_SLICE } from '../types';

// 역사 리스트 조회
const getStationsThunk: AsyncThunkPayloadCreator<
  ResStations,
  { page?: number; option?: 'full'; managementCd?: number },
  AsyncThunkConfig
> = async ({ page = 1, option, managementCd }, thunkAPI) => {
  const body = {
    ...(option && { option }),
    ...(managementCd && { managementCd }),
    page,
  };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listStation.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 단일 역사 상세 조회
const getStationThunk: AsyncThunkPayloadCreator<
  ResStation,
  Key,
  AsyncThunkConfig
> = async (id, thunkAPI) => {
  const body = { stationCd: id };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/getStation.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 역사 생성
const createStationThunk: AsyncThunkPayloadCreator<
  void,
  Omit<ResStation, 'stationNm'>,
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = formValues;

  try {
    await customFetch.post(`${SETTINGS_PATH}/createStation.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 역사 수정
const updateStationThunk: AsyncThunkPayloadCreator<
  void,
  ResStation,
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = formValues;

  try {
    await customFetch.post(`${SETTINGS_PATH}/updateStation.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 역사 삭제
const deleteStationsThunk: AsyncThunkPayloadCreator<
  void,
  Key[],
  AsyncThunkConfig
> = async (ids, thunkAPI) => {
  const body = { stationCd: ids[0] };

  try {
    await customFetch.post(`${SETTINGS_PATH}/deleteStation.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getStations = createAsyncThunk<
  ResStations,
  { page?: number; option?: 'full'; managementCd?: number },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getStations`, getStationsThunk);

export const getStation = createAsyncThunk<ResStation, Key, AsyncThunkConfig>(
  `${SETTINGS_SLICE}/getStation`,
  getStationThunk,
);

export const createStation = createAsyncThunk<
  void,
  Omit<ResStation, 'managementCd'>,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/createStation`, createStationThunk);

export const updateStation = createAsyncThunk<
  void,
  ResStation,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/updateStation`, updateStationThunk);

export const deleteStations = createAsyncThunk<void, Key[], AsyncThunkConfig>(
  `${SETTINGS_SLICE}/deleteStations`,
  deleteStationsThunk,
);
