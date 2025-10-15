import { RANGE_FROM_7DAYS } from '@/config';
import { FacilityReportSliceState } from './types';

export const initialState: FacilityReportSliceState = {
  isLoading: false,
  selectedTab: 'facilityStatus',
  reportInHtml: '',
  tree: {
    selectedBranch: null,
    resDeviceTree: [],
  },
  facilityTypes: [],
};
