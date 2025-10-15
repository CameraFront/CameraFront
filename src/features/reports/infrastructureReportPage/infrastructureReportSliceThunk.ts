import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { AsyncThunkConfig, KnownError } from '@/app/store';
import { EVENTS_PATH } from '@/features/eventsPage/eventsSliceThunk';
import { ResTreeNode } from '@/types/common';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { downloadFile, trimTreeByDepth } from '@/utils/helpers';
import { ReportRequestBody } from './types';

export const REPORTS_PATH = '/report';
export const REPORT_BASE_URL =
  import.meta.env.VITE_APP_REPORTS_API + import.meta.env.VITE_APP_API_PREFIX;

export const getWholeDeviceTreeThunk: AsyncThunkPayloadCreator<
  ResTreeNode[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const body = {};

  try {
    const { data } = await customFetch.post(
      `${EVENTS_PATH}/listDeviceTree.do`,
      body,
    );

    return [trimTreeByDepth(data.response.treeList[0], 0, 2)];
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const downloadReportThunk: AsyncThunkPayloadCreator<
  void,
  Omit<ReportRequestBody, 'fileType'> & { fileType: 'pdf' | 'excel' },
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = {
    USERDEPT: formValues.department,
    USERNAME: formValues.reporter,
    REPORTPURPOSE: formValues.purpose,
    FILENAME: formValues.fileName,
    TYPE: formValues.fileType,
    MNGOFCCD: formValues.stationId,
    DB_TYPE: formValues.reportType,
    ...(formValues.selectedRange && {
      STARTDATE: formValues.selectedRange[0]
        .startOf('day')
        .format('YYYY/MM/DD HH:mm:ss'),
      ENDDATE: formValues.selectedRange[1]
        .startOf('day')
        .format('YYYY/MM/DD HH:mm:ss'),
    }),
    ...(formValues.selectedDate && {
      DATE: formValues.selectedDate
        .startOf('day')
        .format('YYYY/MM/DD HH:mm:ss'),
    }),
    ...(formValues.selectedDevice && {
      DKEY: formValues.selectedDevice.toString(),
    }),
  };

  try {
    const { data } = await customFetch.post(`${REPORTS_PATH}/export`, body, {
      baseURL: REPORT_BASE_URL,
      responseType: 'blob',
    });

    const extension = formValues.fileType === 'pdf' ? 'pdf' : 'xlsx';
    downloadFile(data, formValues.fileName, extension);
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};

export const getReportAsHtmlThunk: AsyncThunkPayloadCreator<
  string,
  Omit<ReportRequestBody, 'fileType'> & { fileType: 'html' },
  AsyncThunkConfig
> = async (formValues, thunkAPI) => {
  const body = {
    USERDEPT: formValues.department,
    USERNAME: formValues.reporter,
    REPORTPURPOSE: formValues.purpose,
    FILENAME: formValues.fileName,
    TYPE: formValues.fileType,
    MNGOFCCD: formValues.stationId,
    DB_TYPE: formValues.reportType,
    ...(formValues.selectedRange && {
      STARTDATE: formValues.selectedRange[0]
        .startOf('day')
        .format('YYYY/MM/DD HH:mm:ss'),
      ENDDATE: formValues.selectedRange[1]
        .startOf('day')
        .format('YYYY/MM/DD HH:mm:ss'),
    }),
    ...(formValues.selectedDate && {
      DATE: formValues.selectedDate
        .startOf('day')
        .format('YYYY/MM/DD HH:mm:ss'),
    }),
    ...(formValues.selectedDevice && {
      DKEY: formValues.selectedDevice.toString(),
    }),
  };

  try {
    const { data } = await customFetch.post(`${REPORTS_PATH}/export`, body, {
      baseURL: REPORT_BASE_URL,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};
