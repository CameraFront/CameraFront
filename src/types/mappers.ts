import soundImportant from '@/assets/audios/mixkit-sci-fi-error-alert-898.wav';
import soundMinor from '@/assets/audios/mixkit-shaker-bell-alert-599.mp3';
import soundUrgent from '@/assets/audios/mixkit-synth-mechanical-notification-or-alert-650.wav';
import { EventTypeEn } from './common';
import { BranchType } from './enum';

export const eventTypeMap: Record<EventTypeEn, string> = {
  urgent: '긴급',
  important: '중요',
  minor: '일반',
};

export const branchTypeMap: Record<BranchType, string> = {
  hq: 'managementCd',
  st: 'stationCd',
  dk: 'deviceKind',
  dv: 'deviceKey',
};

export const tableLabelMap = {
  deviceKey: '디바이스ID',
  deviceNm: '장비명',
  managementNm: '소속',
  // stationNm: '역사',
  deviceKindNm: '장비종류',
  installCompany: '설치업체',
  productCompany: '제조사',
  installDate: '설치일자',
  modelNm: '모델명',
  pstnNm: '위치',
  managerANm: '관리자(정)',
  managerBNm: '관리자(부)',
  manageYnNm: '관리여부',
  departmentA: '부서(정)',
  departmentB: '부서(부)',
  phoneA: '전화번호(정)',
  phoneB: '전화번호(부)',
  emailA: '이메일(정)',
  emailB: '이메일(부)',
  regDate: '등록일자',
  deviceIp: 'IP주소',
  os: '운영체제',
  fsNm: '파일시스템명',
  sysUptime: '구동시간',
  cpuUtil: 'CPU 사용률',
  memUtil: '메모리 사용률',
  usageUtil: '디스크 사용량',
  phoneKey: '전화기고유키',
  phoneStatus: '동작상태',
  phoneTypeNm: '전화기 종류',
  phoneLocation: '설치장소',
  macAddr: 'MAC주소',
  internalNum: '내선번호',
  externalNum: '외선번호',
} as const;

export const audioMapper = {
  urgent: soundUrgent,
  important: soundImportant,
  minor: soundMinor,
};

export const toiletTypeMapper: Record<number, string> = {
  1: '남자',
  2: '여자',
  3: '남자장애인',
  4: '여자장애인',
};

export const deviceTypeMapper: Record<number, string> = {
  // 서버
  11: '서버',
  12: '영상분석서버',
  // 네트워크 장비
  21: 'L2',
  22: 'L3',
  23: 'L4',
  // 센서
  31: '센서',
  // 카메라
  41: '카메라',
  // 기타
  91: '구내교환기',
  92: '기타',
};
