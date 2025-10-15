import { Dayjs } from 'dayjs';
import { ResTreeNode } from '@/types/common';

export interface InfrastructureReportSliceState {
  isLoading: boolean;
  selectedTab: 'facilityStatus' | 'eventStatistics' | 'performanceStatistics';
  reportInHtml: string;
  tree: {
    selectedBranch: ResTreeNode | null;
    resDeviceTree: ResTreeNode[];
  };
}

export enum ReportType {
  '시설물' = 1,
  '구축설비' = 2,
}

export type ReportFileType = 'html' | 'pdf' | 'excel';

export type ReportFileName =
  | '구축설비_현황_보고서'
  | '구축설비_상세_보고서'
  | '장애_상세_보고서(실시간)'
  | '장애_상세_보고서(장애_이력)'
  | '장애_통계_보고서'
  | '장애_발생추이_보고서'
  | '구축설비_성능_보고서(CPU)'
  | '구축설비_성능_보고서(메모리)'
  | '구축설비_성능_보고서(파일시스템)'
  | '구축설비_성능_보고서(네트워크)'
  | '구축설비_성능_보고서(GPU)'
  | '시설물_현황_보고서'
  | '시설물_상세_보고서(기계설비)'
  | '시설물_상세_보고서(소방설비)'
  | '시설물_상세_보고서(조명설비)'
  | '시설물_상세_보고서(환경설비)'
  | '시설물_상세_보고서(비상벨)'
  | '시설물_상세_보고서(화장실)'
  | '이벤트_통계_보고서'
  | '이벤트_발생추이_보고서'
  | '화장실_재실_보고서';

export interface ReportRequestBody {
  department: string;
  reporter: string;
  purpose: string;
  fileType: ReportFileType;
  fileName: ReportFileName;
  stationId: string;
  reportType: ReportType;
  selectedRange?: [Dayjs, Dayjs];
  selectedDate?: Dayjs;
  selectedDevice?: number;
}

export interface ReportDownloadPayload {
  USERDEPT: string; // 소속부서
  USERNAME: string; // 보고자
  REPORTPURPOSE: string; // 보고목적
  FILENAME: ReportFileName;
  TYPE: ReportFileType; // 리포트 종류
  MNGOFCCD: string; // 역사번호
  DATE?: string; // 통계일 (Optional)
  STARTDATE?: string; // 시작일 (Optional)
  ENDDATE?: string; // 종료일 (Optional)
  PROBE?: string; // 구축설비 장비종류 (Optional)
  DKEY?: string; // 구축설비 장비번호 (Optional)
  PKEY?: string; // 구축설비 포트번호 (Optional)
  DB_TYPE?: number; // 시설물 종류
}

export interface ReportFormValues {
  department: string;
  reporter: string;
  purpose: string;
}
