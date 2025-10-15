import { z } from 'zod';
import {
  CallPeakType,
  ChartType,
  LiveCallType,
  RankCount,
  ResIsCollected,
  ResourceType,
  UpdateInterval,
  UpdateIntervalShort,
  WidgetActionUrl,
  WidgetApiUrl,
  WidgetDataOrder,
  WidgetGroup,
  WidgetListType,
  WidgetType,
} from '@/types/enum';
import {
  anyObjectSchema,
  dateTimeSchema,
  dateTimeSecSchema,
  dimensionSchema,
  eventTypeEnSchema,
  resPaginationSchema,
} from './common';
import { resMapViewContentSchema } from './mapView';
import { resRackLayoutMapContentSchema } from './rackLayout';
import { resTopologyMapContentSchema } from './topology';

export const resDeviceListByDeviceTypeSchema = z.array(
  z.object({
    deviceKey: z.number(),
    deviceNm: z.string(),
    managementCd: z.number(),
  }),
);
export const updateIntervalSchema = z
  .number()
  .int()
  .min(UpdateIntervalShort['5초'])
  .max(UpdateInterval.Min30);

export const resWidgetConfSchema = z.object({
  updtCycleCd: updateIntervalSchema, // 갱신 주기
  indctCntCd: z.nativeEnum(RankCount).optional(), // 표시 개수
  indctTypeCd: z.nativeEnum(ChartType).optional(), // 표시 형태
  seqNum: z.number().optional(), // 위젯 ID
  rsrcCd: z.nativeEnum(ResourceType).optional(), // 자원종류
  deviceKey: z.number().optional(), // 장비ID
  managementCd: z.number().optional(), // 지역코드
  sortTypeCd: z.nativeEnum(WidgetDataOrder).optional(), // 정렬 순서
  deviceKindSubArr: z.string().optional(), // 장비종류(복수)
  deviceKindSub: z.string().optional(), // 장비종류(단일)
  eventLv: z.string().optional(), // 장애등급
  listOption: z.nativeEnum(WidgetListType).optional(), // 리스트 옵션(카드, 표)
  callPeakTypes: z.string().optional(), // 통화 Peak 종류
  callTypes: z.string().optional(), // 통화 종류
  phoneTypeArr: z.string().optional(), // 전화기 종류
  phoneType: z.string().optional(), // 전화기 종류
});

export const resWidgetTemplateListSchema = z.array(
  z.object({
    widgetId: z.nativeEnum(WidgetType),
    kind: z.nativeEnum(WidgetGroup),
    widgetNm: z.string(),
    dimension: dimensionSchema,
    url: z.nativeEnum(WidgetActionUrl),
    widgetConf: resWidgetConfSchema,
  }),
);

export const widgetOptionsSchema = z.object({
  updateInterval: updateIntervalSchema, // 갱신 주기
  selectedMap: z.number().optional(), // 선택된 맵
  rankCount: z.nativeEnum(RankCount).optional(), // 표시 개수
  selectedResource: z.nativeEnum(ResourceType).optional(), // 자원종류
  chartType: z.nativeEnum(ChartType).optional(), // 표시 형태
  selectedDevice: z.number().optional(), // 장비ID
  managementCd: z.number().optional(), // 지역코드
  order: z.nativeEnum(WidgetDataOrder).optional(), // 정렬 순서
  deviceTypes: z.array(z.number()).optional(), // 장비종류
  deviceType: z.number().optional(), // 장비종류
  eventTypes: z.array(z.number()).optional(), // 장애등급
  listType: z.nativeEnum(WidgetListType).optional(), // 리스트 옵션(카드, 표)
  callPeakTypes: z.array(z.nativeEnum(CallPeakType)).optional(), // 통화 Peak 종류
  callTypes: z.array(z.nativeEnum(LiveCallType)).optional(), // 통화 종류
  phoneTypes: z.array(z.number()).optional(), // 전화기 종류
  phoneType: z.number().optional(), // 전화기 종류
});

export const widgetAvailableSchema = z.object({
  type: z.nativeEnum(WidgetType),
  title: z.string(),
  group: z.nativeEnum(WidgetGroup),
  dimension: dimensionSchema,
  apiUrl: z.nativeEnum(WidgetApiUrl),
  options: widgetOptionsSchema,
});

export const widgetDataSchema = z.object({
  apiUrl: z.nativeEnum(WidgetApiUrl),
  id: z.string(),
  type: z.nativeEnum(WidgetType),
  title: z.string(),
  dimension: dimensionSchema,
  group: z.nativeEnum(WidgetGroup),
  options: widgetOptionsSchema,
});

export const widgetLayoutSchema = z.object({
  w: z.number(),
  x: z.number(),
  h: z.number(),
  i: z.string(),
  y: z.number(),
  data: widgetDataSchema,
});

export const resWidgetSchema = z.object({
  seqNum: z.number(),
  widgetId: z.nativeEnum(WidgetType),
  actionUrl: z.nativeEnum(WidgetActionUrl),
  widgetConf: resWidgetConfSchema,
  widgetInfo: widgetLayoutSchema,
});

export const resDashboardWidgetsSchema = z.object({
  dashboardId: z.number(),
  dashboard: z.array(resWidgetSchema),
});

// 장애 개수: NumOfEvents = 1
export const resNumOfEventsDataSchema = z.object({
  urgent: z.number(),
  important: z.number(),
  minor: z.number(),
  total: z.number(),
});

// 장애 발생 지역별 순위: StationRankingsByEvent = 2
export const resStationRankingsByEventDataSchema = z.object({
  widgetConf: resWidgetConfSchema,
  faultList: z.array(
    z.object({
      ranking: z.number(),
      managementCd: z.number(),
      managementNm: z.string(),
      total: z.number().nullable().default(0),
    }),
  ),
});

// 장애 현황: EventStatus = 3
export const resEventStatusDataSchema = z.object({
  faultList: z.array(
    z.object({
      no: z.number(),
      managementCd: z.number(),
      managementNm: z.string(),
      deviceKey: z.number(),
      portKey: z.number(),
      // 파일시스템 키
      fsKey: z.string().nullable(),
      // 인터페이스명
      ifName: z.number().nullable(),
      // 화장실 구분
      gender: z.number().nullable(),
      sensorKey: z.number().nullable(),
      cameraIp: z.string().nullable(),
      ocDate: dateTimeSchema,
      eventKey: z.number(),
      eventNm: eventTypeEnSchema,
      eventCd: z.string(),
      eventMsg: z.string(),
      deviceKind: z.number(),
      deviceKindNm: z.string(),
      deviceKindSub: z.number(),
      deviceKindNmSub: z.string(),
      deviceIp: z.string(),
      pstnNm: z.string().nullable(),
      deviceNm: z.string(),
    }),
  ),
  page: resPaginationSchema,
});

// 장애발생 추이: EventTrends = 4
export const resEventTrendsDataSchema = z.object({
  faultList: z.array(
    z.object({
      Day: z.string().date(),
      urgent: z.number(),
      important: z.number(),
      minor: z.number(),
      total: z.number(),
    }),
  ),
});

// 지역별 장애 현황: EventStatusByStation = 5
export const resEventStatusByStationDataSchema = z.object({
  faultList: z.array(
    z.object({
      no: z.number(),
      managementCd: z.number(),
      managementNm: z.string(),
      urgent: z.number(),
      important: z.number(),
      minor: z.number(),
    }),
  ),
  page: resPaginationSchema,
});

// 장비종류별 장애 현황: EventStatusByDeviceTypes = 6
export const resEventStatusByDeviceTypesDataSchema = z.object({
  deviceKindList: z.array(
    z.object({
      deviceKindNm: z.string(),
      deviceKind: z.number(),
      urgent: z.number(),
      important: z.number(),
      minor: z.number(),
      total: z.number(),
      managedDeviceCount: z.number(),
    }),
  ),
});

// 토폴로지: Topology = 7
export const resTopologyDataSchema = resTopologyMapContentSchema.extend({
  widgetConf: z.object({
    // eventLv: z.string(),
    updtCycleCd: z.number(),
    seqNum: z.number(),
  }),
});

// 맵현황: MapView = 8
export const resMapViewDataSchema = z.object({
  widgetConf: z.object({
    updtCycleCd: updateIntervalSchema,
    seqNum: z.number(),
  }),
  ...resMapViewContentSchema.shape,
});

// 랙실장도: RackLayout = 9
export const resRackLayoutDataSchema = z.object({
  widgetConf: z.object({
    updtCycleCd: updateIntervalSchema,
    seqNum: z.number(),
  }),
  ...resRackLayoutMapContentSchema.shape,
});

// 자원 사용률 순위 - 차트: DeviceRankingsChartByResource = 10
// 자원 사용률 순위 - 리스트: DeviceRankingsListByResource = 11
export const resDeviceRankingsByResourceDataSchema = z.object({
  rsrcCd: z.number(),
  widgetConf: resWidgetConfSchema,
  usageUtil: z.array(
    z.object({
      ranking: z.number(),
      managementCd: z.number(),
      managementNm: z.string(),
      deviceKey: z.number(),
      deviceKind: z.number(),
      deviceKindNm: z.string(),
      deviceNm: z.string(),
      usageUtil: z.string(),
    }),
  ),
});

// 장비 성능 정보: DevicePerformanceTrends = 12
export const resDevicePerformanceTrendsDataSchema = z.object({
  widgetConf: z.object({
    updtCycleCd: updateIntervalSchema,
    deviceKey: z.number(),
  }),
  deviceNm: z.string(),
  cpuPerformanceList: z.array(anyObjectSchema),
  fsPerformanceList: z.array(anyObjectSchema),
  networkPerformanceList: z.array(anyObjectSchema),
  memoryPerformanceList: z.array(anyObjectSchema),
});

// 온습도 정보: EnvironmentalFactors = 13
export const resEnvironmentalFactorsDataSchema = z.object({
  widgetConf: z.object({
    updtCycleCd: updateIntervalSchema,
  }),
  temperatureData: z.object({
    temperature: z.number(),
    humidity: z.number(),
    linkedKey: z.number().nullable(),
    status: z.nativeEnum(ResIsCollected),
    regDateTime: dateTimeSchema,
  }),
});

// 인사정보 업데이트 시간: HrInfoUpdateTime = 14
export const resHrInfoUpdateTimeDataSchema = z.object({
  widgetConf: z.object({
    updtCycleCd: updateIntervalSchema,
  }),
  hrUpdateTimeData: z.object({
    seqNum: z.number(),
    hrUpdateDateTime: z.string(),
    status: z.number(),
    regDateTime: z.string(),
  }),
  ezUpdateTimeData: z.object({
    seqNum: z.number(),
    ezUpdateDateTime: z.string(),
    status: z.number(),
    regDateTime: z.string(),
  }),
});

// 통화 Peak 추이: CallPeakTrends = 15
export const resCallPeakTrendsDataSchema = z.object({
  callPeakTrend: z.array(
    z.object({
      seqNum: z.number(),
      total: z.number(),
      outbound: z.number(),
      inbound: z.number(),
      tandem: z.number(),
      internal: z.number(),
      collectDateTime: dateTimeSecSchema,
    }),
  ),
});

// 현재 통화 추이: LiveCallTrends = 16
export const resLiveCallTrendsDataSchema = z.object({
  collectDateTime: dateTimeSecSchema,
  regOptIn: z.number(), // 국선수신(사업자)
  regOptOut: z.number(), // 국선발신(사업자)
  regRecvIn: z.number(), // 국선수신(사업자)
  regRecvOut: z.number(), // 국선발신(사업자)
  regSendIn: z.number(), // 국선수신(사업자)
  regSendOut: z.number(), // 국선발신(사업자)
  seqNum: z.number(),
  sip: z.number(), // 전체SIP
  total: z.number(), // 전체
});

// 미등록 전화기 현황: UnregisteredPhoneList = 17
export const resUnregisteredPhoneListDataSchema = z.object({
  listPhoneUnReg: z.array(
    z.object({
      no: z.number(),
      phoneKey: z.number(), // 단말키
      internalNum: z.string(), // 내선번호
      phoneDepth2: z.string(), // 소속
      collectDateTime: z.string(), // 발생일시
    }),
  ),
  page: resPaginationSchema,
});

// 전화기 종류 별 미등록 정보: UnregisteredPhonesByType = 18
export const resUnregisteredPhonesByTypeDataSchema = z.object({
  phoneType: z.string(), // 전화기 종류
  phoneTypeNm: z.string(), // 전화기 종류명
  managedCnt: z.number(), // 관리되는 전화기 개수
  unRegCount: z.number(), // 미등록 전화기 개수
});

// 개별 장비종류별 장애 현황: EventStatusByDeviceType = 19
export const resEventStatusByDeviceTypeDataSchema = z.object({
  deviceKindNm: z.string(),
  deviceKind: z.number(),
  urgent: z.number(),
  important: z.number(),
  minor: z.number(),
  total: z.number(),
  managedDeviceCount: z.number(),
});

export const numOfEventsWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.NumOfEvents),
  apiUrl: z.literal(WidgetApiUrl.NumOfEvents),
  group: z.literal(WidgetGroup.Issue),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
      chartType: true,
      deviceTypes: true,
    })
    .required()
    .extend({
      chartType: z.union([
        z.literal(ChartType.Pie),
        z.literal(ChartType.VerticalBar),
        z.literal(ChartType.HorizontalBar),
      ]),
    }),
});

export const stationRankingsByEventWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.StationRankingsByEvent),
  apiUrl: z.literal(WidgetApiUrl.StationRankingsByEvent),
  group: z.literal(WidgetGroup.Issue),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
      chartType: true,
      rankCount: true,
      deviceTypes: true,
      eventTypes: true,
    })
    .required()
    .extend({
      chartType: z.union([
        z.literal(ChartType.Pie),
        z.literal(ChartType.VerticalBar),
        z.literal(ChartType.HorizontalBar),
      ]),
    }),
});

export const eventStatusWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.EventStatus),
  apiUrl: z.literal(WidgetApiUrl.EventStatus),
  group: z.literal(WidgetGroup.Issue),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
      deviceTypes: true,
      eventTypes: true,
      listType: true,
    })
    .required(),
});

export const eventTrendsWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.EventTrends),
  apiUrl: z.literal(WidgetApiUrl.EventTrends),
  group: z.literal(WidgetGroup.Issue),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
      chartType: true,
      deviceTypes: true,
      eventTypes: true,
    })
    .required()
    .extend({
      chartType: z.union([
        z.literal(ChartType.VerticalBar),
        z.literal(ChartType.Line),
      ]),
    }),
});

export const eventStatusByStationWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.EventStatusByStation),
  apiUrl: z.literal(WidgetApiUrl.EventStatusByStation),
  group: z.literal(WidgetGroup.Issue),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
      // order: true,
      deviceTypes: true,
    })
    .required(),
});

export const eventStatusByDeviceTypesWidgetDataSchema = widgetDataSchema.extend(
  {
    type: z.literal(WidgetType.EventStatusByDeviceTypes),
    apiUrl: z.literal(WidgetApiUrl.EventStatusByDeviceTypes),
    group: z.literal(WidgetGroup.Issue),
    options: widgetOptionsSchema
      .pick({
        updateInterval: true,
        deviceTypes: true,
        eventTypes: true,
      })
      .required(),
  },
);

export const topologyWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.Topology),
  apiUrl: z.literal(WidgetApiUrl.Topology),
  group: z.literal(WidgetGroup.Operation),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
      selectedMap: true,
      // eventTypes: true,
    })
    .required(),
});

export const rackLayoutWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.RackLayout),
  apiUrl: z.literal(WidgetApiUrl.RackLayout),
  group: z.literal(WidgetGroup.Operation),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
      selectedMap: true,
    })
    .required(),
});

export const mapViewWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.MapView),
  apiUrl: z.literal(WidgetApiUrl.MapView),
  group: z.literal(WidgetGroup.Operation),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
    })
    .required(),
});

export const deviceRankingsChartByResourceWidgetDataSchema =
  widgetDataSchema.extend({
    type: z.literal(WidgetType.DeviceRankingsChartByResource),
    apiUrl: z.literal(WidgetApiUrl.DeviceRankingsChartByResource),
    group: z.literal(WidgetGroup.Performance),
    options: widgetOptionsSchema
      .pick({
        updateInterval: true,
        rankCount: true,
        chartType: true,
        selectedResource: true,
        deviceTypes: true,
      })
      .required()
      .extend({
        chartType: z.union([
          z.literal(ChartType.VerticalBar),
          z.literal(ChartType.HorizontalBar),
        ]),
      }),
  });

export const deviceRankingsListByResourceWidgetDataSchema =
  widgetDataSchema.extend({
    type: z.literal(WidgetType.DeviceRankingsListByResource),
    apiUrl: z.literal(WidgetApiUrl.DeviceRankingsListByResource),
    group: z.literal(WidgetGroup.Performance),
    options: widgetOptionsSchema
      .pick({
        updateInterval: true,
        rankCount: true,
        selectedResource: true,
        deviceTypes: true,
      })
      .required(),
  });

export const devicePerformanceTrendsWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.DevicePerformanceTrends),
  apiUrl: z.literal(WidgetApiUrl.DevicePerformanceTrends),
  group: z.literal(WidgetGroup.Performance),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
      selectedDevice: true,
      // managementCd: true,
    })
    .required(),
});

export const environmentalFactorsWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.EnvironmentalFactors),
  apiUrl: z.literal(WidgetApiUrl.EnvironmentalFactors),
  group: z.literal(WidgetGroup.Etc),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
    })
    .required(),
});

export const hrInfoUpdateTimeWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.HrInfoUpdateTime),
  apiUrl: z.literal(WidgetApiUrl.HrInfoUpdateTime),
  group: z.literal(WidgetGroup.Etc),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
    })
    .required(),
});

export const callPeakTrendsWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.CallPeakTrends),
  apiUrl: z.literal(WidgetApiUrl.CallPeakTrends),
  group: z.literal(WidgetGroup.TelephoneExchange),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
      callPeakTypes: true,
      // chartType: true,
    })
    .required()
    .extend({
      updateInterval: z.nativeEnum(UpdateIntervalShort),
      // chartType: z.union([
      //   z.literal(ChartType.VerticalBar),
      //   z.literal(ChartType.Line),
      // ]),
    }),
});

export const liveCallTrendsWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.LiveCallTrends),
  apiUrl: z.literal(WidgetApiUrl.LiveCallTrends),
  group: z.literal(WidgetGroup.TelephoneExchange),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
      callTypes: true,
      // chartType: true,
    })
    .required()
    .extend({
      updateInterval: z.nativeEnum(UpdateIntervalShort),
      // chartType: z.union([
      //   z.literal(ChartType.VerticalBar),
      //   z.literal(ChartType.Line),
      // ]),
    }),
});

export const unregisteredPhoneListWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.UnregisteredPhoneList),
  apiUrl: z.literal(WidgetApiUrl.UnregisteredPhoneList),
  group: z.literal(WidgetGroup.TelephoneExchange),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
      phoneTypes: true,
    })
    .required(),
});

export const unregisteredPhonesByTypeWidgetDataSchema = widgetDataSchema.extend(
  {
    type: z.literal(WidgetType.UnregisteredPhonesByType),
    apiUrl: z.literal(WidgetApiUrl.UnregisteredPhonesByType),
    group: z.literal(WidgetGroup.TelephoneExchange),
    options: widgetOptionsSchema
      .pick({
        updateInterval: true,
        phoneType: true,
      })
      .required(),
  },
);

export const eventStatusByDeviceTypeWidgetDataSchema = widgetDataSchema.extend({
  type: z.literal(WidgetType.EventStatusByDeviceType),
  apiUrl: z.literal(WidgetApiUrl.EventStatusByDeviceType),
  group: z.literal(WidgetGroup.Issue),
  options: widgetOptionsSchema
    .pick({
      updateInterval: true,
      deviceType: true,
      eventTypes: true,
    })
    .required(),
});
