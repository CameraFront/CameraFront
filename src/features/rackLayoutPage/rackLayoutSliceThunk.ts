import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { AsyncThunkConfig, KnownError } from '@/app/store';
import { EVENTS_PATH } from '@/features/eventsPage/eventsSliceThunk';
import { ResUnhandledEventDetailsList } from '@/features/eventsPage/types';
import { ResNodeDeviceDetails } from '@/features/topologyPage/types';
import { ResTopologyTreeNode } from '@/types/common';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import { ResRackLayoutContent } from './types';

const RACK_LAYOUT_PATH = 'rack';
const RACK_LAYOUT_EDITOR_PATH = 'rackEditor';

export const getWholeDeviceTreeThunk: AsyncThunkPayloadCreator<
  ResTopologyTreeNode[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  try {
    const res = await customFetch.post(`${RACK_LAYOUT_PATH}/listRackTree.do`);

    return res.data.response.treeList;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error)) {
      return checkForUnauthorizedResponse(error, thunkAPI);
    }

    return error;
  }
};

export const createRackLayoutNodeThunk: AsyncThunkPayloadCreator<
  void,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const {
    tree: { selectedBranch },
  } = thunkAPI.getState().rackLayout;
  if (!selectedBranch) throw new Error('노드가 선택되지 않았습니다.');

  const body = {
    rackNm: '새 랙실장도',
    managementCd: selectedBranch.key,
  };

  try {
    await customFetch.post(`${RACK_LAYOUT_EDITOR_PATH}/createRack.do`, body);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};

export const deleteRackLayoutNodeThunk: AsyncThunkPayloadCreator<
  void,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const {
    tree: { selectedBranch },
  } = thunkAPI.getState().rackLayout;
  if (!selectedBranch) throw new Error('노드가 선택되지 않았습니다.');

  const body = {
    key: selectedBranch.key,
  };

  try {
    await customFetch.post(`${RACK_LAYOUT_EDITOR_PATH}/deleteRack.do`, body);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};
export const updateRackLayoutNameThunk: AsyncThunkPayloadCreator<
  void,
  string,
  AsyncThunkConfig
> = async (newName, thunkAPI) => {
  const {
    tree: { selectedBranch },
  } = thunkAPI.getState().rackLayout;
  if (!selectedBranch) throw new Error('노드가 선택되지 않았습니다.');

  const body = {
    key: selectedBranch.key,
    rackNm: newName,
  };

  try {
    await customFetch.post(`${RACK_LAYOUT_EDITOR_PATH}/updateRackNm.do`, body);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};

export const getNodeDeviceDetailsThunk: AsyncThunkPayloadCreator<
  ResNodeDeviceDetails,
  string,
  AsyncThunkConfig
> = async (deviceId, thunkAPI) => {
  const body = {
    deviceKey: deviceId,
  };

  try {
    const res = await customFetch.post(
      `${RACK_LAYOUT_PATH}/getDeviceDetail.do`,
      body,
    );

    return res.data.response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};

export const getUnhandledEventsByDeviceThunk: AsyncThunkPayloadCreator<
  ResUnhandledEventDetailsList,
  { page: number; deviceId: string },
  AsyncThunkConfig
> = async ({ page = 1, deviceId }, thunkAPI) => {
  const body = {
    page,
    deviceKey: deviceId,
  };

  try {
    const { data } = await customFetch.post(
      `${EVENTS_PATH}/listFault.do`,
      body,
    );

    return data.response;
  } catch (error) {
    if (axios.isAxiosError<KnownError>(error))
      return checkForUnauthorizedResponse(error, thunkAPI);

    return error;
  }
};
