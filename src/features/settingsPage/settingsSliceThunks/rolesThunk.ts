import { AsyncThunkConfig, KnownError } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Key } from 'react';

import { SETTINGS_PATH } from '.';
import {
  ResRole,
  ResRoleDetails,
  ResRoleGroup,
  RoleFormValues,
  SETTINGS_SLICE,
} from '../types';

// 권한 리스트 조회
const getRolesThunk: AsyncThunkPayloadCreator<
  ResRole[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const body = {};

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listRole.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 단일 권한 상세 조회
const getRoleThunk: AsyncThunkPayloadCreator<
  ResRoleDetails,
  Key,
  AsyncThunkConfig
> = async (id, thunkAPI) => {
  const body = { roleId: id };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/getRole.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 권한 그룹 리스트 조회
const getRoleGroupsThunk: AsyncThunkPayloadCreator<
  ResRoleGroup[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const body = {};

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listGroupRole.do`,
      body,
    );

    return data.response.groupRoleList;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 권한 생성
export const createRoleThunk: AsyncThunkPayloadCreator<
  void,
  RoleFormValues,
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = formValues;

  try {
    await customFetch.post(`${SETTINGS_PATH}/createRole.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 권한 수정
export const updateRoleThunk: AsyncThunkPayloadCreator<
  void,
  RoleFormValues,
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = formValues;

  try {
    await customFetch.post(`${SETTINGS_PATH}/updateRole.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

// 권한 삭제
export const deleteRoleThunk: AsyncThunkPayloadCreator<
  void,
  Key[],
  AsyncThunkConfig
> = async (ids, thunkAPI) => {
  const body = { roleId: ids[0] };

  try {
    await customFetch.post(`${SETTINGS_PATH}/deleteRole.do`, body);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getRoles = createAsyncThunk<ResRole[], void, AsyncThunkConfig>(
  `${SETTINGS_SLICE}/getRoles`,
  getRolesThunk,
);

export const getRole = createAsyncThunk<ResRoleDetails, Key, AsyncThunkConfig>(
  `${SETTINGS_SLICE}/getRole`,
  getRoleThunk,
);

export const getRoleGroups = createAsyncThunk<
  ResRoleGroup[],
  void,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getRoleGroups`, getRoleGroupsThunk);

export const createRole = createAsyncThunk<
  void,
  RoleFormValues,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/createRole`, createRoleThunk);

export const updateRole = createAsyncThunk<
  void,
  RoleFormValues,
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/updateRole`, updateRoleThunk);

export const deleteRole = createAsyncThunk<void, Key[], AsyncThunkConfig>(
  `${SETTINGS_SLICE}/deleteRole`,
  deleteRoleThunk,
);
