import { RANGE_FROM_7DAYS } from '@/config';
import { InfrastructureReportSliceState } from './types';

export const initialState: InfrastructureReportSliceState = {
  isLoading: false,
  selectedTab: 'facilityStatus',
  reportInHtml: '',
  tree: {
    selectedBranch: null,
    resDeviceTree: [],
  },
};
