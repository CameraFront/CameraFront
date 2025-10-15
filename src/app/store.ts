import { AxiosError } from 'axios';
import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import configPerfSlice from '@/features/configPerfPage/configPerfSlice';
import dashboardSlice from '@/features/dashboardPage/dashboardSlice';
import eventsSlice from '@/features/eventsPage/eventsSlice';
import globalSlice from '@/features/global/globalSlice';
import rackLayoutSlice from '@/features/rackLayoutPage/rackLayoutSlice';
import railwayMapSlice from '@/features/railwayMapPage/railwayMapSlice';
import facilityReportSlice from '@/features/reports/facilityReportPage/facilityReportSlice';
import infrastructureReportSlice from '@/features/reports/infrastructureReportPage/infrastructureReportSlice';
import settingsSlice from '@/features/settingsPage/settingsSlice';
import topologySlice from '@/features/topologyPage/topologySlice';
import { baseApi } from '@/services/api/baseApi';
import { queryErrorHandler } from './queryErrorHandler';

// 리듀서를 합치는 부분
const appReducer = combineReducers({
  global: globalSlice,
  dashboard: dashboardSlice,
  topology: topologySlice,
  configPerf: configPerfSlice,
  events: eventsSlice,
  rackLayout: rackLayoutSlice,
  settings: settingsSlice,
  infrastructureReport: infrastructureReportSlice,
  facilityReport: facilityReportSlice,
  railwayMap: railwayMapSlice,
  [baseApi.reducerPath]: baseApi.reducer,
});

// 로그아웃시 state 초기화
const reducerProxy = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction,
) => {
  if (action.type === 'global/signout/pending') {
    return appReducer(undefined, { type: undefined });
  }

  return appReducer(state, action);
};

// 스토어 생성
export const store = configureStore({
  reducer: reducerProxy,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware,
      queryErrorHandler,
    ),
});

setupListeners(store.dispatch);

// 타입 정의
export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 비동기 액션 타입 정의
export type AsyncThunkConfig = {
  state: AppRootState;
  dispatch: AppDispatch;
  extra?: unknown;
  rejectValue: AxiosError<KnownError>;
};

// 에러 타입 정의
export interface KnownError {
  message: string;
  response: null | any;
  status: number;
}
