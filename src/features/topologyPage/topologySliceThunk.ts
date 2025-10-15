import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { AsyncThunkConfig, KnownError } from '@/app/store';
import { EVENTS_PATH } from '@/features/eventsPage/eventsSliceThunk';
import { ResUnhandledEventDetailsList } from '@/features/eventsPage/types';
import { TOPOLOGY_EDIT_PATH, TOPOLOGY_PATH } from '@/services/api/apiPaths';
import { TopologyPathOfBranch } from '@/types/common';
import { ArrayElement } from '@/types/extra';
import customFetch, { checkForUnauthorizedResponse } from '@/utils/axios';
import {
  ResDeviceOption,
  ResDeviceTypeOption,
  ResNodeDeviceDetails,
  ResPing,
  ResSnmp,
} from './types';

export const updateTopologyContentThunk: AsyncThunkPayloadCreator<
  void,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const {
    tree: { selectedTreeNode },
    content: { nodesSaved, edgesSaved },
  } = thunkAPI.getState().topology;
  if (!selectedTreeNode) throw new Error('노드가 선택되지 않았습니다.');

  const body = {
    key: selectedTreeNode.key,
    // key: 1001,
    dataNode: nodesSaved,
    edgeNode: edgesSaved,
  };

  try {
    await customFetch.post(`${TOPOLOGY_EDIT_PATH}/updateTopologyMap.do`, body);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};

export const createTopologyNodeThunk: AsyncThunkPayloadCreator<
  void,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const {
    tree: { selectedTreeNode },
  } = thunkAPI.getState().topology;
  if (!selectedTreeNode) throw new Error('노드가 선택되지 않았습니다.');

  const body = {
    topologyNm: '새 토폴로지맵',
    managementCd: selectedTreeNode.key,
  };

  try {
    await customFetch.post(`${TOPOLOGY_EDIT_PATH}/createTopologyMap.do`, body);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};

export const deleteTopologyNodeThunk: AsyncThunkPayloadCreator<
  void,
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const {
    tree: { selectedTreeNode },
  } = thunkAPI.getState().topology;
  if (!selectedTreeNode) throw new Error('노드가 선택되지 않았습니다.');

  const body = {
    key: selectedTreeNode.key,
  };

  try {
    await customFetch.post(`${TOPOLOGY_EDIT_PATH}/deleteTopologyMap.do`, body);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};
export const updateTopologyNameThunk: AsyncThunkPayloadCreator<
  void,
  string,
  AsyncThunkConfig
> = async (newName, thunkAPI) => {
  const {
    tree: { selectedTreeNode },
  } = thunkAPI.getState().topology;
  if (!selectedTreeNode) throw new Error('노드가 선택되지 않았습니다.');

  const body = {
    key: selectedTreeNode.key,
    topologyNm: newName,
  };

  try {
    await customFetch.post(`${TOPOLOGY_EDIT_PATH}/updateTopologyNm.do`, body);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};

export const getDeviceTypeOptionsThunk: AsyncThunkPayloadCreator<
  ResDeviceTypeOption[],
  void,
  AsyncThunkConfig
> = async (_, thunkAPI) => {
  const body = {};

  try {
    const res = await customFetch.post(
      `${TOPOLOGY_EDIT_PATH}/listDeviceKind.do`,
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

export const getDeviceOptionsThunk: AsyncThunkPayloadCreator<
  ResDeviceOption[],
  {
    deviceType: number;
    parentNode: ArrayElement<TopologyPathOfBranch>;
  },
  AsyncThunkConfig
> = async ({ deviceType, parentNode }, thunkAPI) => {
  const body = {
    ...(parentNode.type === 'hq' && { managementCd: parentNode.key }),
    ...(parentNode.type === 'st' && { stationCd: parentNode.key }),
    deviceKind: deviceType,
  };

  try {
    const res = await customFetch.post(
      `${TOPOLOGY_EDIT_PATH}/listDevice.do`,
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

export const getNodeDeviceDetailsThunk: AsyncThunkPayloadCreator<
  ResNodeDeviceDetails,
  number,
  AsyncThunkConfig
> = async (deviceId, thunkAPI) => {
  const body = {
    deviceKey: deviceId,
  };

  try {
    const res = await customFetch.post(
      `${TOPOLOGY_PATH}/getDeviceDetail.do`,
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

export const checkPingThunk: AsyncThunkPayloadCreator<
  ResPing,
  number,
  AsyncThunkConfig
> = async (deviceId, thunkAPI) => {
  const body = {
    deviceKey: deviceId,
  };

  try {
    const res = await customFetch.post(`${TOPOLOGY_PATH}/doPing.do`, body);

    return res.data.response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return checkForUnauthorizedResponse(error.response?.data, thunkAPI);
    }
    return error;
  }
};

export const checkSnmpThunk: AsyncThunkPayloadCreator<
  ResSnmp,
  number,
  AsyncThunkConfig
> = async (deviceId, thunkAPI) => {
  const body = {
    deviceKey: deviceId,
  };

  try {
    const res = await customFetch.post(`${TOPOLOGY_PATH}/doSnmp.do`, body);

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
  { page: number; deviceId: number },
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
