import { ROOT_KEY } from '@/config/constants';

// 값이 null 또는 undefined이 아닌지 확인하는 함수
export const isNotNullish = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

export const isRootValue = (value: number) => value === ROOT_KEY;
