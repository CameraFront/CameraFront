import { ResTreeNode } from '@/types/common';
import { Dayjs } from 'dayjs';

export interface FacilityReportSliceState {
  isLoading: boolean;
  selectedTab: 'facilityStatus' | 'eventStatistics';
  reportInHtml: string;
  facilityTypes: FacilityType[];
  tree: {
    selectedBranch: ResTreeNode | null;
    resDeviceTree: ResTreeNode[];
  };
}

export interface FacilityType {
  CTGRY_ID: string;
  CTGRY_NM: string;
}
