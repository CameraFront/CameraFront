import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

import { initialState } from './initialState';
import {
  createBusinessUnit,
  createDevice,
  createRole,
  createSensor,
  createStation,
  createTerminal,
  createUser,
  deleteBusinessUnits,
  deleteRole,
  deleteStations,
  deleteUser,
  getBusinessUnit,
  getBusinessUnits,
  getCameraTypes,
  getDevice,
  getDevices,
  getDeviceType,
  getDeviceTypeCategories,
  getDeviceTypes,
  getEvent,
  getEvents,
  getLoginHistory,
  getRole,
  getRoleGroups,
  getRoles,
  getSensor,
  getSensors,
  getStation,
  getStations,
  getSwitches,
  getSwitchPortKeyList,
  getTerminal,
  getTerminals,
  getUser,
  getUsers,
  updateBusinessUnit,
  updateDevice,
  updateDeviceType,
  updateEvent,
  updateRole,
  updateSensor,
  updateStation,
  updateTerminal,
  updateUser,
} from './settingsSliceThunks';
import {
  createDeviceImage,
  deleteDeviceImages,
  getDeviceImage,
  getDeviceImages,
  updateDeviceImage,
} from './settingsSliceThunks/deviceImagesThunk';
import {
  getThreshold,
  getThresholds,
  updateThreshold,
} from './settingsSliceThunks/thresholdsThunk';
import { SETTINGS_SLICE } from './types';

export const settingsSlice = createSlice({
  name: SETTINGS_SLICE,
  initialState,
  reducers: {
    setSelectedTab: (state, { payload }) => {
      state.selectedTab = payload;
    },
    resetTabState: state => {
      const { isLoading, selectedTab, ...tabs } = initialState;
      state = {
        isLoading: state.isLoading,
        selectedTab: state.selectedTab,
        ...tabs,
      };
    },
    resetState: state => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    /** Business units */

    builder.addCase(getBusinessUnits.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getBusinessUnits.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.businessUnitsTab.businessUnits = payload;
    });
    builder.addCase(getBusinessUnits.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getBusinessUnit.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getBusinessUnit.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.businessUnitsTab.businessUnit = payload;
    });
    builder.addCase(getBusinessUnit.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(createBusinessUnit.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(createBusinessUnit.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 새 지역본부를 추가했습니다.');
    });
    builder.addCase(createBusinessUnit.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateBusinessUnit.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateBusinessUnit.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 지역본부를 수정했습니다.');
    });
    builder.addCase(updateBusinessUnit.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(deleteBusinessUnits.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(deleteBusinessUnits.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 지역본부를 삭제했습니다.');
    });
    builder.addCase(deleteBusinessUnits.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });

    /** Stations */

    builder.addCase(getStations.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getStations.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.stationsTab.stations = payload;
    });
    builder.addCase(getStations.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getStation.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getStation.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.stationsTab.station = payload;
    });
    builder.addCase(getStation.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(createStation.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(createStation.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 새 역사를 데이터를 추가했습니다.');
    });
    builder.addCase(createStation.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateStation.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateStation.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 역사를 수정했습니다.');
    });
    builder.addCase(updateStation.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(deleteStations.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(deleteStations.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 역사를 삭제했습니다.');
    });
    builder.addCase(deleteStations.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });

    /** Device types */

    builder.addCase(getDeviceTypes.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getDeviceTypes.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.deviceTypesTab.deviceTypes = payload;
    });
    builder.addCase(getDeviceTypes.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getDeviceType.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getDeviceType.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.deviceTypesTab.deviceType = payload;
    });
    builder.addCase(getDeviceType.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getDeviceTypeCategories.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getDeviceTypeCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.meta.arg.level === 1) {
        state.deviceTypesTab.lv1Categories = action.payload;
      } else if (action.meta.arg.level === 2) {
        state.deviceTypesTab.lv2Categories = action.payload;
      }
    });
    builder.addCase(getDeviceTypeCategories.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateDeviceType.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateDeviceType.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 장비종류를 수정했습니다.');
    });
    builder.addCase(updateDeviceType.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });

    /** Device images */

    builder.addCase(getDeviceImages.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getDeviceImages.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.deviceImagesTab.deviceImages = payload;
    });
    builder.addCase(getDeviceImages.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getDeviceImage.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getDeviceImage.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.deviceImagesTab.deviceImage = payload;
    });
    builder.addCase(getDeviceImage.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(createDeviceImage.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(createDeviceImage.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      message.success('성공적으로 새 장비이미지를 추가했습니다.');
    });
    builder.addCase(createDeviceImage.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateDeviceImage.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateDeviceImage.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      message.success('성공적으로 해당 장비이미지를 수정했습니다.');
    });
    builder.addCase(updateDeviceImage.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(deleteDeviceImages.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(deleteDeviceImages.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      message.success('성공적으로 해당 장비이미지들을 삭제했습니다.');
    });
    builder.addCase(deleteDeviceImages.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });

    /** Devices */

    builder.addCase(getDevices.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getDevices.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.devicesTab.devices = payload;
    });
    builder.addCase(getDevices.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getDevice.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getDevice.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.devicesTab.device = payload;
    });
    builder.addCase(getDevice.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(createDevice.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(createDevice.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 새 장비를 추가했습니다.');
    });
    builder.addCase(createDevice.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateDevice.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateDevice.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 장비를 수정했습니다.');
    });
    builder.addCase(updateDevice.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });

    /** Terminals */

    builder.addCase(getTerminals.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getTerminals.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.terminalsTab.terminals = payload;
    });
    builder.addCase(getTerminals.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getTerminal.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getTerminal.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.terminalsTab.terminal = payload;
    });
    builder.addCase(getTerminal.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(createTerminal.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(createTerminal.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 새 단말을 추가했습니다.');
    });
    builder.addCase(createTerminal.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateTerminal.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateTerminal.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 단말을 수정했습니다.');
    });
    builder.addCase(updateTerminal.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getCameraTypes.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getCameraTypes.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.terminalsTab.cameraTypes = payload;
    });
    builder.addCase(getCameraTypes.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getSwitches.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getSwitches.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.terminalsTab.switches = payload;
    });
    builder.addCase(getSwitches.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getSwitchPortKeyList.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getSwitchPortKeyList.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.terminalsTab.switchPortKeys = payload;
    });
    builder.addCase(getSwitchPortKeyList.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });

    /** Sensors */

    builder.addCase(getSensors.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getSensors.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.sensorsTab.sensors = payload;
    });
    builder.addCase(getSensors.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getSensor.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getSensor.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.sensorsTab.sensor = payload;
    });
    builder.addCase(getSensor.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(createSensor.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(createSensor.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 새 센서를 추가했습니다.');
    });
    builder.addCase(createSensor.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateSensor.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateSensor.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 센서를 수정했습니다.');
    });
    builder.addCase(updateSensor.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });

    /** Roles */

    builder.addCase(getRoles.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getRoles.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.rolesTab.roles = payload;
    });
    builder.addCase(getRoles.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getRole.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getRole.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.rolesTab.role = payload;
    });
    builder.addCase(getRole.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getRoleGroups.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getRoleGroups.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.rolesTab.roleGroups = payload;
    });
    builder.addCase(getRoleGroups.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(createRole.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(createRole.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 새 권한를 추가했습니다.');
    });
    builder.addCase(createRole.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateRole.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateRole.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 권한를 수정했습니다.');
    });
    builder.addCase(updateRole.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(deleteRole.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(deleteRole.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 권한를 삭제했습니다.');
    });
    builder.addCase(deleteRole.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });

    /** Users */

    builder.addCase(getUsers.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.usersTab.users = payload;
    });
    builder.addCase(getUsers.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.usersTab.user = payload;
    });
    builder.addCase(getUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(createUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(createUser.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 새 사용자를 추가했습니다.');
    });
    builder.addCase(createUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateUser.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 사용자를 수정했습니다.');
    });
    builder.addCase(updateUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(deleteUser.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(deleteUser.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 사용자를 삭제했습니다.');
    });
    builder.addCase(deleteUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });

    /** Thresholds */

    builder.addCase(getThresholds.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getThresholds.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.thresholdsTab.thresholds = payload;
    });
    builder.addCase(getThresholds.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getThreshold.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getThreshold.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.thresholdsTab.threshold = payload;
    });
    builder.addCase(getThreshold.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateThreshold.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateThreshold.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 임계치를 수정했습니다.');
    });
    builder.addCase(updateThreshold.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });

    /** Events */

    builder.addCase(getEvents.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getEvents.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.eventsTab.events = payload;
    });
    builder.addCase(getEvents.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(getEvent.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getEvent.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.eventsTab.event = payload;
    });
    builder.addCase(getEvent.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
    builder.addCase(updateEvent.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(updateEvent.fulfilled, state => {
      state.isLoading = false;
      message.success('성공적으로 해당 장애를 수정했습니다.');
    });
    builder.addCase(updateEvent.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });

    /** Login history */

    builder.addCase(getLoginHistory.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getLoginHistory.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.loginHistoryTab.loginHistory = payload;
    });
    builder.addCase(getLoginHistory.rejected, (state, { payload }) => {
      state.isLoading = false;
      if (payload) message.error(payload.message);
    });
  },
});

export const { resetState, resetTabState, setSelectedTab } =
  settingsSlice.actions;
export default settingsSlice.reducer;
