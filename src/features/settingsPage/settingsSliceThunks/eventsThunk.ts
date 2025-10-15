import { AsyncThunkConfig, KnownError } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Key } from 'react';

import { SETTINGS_PATH } from '.';
import {
  EventFormValues,
  ResEvents,
  ResSingleEvent,
  SETTINGS_SLICE,
} from '../types';

// 장애 리스트 조회
const getEventsThunk: AsyncThunkPayloadCreator<
  ResEvents,
  { search?: string; page: number },
  AsyncThunkConfig
> = async ({ search = '', page = 1 }, thunkAPI) => {
  const body = { search, page };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listEvent.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 단일 장애 상세 조회
const getEventThunk: AsyncThunkPayloadCreator<
  ResSingleEvent,
  Key,
  AsyncThunkConfig
> = async (id, thunkAPI) => {
  const body = { fCd: id };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/getEvent.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 장애 수정
const updateEventThunk: AsyncThunkPayloadCreator<
  void,
  EventFormValues,
  AsyncThunkConfig
> = async ({ fDes, ...formValues }, thunkAPI) => {
  const body = {
    ...formValues,
    complexFaultYn: formValues.complexFaultYn ? 1 : 0,
    manageYn: formValues.manageYn ? 1 : 0,
  };

  try {
    await customFetch.post(`${SETTINGS_PATH}/updateEvent.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getEvents = createAsyncThunk<
  ResEvents,
  { search?: string; page: number },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getEvents`, getEventsThunk);

export const getEvent = createAsyncThunk<ResSingleEvent, Key, AsyncThunkConfig>(
  `${SETTINGS_SLICE}/getEvent`,
  getEventThunk,
);

export const updateEvent = createAsyncThunk<
  void,
  EventFormValues,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/updateEvent`, updateEventThunk);
