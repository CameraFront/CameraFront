export enum SIPrefix {
  Kilo = 10 ** 3,
  Mega = 10 ** 6,
  Giga = 10 ** 9,
}

export enum ResStatusCode {
  Success = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  UnprocessableEntity = 422,
  InternalServerError = 500,
}

export const enum HasPagination {
  False = 1,
  True = 0,
}

export type NetworkNodeType = 'firewall' | 'L2' | 'L3' | 'server';
export type EventTypeKr = '긴급' | '중요' | '일반';
export type BranchType = 'hq' | 'st' | 'dk' | 'dv';
export type TopologyBranchType = 'hq' | 'st' | 'node';
export type OrderType = 'ASC' | 'DESC';

// hq:지역본부(managementCd)
// st:역사(stationCd)
// dk:장비종류(deviceKind)
// dv:장비
// eventYn 1인 경우만 장비목록조회

export enum WidgetType {
  NumOfEvents = 1, // 장애 개수
  StationRankingsByEvent = 2, // 장애발생 지역별 순위
  EventStatus = 3, // 장애 현황
  EventTrends = 4, // 장애발생 추이
  EventStatusByStation = 5, // 소속별 장애 현황
  EventStatusByDeviceTypes = 6, // 장비종류별 장애 현황
  Topology = 7, // 토폴로지
  MapView = 8, //  맵현황
  RackLayout = 9, // 랙실장도
  DeviceRankingsChartByResource = 10, // 자원 사용률 순위 - 차트
  DeviceRankingsListByResource = 11, // 자원 사용률 순위 - 리스트
  DevicePerformanceTrends = 12, // 장비 성능
  EnvironmentalFactors = 13, // 온/습도
  HrInfoUpdateTime = 14, // 인사정보 업데이트 시간
  CallPeakTrends = 15, // 통화 Peak 추이
  LiveCallTrends = 16, // 현재 통화 추이
  UnregisteredPhoneList = 17, // 미등록 전화기 현황
  UnregisteredPhonesByType = 18, // 전화기 종류 별 미등록 정보
  EventStatusByDeviceType = 19, // 개별 장비종류별 장애 현황
}

export enum WidgetActionUrl {
  NumOfEvents = '/yeollim/dashboard/getFaultCnt.do',
  StationRankingsByEvent = '/yeollim/dashboard/listFaultStationRanking.do',
  EventStatus = '/yeollim/dashboard/listFault.do',
  EventTrends = '/yeollim/dashboard/listFaultTrend.do',
  EventStatusByStation = '/yeollim/dashboard/listStationFault.do',
  EventStatusByDeviceTypes = '/yeollim/dashboard/listFaultDeviceKind.do',
  Topology = '/yeollim/dashboard/getTopologyMap.do',
  MapView = '/yeollim/dashboard/getLineMap.do',
  RackLayout = '/yeollim/dashboard/getRackMap.do',
  DeviceRankingsChartByResource = '/yeollim/dashboard/listResourceUsageRanking.do',
  DeviceRankingsListByResource = '/yeollim/dashboard/listResourceUsageRanking.do',
  DevicePerformanceTrends = '/yeollim/dashboard/listDevicePerformance.do',
  EnvironmentalFactors = '/yeollim/dashboard/getTemperatureData.do',
  HrInfoUpdateTime = '/yeollim/dashboard/getHrUpdateTime.do',
  CallPeakTrends = '/yeollim/dashboard/callPeakTrend.do',
  LiveCallTrends = '/yeollim/dashboard/liveCallTrend.do',
  UnregisteredPhoneList = '/yeollim/dashboard/listPhoneUnReg.do',
  UnregisteredPhonesByType = '/yeollim/dashboard/getUnregStatsByPhoneType.do',
  EventStatusByDeviceType = '/yeollim/dashboard/getFaultDeviceKind.do',
}

export enum WidgetApiUrl {
  NumOfEvents = 'dashboard/getFaultCnt.do',
  StationRankingsByEvent = 'dashboard/listFaultStationRanking.do',
  EventStatus = 'dashboard/listFault.do',
  EventTrends = 'dashboard/listFaultTrend.do',
  EventStatusByStation = 'dashboard/listStationFault.do',
  EventStatusByDeviceTypes = 'dashboard/listFaultDeviceKind.do',
  Topology = 'dashboard/getTopologyMap.do',
  MapView = 'dashboard/getLineMap.do',
  RackLayout = 'dashboard/getRackMap.do',
  DeviceRankingsChartByResource = 'dashboard/listResourceUsageRanking.do',
  DeviceRankingsListByResource = 'dashboard/listResourceUsageRanking.do',
  DevicePerformanceTrends = 'dashboard/listDevicePerformance.do',
  EnvironmentalFactors = 'dashboard/getTemperatureData.do',
  HrInfoUpdateTime = 'dashboard/getHrUpdateTime.do',
  CallPeakTrends = 'dashboard/callPeakTrend.do',
  LiveCallTrends = 'dashboard/liveCallTrend.do',
  UnregisteredPhoneList = 'dashboard/listPhoneUnReg.do',
  UnregisteredPhonesByType = 'dashboard/getUnregStatsByPhoneType.do',
  EventStatusByDeviceType = 'dashboard/getFaultDeviceKind.do',
}

export enum EventLv {
  Urgent = 1,
  Important = 2,
  Minor = 3,
}

export enum UpdateInterval {
  Min2 = 120,
  Min5 = 300,
  Min10 = 600,
  Min30 = 1800,
}

export enum UpdateIntervalShort {
  '5초' = 5,
  '10초' = 10,
  '30초' = 30,
  '60초' = 60,
}

export enum WidgetGroup {
  Issue = 1,
  Operation = 2,
  Performance = 3,
  TelephoneExchange = 4,
  Etc = 9,
}

export enum RankCount {
  Top5 = 1,
  Top10 = 2,
}

export enum ChartType {
  Pie = 0,
  VerticalBar = 1,
  Line = 2,
  HorizontalBar = 3,
}

export enum ResourceType {
  Cpu = 0,
  Memory = 1,
  Disk = 2,
  Traffic = 3,
}

export enum WidgetDataOrder {
  StationNum = 1, // 지역번호 순
  NumOfEvents = 2, // 장애수
}

export enum WidgetListType {
  Cards = 1,
  Table = 2,
}

// deviceKindArr
export enum DeviceType {
  Server = 1,
  Network = 2,
  Sensor = 3,
  Terminal = 4,
  Etc = 9,
}

export enum DateRange {
  Today = 'today',
  ThisWeek = 'thisWeek',
  ThisMonth = 'thisMonth',
  CustomRange = 'customRange',
}

export enum DeviceTypeDivision1 {
  Server = '서버',
  Network = '네트워크',
  Sensor = '센서',
  Camera = '카메라',
  Etc = '기타',
}

export enum DeviceTypeDivision2 {
  Server = 'server',
  VideoServer = 'videoServer',
  L3Switch = 'l3Switch',
  L2Switch = 'l2Switch',
  Hub = 'Hub',
  Sensor = 'sensor',
  Camera = 'camera',
  Etc = 'etc',
  Firewall = 'firewall',
}

export enum ResBoolean {
  False = 0,
  True = 1,
}

export enum ResManageYn {
  비관리 = 0, // 비관리
  관리 = 1, // 관리
  'Ping만 체크' = 2, // Ping만 관리
}

export enum ResIsCollected {
  Collected = 1, // 정상
  NotCollected = 2, // 수집실패
}

export enum CallPeakType {
  '전체' = 0,
  '발신' = 1,
  '수신' = 2,
  '중계' = 3,
  '내선' = 4,
}

export enum LiveCallType {
  '전체' = 0,
  'SIP통화' = 1,
  '국선발신(사업자)' = 2,
  '국선착신(사업자)' = 3,
  'GW발신' = 4,
  'GW착신' = 5,
  'SIP 발신' = 6,
  'SIP 착신' = 7,
}

export enum PerfDataInterval {
  'Under1Day' = '5min',
  'Over1Day' = '30min',
  'Over7Days' = 'daily',
}

// --------------------- Settings ---------------------

export enum SettingsTab {
  ManagementsTab = 'managementsTab',
  DevicesTab = 'devicesTab',
  TerminalsTab = 'terminalsTab',
  PhonesTab = 'phonesTab',
  ProcessesTab = 'processesTab',
  DeviceManualsTab = 'deviceManualsTab',
  DeviceInspectionsTab = 'deviceInspectionsTab',

  RolesTab = 'rolesTab',
  EventsTab = 'eventsTab',
  UsersTab = 'usersTab',
  DeviceManagersTab = 'deviceManagersTab',

  ThresholdsTab = 'thresholdsTab',
  DeviceImagesTab = 'deviceImagesTab',
  AudioFilesTab = 'audioFilesTab',
  LoginHistoryTab = 'loginHistoryTab',
}
