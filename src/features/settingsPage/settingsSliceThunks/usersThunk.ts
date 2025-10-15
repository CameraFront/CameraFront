import { AsyncThunkConfig, KnownError } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Key } from 'react';

import { SETTINGS_PATH } from '.';
import {
  ResSingleUser,
  ResUsers,
  SETTINGS_SLICE,
  UserFormValues,
} from '../types';

// 사용자 리스트 조회
const getUsersThunk: AsyncThunkPayloadCreator<
  ResUsers,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const body = {};

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listUser.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 단일 사용자 상세 조회
const getUserThunk: AsyncThunkPayloadCreator<
  ResSingleUser,
  Key,
  AsyncThunkConfig
> = async (id, thunkAPI) => {
  const body = { userId: id };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/getUser.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 사용자 생성
export const createUserThunk: AsyncThunkPayloadCreator<
  void,
  UserFormValues,
  AsyncThunkConfig
> = async ({ confirm, ...rest }, thunkAPI) => {
  const body = rest;

  try {
    await customFetch.post(`${SETTINGS_PATH}/createUser.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 사용자 수정
export const updateUserThunk: AsyncThunkPayloadCreator<
  void,
  UserFormValues,
  AsyncThunkConfig
> = async ({ confirm, ...rest }, thunkAPI) => {
  const body = rest;

  try {
    await customFetch.post(`${SETTINGS_PATH}/updateUser.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 사용자 삭제
export const deleteUserThunk: AsyncThunkPayloadCreator<
  void,
  Key[],
  AsyncThunkConfig
> = async (ids, thunkAPI) => {
  const body = { userId: ids[0] };

  try {
    await customFetch.post(`${SETTINGS_PATH}/deleteUser.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getUsers = createAsyncThunk<ResUsers, void, AsyncThunkConfig>(
  `${SETTINGS_SLICE}/listUser`,
  getUsersThunk,
);

export const getUser = createAsyncThunk<ResSingleUser, Key, AsyncThunkConfig>(
  `${SETTINGS_SLICE}/getUser`,
  getUserThunk,
);

export const createUser = createAsyncThunk<
  void,
  UserFormValues,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/createUser`, createUserThunk);

export const updateUser = createAsyncThunk<
  void,
  UserFormValues,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/updateUser`, updateUserThunk);

export const deleteUser = createAsyncThunk<void, Key[], AsyncThunkConfig>(
  `${SETTINGS_SLICE}/deleteUser`,
  deleteUserThunk,
);
