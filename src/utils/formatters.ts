import { SIPrefix } from '@/types/enum';

// 소수점 자리수 제한 함수
export const truncateFloatToNDecimals = (
  value: number | string | undefined,
  max = 2,
): number => {
  if (!value) return 0;

  let result = value;
  if (typeof value === 'string') {
    result = parseFloat(value);
  }

  return parseFloat((result as number).toFixed(max));
};

// 숫자를 한국식으로 변환하는 함수
export const formatNumber = (
  value: number | string,
  min = 0,
  max = 0,
  style = 'decimal' as Intl.NumberFormatOptions['style'],
): string => {
  if (!value) return '0';

  let result: number;
  if (typeof value === 'string') {
    result = parseFloat(value);
  } else {
    result = value;
  }

  return result.toLocaleString('ko-KR', {
    style,
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });
};

// 수 단위 변환 함수
export const divideBySIPrefix = (
  value: number,
  prefix: 1 | SIPrefix,
  point: number,
): number => {
  if (!prefix) return 0;

  return truncateFloatToNDecimals(value / prefix, point);
};
