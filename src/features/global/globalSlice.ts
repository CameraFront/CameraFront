import { AsyncThunkConfig } from '@/app/store';
import { removeUserFromSessionStorage } from '@/utils/clientStorages';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

import {
  getAppConfigThunk,
  signinThunk,
  signoutThunk,
  updateAlarmOptionThunk,
  updateAlarmPopupOptionThunk,
  updateAudibleOptionThunk,
  updateDarkModeOptionThunk,
} from './globalSliceThunk';
import { initialState } from './initialState';
import { Credentials, GlobalState, ResConfig } from './types';

export const GLOBAL_SLICE = 'global';

// 로그인
export const signin = createAsyncThunk<
  GlobalState['user'],
  Credentials,
  AsyncThunkConfig
>(`${GLOBAL_SLICE}/signin`, signinThunk);

// 로그아웃
export const signout = createAsyncThunk<void, void, AsyncThunkConfig>(
  `${GLOBAL_SLICE}/signout`,
  signoutThunk,
);

// 앱 설정 가져오기
export const getAppConfig = createAsyncThunk<ResConfig, void, AsyncThunkConfig>(
  `${GLOBAL_SLICE}/getAppConfig`,
  getAppConfigThunk,
);

// 다크모드 옵션 업데이트
export const updateDarkModeOption = createAsyncThunk<
  void,
  boolean,
  AsyncThunkConfig
>(`${GLOBAL_SLICE}/updateDarkModeOption`, updateDarkModeOptionThunk);

// 가청알람 옵션 업데이트
export const updateAudibleOption = createAsyncThunk<
  void,
  boolean,
  AsyncThunkConfig
>(`${GLOBAL_SLICE}/updateAudibleOption`, updateAudibleOptionThunk);

// 긴급알람 팝업 옵션 업데이트
export const updateAlarmPopupOption = createAsyncThunk<
  void,
  boolean,
  AsyncThunkConfig
>(`${GLOBAL_SLICE}/updateAlarmPopupOption`, updateAlarmPopupOptionThunk); 

// 알람 옵션 업데이트
export const updateAlarmOption = createAsyncThunk<
  void,
  boolean,
  AsyncThunkConfig
>(`${GLOBAL_SLICE}/updateAlarmOption`, updateAlarmOptionThunk);

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setMenuCollapsed(state, { payload }) {
      state.menuSider.isCollapsed = payload;
    },
    setSelectedMenu(state, { payload }) {
      state.menuSider.selectedMenu = payload;
    },
    setIsSettingsOpen(state, { payload }) {
      state.isSettingsOpen = payload;
    },
    setUser(state, { payload }) {
      state.user = payload;
    },
    setIsDarkMode(state, { payload }) {
      state.isDarkMode = payload;
    },
    setIsAudibleOn(state, { payload }) {
      state.isAudibleOn = payload;
    },
    setIsAlarmPopupOn(state, { payload }) {
      state.isAlarmPopupOn = payload;
    },
    setIsAlarmOn(state, { payload }) {
      state.isAlarmOn = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(signin.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(signin.fulfilled, (state, { payload }) => {
      state.isLoading = false;

      if (payload) {
        state.user = payload;
        message.success(
          `${payload.login.userId}(${payload.login.userNm})님이 로그인했습니다.`,
        );
      }
    });
    builder.addCase(signin.rejected, state => {
      state.isLoading = false;
      message.error('로그인에 실패했습니다.');
    });
    builder.addCase(signout.pending, state => {
      state.isLoading = true;
      state.user = null;
      removeUserFromSessionStorage();
    });
    builder.addCase(signout.fulfilled, state => {
      state.isLoading = false;
    });
    builder.addCase(signout.rejected, state => {
      state.isLoading = false;
    });
    builder.addCase(getAppConfig.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getAppConfig.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isDarkMode = !!payload.colorYn;
      state.isAudibleOn = !!payload.audibleYn;
      state.isAlarmPopupOn = !!payload.alarmPopupYn;
      state.isAlarmOn = !!payload.alarmYn;
      state.user = {
        ...state.user!,
        global: {
          colorYn: payload.colorYn,
          title: payload.title,
          topicType: payload.topicType,
        },
        dashboard: {
          dashboardId: payload.dashboardId,
        },
        login: {
          ...state.user!.login,
          audibleYn: payload.audibleYn,
          alarmPopupYn: payload.alarmPopupYn,
          alarmYn: payload.alarmYn,
        },
      };
    });
    builder.addCase(getAppConfig.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateDarkModeOption.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateDarkModeOption.fulfilled, (state, { meta }) => {
      state.isLoading = false;
      state.isDarkMode = meta.arg;
    });
    builder.addCase(updateDarkModeOption.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateAudibleOption.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateAudibleOption.fulfilled, (state, { meta }) => {
      state.isLoading = false;
      state.isAudibleOn = meta.arg;
    });
    builder.addCase(updateAudibleOption.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateAlarmPopupOption.fulfilled, (state, { meta }) => {
      state.isLoading = false;
      state.isAlarmPopupOn = meta.arg;
    });
    builder.addCase(updateAlarmPopupOption.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateAlarmOption.fulfilled, (state, { meta }) => {
      state.isLoading = false;
      state.isAlarmOn = meta.arg;
    });
    builder.addCase(updateAlarmOption.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
  },
});

export const {
  setMenuCollapsed,
  setSelectedMenu,
  setIsSettingsOpen,
  setUser,
  setIsDarkMode,
  setIsAudibleOn,
  setIsAlarmPopupOn,
  setIsAlarmOn,
} = globalSlice.actions;
export default globalSlice.reducer;
