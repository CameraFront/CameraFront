import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import axios from 'axios';
import { AsyncThunkConfig } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { addUserSessionStorage } from '@/utils/clientStorages';

import { Credentials, GlobalState, ResConfig } from './types';

export const signinThunk: AsyncThunkPayloadCreator<
  GlobalState['user'],
  Credentials,
  AsyncThunkConfig
> = async (credentials, thunkAPI) => {
  try {
    const res = await customFetch.post('/login.do', credentials);

    addUserSessionStorage(res.data.response);

    return res.data.response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};
export const signoutThunk: AsyncThunkPayloadCreator<
  void,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  try {
    await customFetch.post('/logout.do');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};

export const getAppConfigThunk: AsyncThunkPayloadCreator<
  ResConfig,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().global;
    if (!user) return;

    const { data } = await customFetch.post('/configuration/getUserConf.do');
    return data.response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};

export const updateDarkModeOptionThunk: AsyncThunkPayloadCreator<
  void,
  boolean,
  AsyncThunkConfig
> = async (isDarkMode, thunkAPI) => {
  const { user } = thunkAPI.getState().global;
  if (!user) return;

  try {
    await customFetch.post(`dashboardEditor/updateDashboardColor.do`, {
      dashboardId: user.dashboard.dashboardId,
      colorYn: isDarkMode ? 1 : 0,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};

export const updateAudibleOptionThunk: AsyncThunkPayloadCreator<
  void,
  boolean,
  AsyncThunkConfig
> = async (isAudibleOn, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().global;
    if (!user) return;

    await customFetch.post(`dashboard/updateAudibleYn.do`, {
      userId: user.login.userId,
      audibleYn: isAudibleOn ? 1 : 0,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};

export const updateAlarmPopupOptionThunk: AsyncThunkPayloadCreator<
  void,
  boolean,
  AsyncThunkConfig
> = async (isAlarmPopupOn, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().global;
    if (!user) return;

    await customFetch.post(`dashboard/updateAlarmPopupYn.do`, {
      userId: user.login.userId,
      alarmPopupYn: isAlarmPopupOn ? 1 : 0,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};

export const updateAlarmOptionThunk: AsyncThunkPayloadCreator<
  void,
  boolean,
  AsyncThunkConfig
> = async (isAlarmOn, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().global;
    if (!user) return;

    await customFetch.post(`dashboard/updateAlarmYn.do`, {
      userId: user.login.userId,
      alarmYn: isAlarmOn ? 1 : 0,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};
