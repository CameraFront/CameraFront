import { useCallback, useMemo } from 'react';
import { DatePicker, DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();

const disabledDateRange = (
  current: Dayjs,
  { from, type }: { from: Dayjs | null; type: 'year' | 'month' | 'date' },
  disabledDays: number,
) => {
  if (from) {
    const minDate = from.subtract(disabledDays - 1, 'days');
    const maxDate = from.add(disabledDays - 1, 'days');

    switch (type) {
      case 'year':
        return (
          current.year() < minDate.year() || current.year() > maxDate.year()
        );

      case 'month':
        return (
          getYearMonth(current) < getYearMonth(minDate) ||
          getYearMonth(current) > getYearMonth(maxDate)
        );

      default:
        return Math.abs(current.diff(from, 'days')) >= disabledDays;
    }
  }

  return false;
};

interface Props {
  availableDays: number;
  fromDate?: string;
  toDate?: string;
  onChange: (
    dates: [Dayjs | null | undefined, Dayjs | null | undefined],
  ) => void;
}

const LimitedRangePicker = ({
  availableDays,
  fromDate,
  toDate,
  onChange,
}: Props) => {
  const value = useMemo<
    [Dayjs | null | undefined, Dayjs | null | undefined]
  >(() => {
    if (!fromDate || !toDate) return [undefined, undefined];
    return [dayjs(fromDate), dayjs(toDate)];
  }, [fromDate, toDate]);

  const disabledDate = useCallback<
    NonNullable<DatePickerProps['disabledDate']>
  >(
    current =>
      disabledDateRange(
        current,
        { from: value[0] || null, type: 'date' },
        availableDays,
      ),
    [value, availableDays],
  );

  return (
    <RangePicker
      allowClear
      value={value}
      disabledDate={disabledDate}
      onChange={onChange}
    />
  );
};

export default LimitedRangePicker;
