import { Key } from 'react';
import axios from 'axios';
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig, KnownError } from '@/app/store';
import { SETTINGS_PATH } from '@/services/api/apiPaths';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { ResBusinessUnit, ResBusinessUnits, SETTINGS_SLICE } from '../types';

// 본부리스트 조회
const getBusinessUnitsThunk: AsyncThunkPayloadCreator<
  ResBusinessUnits,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const body = {};

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listManagement.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 단일 본부 상세 조회
const getBusinessUnitThunk: AsyncThunkPayloadCreator<
  ResBusinessUnit,
  Key,
  AsyncThunkConfig
> = async (id, thunkAPI) => {
  const body = { managementCd: id };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/getManagement.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 본부 생성
const createBusinessUnitThunk: AsyncThunkPayloadCreator<
  void,
  Omit<ResBusinessUnit, 'managementCd'>,
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = formValues;

  try {
    await customFetch.post(`${SETTINGS_PATH}/createManagement.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

//
const updateBusinessUnitThunk: AsyncThunkPayloadCreator<
  void,
  ResBusinessUnit,
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = formValues;

  try {
    await customFetch.post(`${SETTINGS_PATH}/updateManagement.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 본부 삭제
const deleteBusinessUnitsThunk: AsyncThunkPayloadCreator<
  void,
  Key[],
  AsyncThunkConfig
> = async (ids, thunkAPI) => {
  // 하나씩만 삭제가능
  const body = { managementCd: ids[0] };

  try {
    await customFetch.post(`${SETTINGS_PATH}/deleteManagement.do`, body);

    // return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getBusinessUnits = createAsyncThunk<
  ResBusinessUnits,
  void,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getBusinessUnits`, getBusinessUnitsThunk);

export const getBusinessUnit = createAsyncThunk<
  ResBusinessUnit,
  Key,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getBusinessUnit`, getBusinessUnitThunk);

export const createBusinessUnit = createAsyncThunk<
  void,
  Omit<ResBusinessUnit, 'managementCd'>,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/createBusinessUnit`, createBusinessUnitThunk);

export const updateBusinessUnit = createAsyncThunk<
  void,
  ResBusinessUnit,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/updateBusinessUnit`, updateBusinessUnitThunk);

export const deleteBusinessUnits = createAsyncThunk<
  void,
  Key[],
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/deleteBusinessUnits`, deleteBusinessUnitsThunk);
