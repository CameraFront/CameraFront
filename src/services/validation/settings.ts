import { z } from 'zod';
import { ResBoolean } from '@/types/enum';
import { resPaginationSchema, stringDateSchema } from './common';

// --------------------- 소속 관리 ---------------------
export const resManagementSchema = z.object({
  managementCd: z.number(),
  managementId: z.string(),
  managementNm: z.string(),
  path: z.string().regex(/^\/(\d+\/)*\d+$/),
  depth: z.number().positive(),
  parentNode: z.number().nullable(),
});

export const resManagementListSchema = z.object({
  listManagement: z.array(
    resManagementSchema.extend({
      no: z.number(),
      endNode: z.enum(['Y', 'N']),
    }),
  ),
  page: resPaginationSchema,
});

// --------------------- 장비 관리 ---------------------
export const resDeviceSchema = z.object({
  deviceIp: z.string(),
  deviceKind: z.number(),
  manageYn: z.number(),
  deviceKindNm: z.string(),
  productCompany: z.string().nullable(),
  os: z.string().nullable(),
  installCompany: z.string().nullable(),
  deviceKey: z.number(),
  deviceNm: z.string(),
  modelNm: z.string().nullable(),
  managerANm: z.string().nullable(),
  managerBNm: z.string().nullable(),
  managerA: z.number().nullable(),
  managerB: z.number().nullable(),
  device2Depth: z.number(),
  manageYnNm: z.string(),
  pstnNm: z.string(),
  installDate: z.string().nullable(),
  device1Depth: z.number(),
  managementNm: z.string(),
  managementCd: z.number(),
});

export const resDeviceListSchema = z.object({
  deviceList: z.array(
    resDeviceSchema
      .pick({
        deviceKey: true,
        deviceNm: true,
        managementCd: true,
        managementNm: true,
        deviceIp: true,
        pstnNm: true,
        manageYn: true,
        manageYnNm: true,
        deviceKindNm: true,
        os: true,
        installCompany: true,
        productCompany: true,
        installDate: true,
        modelNm: true,
        managerANm: true,
        managerBNm: true,
      })
      .extend({ no: z.number(), deviceKindNm2: z.string().nullable() }),
  ),
  page: resPaginationSchema,
});

export const resDeviceTypesByDepthSchema = z.object({
  deviceDepthList: z.array(
    z.object({
      seqNum: z.number(),
      deviceEnNm: z.string().nullable(),
      deviceKindNm: z.string(),
      deviceKind: z.number(),
    }),
  ),
});

// --------------------- 단말 관리 ---------------------
export const resTerminalSchema = z.object({
  deviceIp: z.string(),
  manageYn: z.number(),
  deviceKindNm: z.string().nullable(),
  productCompany: z.string(),
  switchPortKey: z.number().nullable(),
  installCompany: z.string().nullable(),
  cameraTypeNm: z.string().nullable(),
  deviceKey: z.number(),
  deviceNm: z.string(),
  modelNm: z.string().nullable(),
  managerANm: z.string().nullable(),
  managerBNm: z.string().nullable(),
  managerA: z.number().nullable(),
  managerB: z.number().nullable(),
  switchPortMacAddr: z.string().nullable(),
  switchIp: z.string().nullable(),
  device2Depth: z.number(),
  manageYnNm: z.string(),
  pstnNm: z.string(),
  installDate: z.string().nullable(),
  device1Depth: z.number(),
  managementNm: z.string(),
  managementCd: z.number(),
});

export const resTerminalListSchema = z.object({
  cameraList: z.array(
    resTerminalSchema
      .pick({
        deviceKey: true,
        cameraTypeNm: true,
        deviceNm: true,
        managementCd: true,
        managementNm: true,
        deviceIp: true,
        pstnNm: true,
        manageYn: true,
        manageYnNm: true,
        switchIp: true,
        switchPortKey: true,
        installCompany: true,
        productCompany: true,
        installDate: true,
        modelNm: true,
        managerANm: true,
        managerBNm: true,
        deviceKindNm: true,
      })
      .extend({ no: z.number(), deviceKindNm2: z.string().nullable() }),
  ),
  page: resPaginationSchema,
});

export const resL2SwitchListSchema = z.object({
  l2List: z.array(
    z.object({
      switchNm: z.string(),
      switchIp: z.string(),
    }),
  ),
});

export const resPortKeyListSchema = z.object({
  portKeyList: z.array(
    z.object({
      portKey: z.string(),
    }),
  ),
});

// --------------------- 전화기 관리 ---------------------
export const resPhoneListSchema = z.object({
  listPhone: z.array(
    z.object({
      no: z.number(),
      phoneKey: z.number(),
      phoneNm: z.string(),
      managementCd: z.number(),
      managementNm: z.string(),
      parentKey: z.number().nullable(),
      macAddr: z.string().nullable(),
      ipAddr: z.string().nullable(),
      internalNum: z.string(),
      externalNum: z.string().nullable(),
      phoneType: z.number(),
      phoneTypeNm: z.string(),
      phoneClass: z.number().nullable(),
      chgStatus: z.number(),
      pingStatus: z.number(),
      phoneLocation: z.string().nullable(),
      manageYn: z.number(),
      manageYnNm: z.string(),
      regDt: z.string(),
      updateDt: z.string().nullable(),
    }),
  ),
  page: resPaginationSchema,
});

export const resPhoneListScanSchema = z.object({
  listPhone: z.array(
    z.object({
      no: z.number(),
      phoneKey: z.number(),
      internalNum: z.string(),
      macAddr: z.string().nullable(),
      ipAddr: z.string().nullable(),
      phoneStatus1: z.number(),
      phoneStatus2: z.number(),
      phoneType: z.string(),
      phoneVersion: z.string().nullable(),
      phoneDepth1: z.string(),
      phoneDepth2: z.string(),
      manageYn: z.number(),
      manageYnNm: z.string(),
      regDt: z.string(),
      updateDt: z.string().nullable(),
    }),
  ),
  page: resPaginationSchema,
});

export const resPhoneTypeListSchema = z.object({
  listPhoneType: z.array(
    z.object({
      phoneType: z.number(),
      phoneTypeNm: z.string(),
    }),
  ),
  page: resPaginationSchema.optional(),
});

export const resPhoneSchema = z.object({
  phoneKey: z.number(),
  phoneNm: z.string(),
  managementCd: z.number(),
  managementNm: z.string(),
  parentKey: z.number().nullable(),
  macAddr: z.string().nullable(),
  ipAddr: z.string().nullable(),
  internalNum: z.string(),
  externalNum: z.string().nullable(),
  phoneType: z.number(),
  phoneTypeNm: z.string(),
  phoneClass: z.number().nullable(),
  chgStatus: z.number(),
  pingStatus: z.number(),
  phoneLocation: z.string().nullable(),
  manageYn: z.number(),
  manageYnNm: z.string(),
  phoneStatus: z.string(),
  regDt: stringDateSchema,
  updateDt: stringDateSchema.nullable(),
});

// --------------------- 장애 관리 ---------------------
export const resEventSchema = z.object({
  fCd: z.string(), // 이벤트코드
  fDes: z.string(), // 이벤트종류
  fDiv: z.string(), // ?
  fLv: z.number(), // 이벤트레벨
  fLvNm: z.string(), // 이벤트레벨명
  soundFileNm: z.string().nullable(), // 사운드파일명
  displayYn: z.nativeEnum(ResBoolean), // 표시여부
  manageYn: z.nativeEnum(ResBoolean), // 관리여부
  complexFaultYn: z.nativeEnum(ResBoolean), // 복합장애여부
  isAudible: z.nativeEnum(ResBoolean), // 가청여부
  audioKey: z.number().nullable(), // 오디오 일련번호
});

export const resEventListSchema = z.object({
  eventList: z.array(resEventSchema.extend({ no: z.number() })),
  page: resPaginationSchema,
});

// --------------------- 프로세스 관리 ---------------------

export const resProcessSchema = z.object({
  seqNum: z.number(),
  procNm: z.string(),
  procParam: z.string().nullable(),
  procPath: z.string(),
  deviceKind: z.number(),
  deviceKey: z.number(),
  deviceNm: z.string(),
  sshAccessId: z.string().nullable(),
  sshAccessPwd: z.string().nullable(),
  manageYn: z.nativeEnum(ResBoolean),
  regDt: z.string(),
});

export const resProcessListSchema = z.object({
  listProcess: z.array(
    resProcessSchema.omit({ sshAccessId: true, sshAccessPwd: true }).extend({
      no: z.number(),
      procStat: z.number().nullable(),
      chkDt: z.string().nullable(),
    }),
  ),
  page: resPaginationSchema,
});

export const resSshDeviceListSchema = z.object({
  sshDeviceList: z.array(
    z.object({
      deviceKey: z.number(),
      deviceNm: z.string(),
      managementCd: z.number(),
      managementNm: z.string(),
    }),
  ),
});

// --------------------- 매뉴얼 관리 ---------------------

export const resDeviceManualSchema = z.object({
  depth1Nm: z.string(),
  depth2Nm: z.string(),
  fileNm: z.string(),
  manualNm: z.string(),
  seqNum: z.number(),
  depth1: z.number(),
  depth2: z.number(),
  deviceKey: z.number().nullable(),
  modelNm: z.string(),
  regDt: z.string(),
  version: z.string().nullable(),
});
export const resDeviceManualListSchema = z.object({
  listManual: z.array(resDeviceManualSchema.extend({ no: z.number() })),
  page: resPaginationSchema,
});

// --------------------- 설비점검 관리 ---------------------
export const resDeviceInspectionSchema = z.object({
  seqNum: z.number(),
  managementCd: z.number(),
  managementNm: z.string(),
  deviceKey: z.number(),
  deviceKind: z.number(),
  deviceKindSub: z.number(),
  deviceKindNm: z.string(),
  deviceKindSubNm: z.string(),
  deviceNm: z.string(),
  checkUpDt: z.string(),
  type: z.string(),
  companyNm: z.string(),
  managerNm: z.string().nullable(),
  reportFilePath: z.string().nullable(),
  photoFilePath: z.string().nullable(),
  reportFileNm: z.string().nullable(),
  photoFileNm: z.string().nullable(),
  regDt: z.string(),
});

export const resDeviceInspectionListSchema = z.object({
  listDeviceCheckUp: z.array(
    z.object({
      seqNum: z.number(),
      No: z.number(),
      checkUpDt: z.string(),
      companyNm: z.string(),
      deviceKey: z.number(),
      deviceKindNm: z.string(),
      deviceNm: z.string(),
      managementNm: z.string(),
      managerNm: z.string().nullable(),
      photoFileNm: z.string().nullable(),
      photoFilePath: z.string().nullable(),
      reportFileNm: z.string().nullable(),
      reportFilePath: z.string().nullable(),
      regDt: z.string(),
      type: z.string(),
    }),
  ),
  page: resPaginationSchema,
});

// --------------------- 오디오 관리 ---------------------
export const resAudioSchema = z.object({
  seqNum: z.number(),
  soundNm: z.string(),
  fileNm: z.string(),
  type: z.number(),
});

export const resAudioListSchema = z.object({
  listAudio: z.array(resAudioSchema.extend({ no: z.number() })),
  page: resPaginationSchema,
});

export const resAllAudiosSchema = resAudioListSchema.omit({ page: true });

// --------------------- 임계치 관리 ---------------------
export const resThresholdSchema = z.object({
  NO: z.number(),
  deviceIp: z.string(),
  deviceKindNm: z.string(),
  fsThr: z.number(),
  depth1: z.number(),
  cpuThr: z.number(),
  depth2: z.number(),
  deviceKey: z.number(),
  deviceNm: z.string(),
  memThr: z.number(),
  gpu1Thr: z.number().nullable(),
  gpu2Thr: z.number().nullable(),
  managementNm: z.string(),
  gpu4Thr: z.number().nullable(),
  gpu3Thr: z.number().nullable(),
});

export const resThresholdListSchema = z.object({
  listDeviceThr: z.array(
    z.object({
      no: z.number(),
      managementCd: z.number(),
      managementNm: z.string(),
      device1Depth: z.number(),
      deviceKey: z.number(),
      deviceNm: z.string(),
      deviceIp: z.string(),
      cpuThr: z.number(),
      memThr: z.number(),
      fsThr: z.number(),
      gpu1Thr: z.number().nullable(),
      gpu2Thr: z.number().nullable(),
      gpu3Thr: z.number().nullable(),
      gpu4Thr: z.number().nullable(),
      deviceKindNm: z.string(),
    }),
  ),
  page: resPaginationSchema,
});

// --------------------- 권한 관리 ---------------------

export const resRoleSchema = z.object({
  roleId: z.number(),
  roleGroupId: z.number(),
  roleGroupKrNm: z.string(),
  roleNm: z.string(),
  managementCd: z.number().nullable(),
});

export const resRoleListSchema = z.array(
  resRoleSchema.extend({
    managementNm: z.string(),
  }),
);

export const resRoleGroupListSchema = z.object({
  groupRoleList: z.array(
    z.object({
      roleGroupId: z.number(),
      roleGroupNm: z.string(),
      roleGroupKrNm: z.string(),
    }),
  ),
});

// --------------------- 사용자 관리 ---------------------
export const resUserSchema = z.object({
  userId: z.string(),
  userNm: z.string(),
  roleId: z.number(),
  roleNm: z.string(),
  alarmYn: z.nativeEnum(ResBoolean),
  alarmYnNm: z.string(),
  audibleYn: z.nativeEnum(ResBoolean),
  audibleYnNm: z.string(),
  lockYn: z.nativeEnum(ResBoolean),
  lockYnNm: z.string(),
  department: z.string().nullable(),
});

export const resUserListSchema = z.object({
  userList: z.array(resUserSchema.omit({ department: true })),
});

export const resValidateUserIdSchema = z.object({
  cnt: z.number(),
});

// --------------------- 장비관리자 관리 ---------------------
export const resDeviceManagerSchema = z.object({
  seqNum: z.number(),
  managerNm: z.string(),
  department: z.string(),
  email: z.string(),
  tel: z.string(),
  memo: z.string().nullable(),
  manageYn: z.number(),
});

export const resDeviceManagerListSchema = z.object({
  listEquipManager: z.array(
    resDeviceManagerSchema.extend({
      no: z.number(),
    }),
  ),
  page: resPaginationSchema,
});

export const resDeviceManagerListAllSchema = resDeviceManagerListSchema.omit({
  page: true,
});
