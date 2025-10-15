import { ConfigPerfSliceState } from './types';

export const initialState: ConfigPerfSliceState = {
  isLoading: false,
  selectedTab: 'config',
  selectedBranch: null,
  resDeviceTree: [],
  config: {
    search: '',
    resDeviceList: null,
    resDeviceDetails: null,
    resPortList: null,
  },
  perf: {
    search: '',
    resDeviceList: null,
    resUsageTop5: null,
    resDeviceDetails: null,
  },
};
