import { AsyncThunkConfig, KnownError } from '@/app/store';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Dayjs } from 'dayjs';

import { SETTINGS_PATH } from '.';
import { ResLoginHistory, SETTINGS_SLICE } from '../types';

// 로그인 히스토리 조회
const getLoginHistoryThunk: AsyncThunkPayloadCreator<
  ResLoginHistory,
  { selectedDate?: Dayjs | null; page: number },
  AsyncThunkConfig
> = async ({ page = 1, selectedDate }, thunkAPI) => {
  const body = {
    page,
    ...(selectedDate && { fromDate: selectedDate.format('YYYY-MM-DD') }),
    ...(selectedDate && { toDate: selectedDate.format('YYYY-MM-DD') }),
  };

  try {
    const { data } = await customFetch.post(
      `${SETTINGS_PATH}/listLoginHist.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getLoginHistory = createAsyncThunk<
  ResLoginHistory,
  { selectedDate?: Dayjs | null; page: number },
  AsyncThunkConfig
>(`${SETTINGS_SLICE}/getLoginHistories`, getLoginHistoryThunk);
