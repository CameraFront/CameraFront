import { message } from 'antd';
import {
  AnyAction,
  ThunkAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { AppRootState, AsyncThunkConfig } from '@/app/store';
import {
  ResNumOfEvents,
  ResNumOfEventsByDate,
} from '@/features/dashboardPage/types';
import { ResTreeNode } from '@/types/common';
import { findParentPath } from '@/utils/helpers';
import {
  getDeviceEventRankingsByRangeThunk,
  getEventCommentByIdThunk,
  getEventDetailsListByRangeThunk,
  getEventsOfDayByRangeThunk,
  getNumOfEventsByRangeThunk,
  getRecentEventsThunk,
  getUnhandledEventListThunk,
  getUnhandledNumOfEventsThunk,
  getWholeDeviceTreeThunk,
  updateEventCommentThunk,
} from './eventsSliceThunk';
import { initialState } from './initialState';
import {
  EventCommentFormValues,
  ResDeviceEventRank,
  ResEventComment,
  ResEventDetailsList,
  ResUnhandledEventDetailsList,
} from './types';

export const EVENTS_SLICE = 'events';

// 최초 디바이스 트리를 가져오고, 첫번째 노드를 선택한 후, 해당 노드의 장애현황탭 데이터를 가져온다.
export const initEventsPage =
  (): ThunkAction<void, AppRootState, undefined, AnyAction> =>
  async (dispatch, getState) => {
    await dispatch(getWholeDeviceTree());

    const {
      tree: { resDeviceTree },
    } = getState().events;
    const { key, realKey, type } = resDeviceTree[0];
    dispatch(setSelectedBranch({ key, realKey, type }));

    dispatch(getUnhandledNumOfEvents());
    dispatch(getRecentEvents());
    dispatch(getUnhandledEventList({ page: 1 }));
  };

// 전체 디바이스 트리를 가져오는 비동기 함수
export const getWholeDeviceTree = createAsyncThunk<
  ResTreeNode[],
  void,
  AsyncThunkConfig
>(`${EVENTS_SLICE}/getWholeDeviceTree`, getWholeDeviceTreeThunk);

// 처리되지 않은 장애 개수를 가져오는 비동기 함수
export const getUnhandledNumOfEvents = createAsyncThunk<
  ResNumOfEvents,
  void,
  AsyncThunkConfig
>(`${EVENTS_SLICE}/getUnhandledNumOfEvents`, getUnhandledNumOfEventsThunk);

// 지난 일주일간 일간 장애 리스트를 가져오는 비동기 함수
export const getRecentEvents = createAsyncThunk<
  ResNumOfEventsByDate[],
  void,
  AsyncThunkConfig
>(`${EVENTS_SLICE}/getRecentEvents`, getRecentEventsThunk);

// 처리되지 않은 장애 리스트를 가져오는 비동기 함수
export const getUnhandledEventList = createAsyncThunk<
  ResUnhandledEventDetailsList,
  { page: number },
  AsyncThunkConfig
>(`${EVENTS_SLICE}/getUnhandledEventList`, getUnhandledEventListThunk);

// 지정된 기간동안의 장애 개수를 가져오는 비동기 함수
export const getNumOfEventsByRange = createAsyncThunk<
  ResNumOfEvents,
  void,
  AsyncThunkConfig
>(`${EVENTS_SLICE}/getNumOfEventsByRange`, getNumOfEventsByRangeThunk);

// 지정된 기간동안의 일간 장애 리스트를 가져오는 비동기 함수`
export const getEventsOfDayByRange = createAsyncThunk<
  ResNumOfEventsByDate[],
  void,
  AsyncThunkConfig
>(`${EVENTS_SLICE}/getEventsOfDayByRange`, getEventsOfDayByRangeThunk);

// 지정된 기간동안의 장애 발생 장비 TOP5를 가져오는 비동기 함수
export const getDeviceEventRankingsByRange = createAsyncThunk<
  ResDeviceEventRank[],
  void,
  AsyncThunkConfig
>(
  `${EVENTS_SLICE}/getDeviceEventRankingsByRange`,
  getDeviceEventRankingsByRangeThunk,
);

// 지정된 기간동안의 장애 상세 리스트를 가져오는 비동기 함수
export const getEventDetailsListByRange = createAsyncThunk<
  ResEventDetailsList,
  { page: number },
  AsyncThunkConfig
>(
  `${EVENTS_SLICE}/getEventDetailsListByRange`,
  getEventDetailsListByRangeThunk,
);

// 지정된 장애 코멘트를 가져오는 비동기 함수
export const getEventCommentById = createAsyncThunk<
  ResEventComment,
  number,
  AsyncThunkConfig
>(`${EVENTS_SLICE}/getEventCommentById`, getEventCommentByIdThunk);

// 지정된 장애 코멘트를 수정하는 비동기 함수
export const updateEventComment = createAsyncThunk<
  void,
  EventCommentFormValues,
  AsyncThunkConfig
>(`${EVENTS_SLICE}/updateEventComment`, updateEventCommentThunk);

export const eventsSlice = createSlice({
  name: EVENTS_SLICE,
  initialState,
  reducers: {
    setSelectedTab: (state, { payload }) => {
      state.selectedTab = payload;
      state.conditions = initialState.conditions;
    },
    setSelectedBranch: (state, { payload }) => {
      state.tree.selectedBranch = payload;
      // @ts-ignore
      state.tree.pathOfSelectedBranch = findParentPath(
        payload.key,
        state.tree.resDeviceTree,
      );
    },
    setCheckedEventTypes: (state, { payload }) => {
      state.conditions.checkedEventTypes = payload;
    },
    setSearch: (state, { payload }) => {
      state.conditions.search = payload;
    },
    setSelectedRange: (state, { payload }) => {
      state.conditions.selectedRange = payload;
    },
    resetEventComment: state => {
      state.eventHistory.commentInfo = null;
    },
    resetState: state => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder.addCase(getWholeDeviceTree.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getWholeDeviceTree.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.tree.resDeviceTree = payload;
    });
    builder.addCase(getWholeDeviceTree.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getUnhandledNumOfEvents.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getUnhandledNumOfEvents.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.eventStatus.numOfEvents = payload;
    });
    builder.addCase(getUnhandledNumOfEvents.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getRecentEvents.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getRecentEvents.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.eventStatus.eventsByDate = payload;
    });
    builder.addCase(getRecentEvents.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getUnhandledEventList.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getUnhandledEventList.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.eventStatus.eventDetailsList = payload;
    });
    builder.addCase(getUnhandledEventList.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getNumOfEventsByRange.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getNumOfEventsByRange.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.eventHistory.numOfEvents = payload;
    });
    builder.addCase(getNumOfEventsByRange.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getEventsOfDayByRange.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getEventsOfDayByRange.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.eventHistory.eventsByDate = payload;
    });
    builder.addCase(getEventsOfDayByRange.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getEventDetailsListByRange.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(
      getEventDetailsListByRange.fulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        state.eventHistory.eventDetailsList = payload;
      },
    );
    builder.addCase(
      getEventDetailsListByRange.rejected,
      (state, { payload }) => {
        state.isLoading = false;
        if (payload) message.error(payload.message);
      },
    );
    builder.addCase(getDeviceEventRankingsByRange.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(
      getDeviceEventRankingsByRange.fulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        state.eventHistory.deviceEventRankings = payload;
      },
    );
    builder.addCase(
      getDeviceEventRankingsByRange.rejected,
      (state, { payload }) => {
        state.isLoading = false;
        if (payload) message.error(payload.message);
      },
    );
    builder.addCase(getEventCommentById.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getEventCommentById.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.eventHistory.commentInfo = payload;
    });
    builder.addCase(getEventCommentById.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateEventComment.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateEventComment.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      message.success('장애 코멘트를 수정했습니다.');
    });
    builder.addCase(updateEventComment.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
  },
});

export const {
  resetState,
  resetEventComment,
  setSelectedTab,
  setSelectedBranch,
  setSearch,
  setCheckedEventTypes,
  setSelectedRange,
} = eventsSlice.actions;
export default eventsSlice.reducer;
