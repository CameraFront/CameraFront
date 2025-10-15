import { RangeValue } from '@/types/common';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

// 날짜 범위를 제한하는 Custom Hook
const useLimitedRange = (
  limit: number,
  defaultRange: RangeValue,
  afterChangeHandler?: (value: RangeValue) => void,
) => {
  const [dates, setDates] = useState<RangeValue>(defaultRange);
  const [value, setValue] = useState<RangeValue>(defaultRange);

  const disabledDate = (current: Dayjs) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') >= limit;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') >= limit;
    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  const onCalendarChange = (val: RangeValue) => {
    setDates(val);
  };

  const onChange = (val: RangeValue) => {
    setValue(val);
    if (!val) return;

    if (afterChangeHandler) {
      afterChangeHandler(val);
    }
  };

  return {
    value,
    dates,
    setValue,
    setDates,
    disabledDate,
    onOpenChange,
    onCalendarChange,
    onChange,
  };
};

export default useLimitedRange;
