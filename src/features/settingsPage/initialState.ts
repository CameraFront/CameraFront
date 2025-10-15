import { SettingsTab } from '@/types/enum';
import { SettingsSliceState } from './types';

export const initialState: SettingsSliceState = {
  isLoading: false,
  selectedTab: SettingsTab.ManagementsTab,
  businessUnitsTab: {
    businessUnits: null,
    businessUnit: null,
  },
  stationsTab: {
    stations: null,
    station: null,
  },
  deviceTypesTab: {
    deviceTypes: null,
    deviceType: null,
    lv1Categories: null,
    lv2Categories: null,
  },
  deviceImagesTab: {
    deviceImages: null,
    deviceImage: null,
  },
  devicesTab: {
    devices: null,
    device: null,
  },
  terminalsTab: {
    terminals: null,
    terminal: null,
    cameraTypes: null,
    switches: null,
    switchPortKeys: null,
  },
  sensorsTab: {
    sensors: null,
    sensor: null,
  },
  rolesTab: {
    roles: null,
    role: null,
    roleGroups: null,
  },
  usersTab: {
    users: null,
    user: null,
  },
  thresholdsTab: {
    thresholds: null,
    threshold: null,
  },
  eventsTab: {
    events: null,
    event: null,
  },
  loginHistoryTab: {
    loginHistory: null,
    loginHistoryRecord: null,
  },
};
