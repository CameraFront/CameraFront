import { EventLv, ResBoolean, ResManageYn } from '@/types/enum';

export const MANAGE_OPTIONS = [
  {
    label: ResManageYn[ResManageYn.비관리],
    value: ResManageYn.비관리,
  },
  {
    label: ResManageYn[ResManageYn.관리],
    value: ResManageYn.관리,
  },
  {
    label: ResManageYn[ResManageYn['Ping만 체크']],
    value: ResManageYn['Ping만 체크'],
  },
];

export const MANAGE_YN_OPTIONS = [
  {
    label: ResManageYn[ResBoolean.False],
    value: ResBoolean.False,
  },
  {
    label: ResManageYn[ResBoolean.True],
    value: ResBoolean.True,
  },
];

export const DEVICE_IMAGE_UNIT_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 1}U`,
  value: i + 1,
}));

export const EVENT_TYPE_OPTIONS = [
  {
    label: '긴급',
    value: EventLv.Urgent,
  },
  {
    label: '중요',
    value: EventLv.Important,
  },
  {
    label: '일반',
    value: EventLv.Minor,
  },
];
