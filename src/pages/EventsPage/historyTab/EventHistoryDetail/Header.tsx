import { useParams, useSearchParams } from 'react-router-dom';
import { Dayjs } from 'dayjs';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import LimitedRangePicker from '@/components/LimitedRangePicker';
import { useGetConfigDeviceDetailsQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { eventsSearchParamsSchema } from '@/services/validation/events';
import { YEAR_DATE_FORMAT } from '@/config';

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { deviceId } = useParams();
  const { fromDate, toDate } = eventsSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const parsedDeviceId = intIdSchema.safeParse(deviceId);
  const { data: deviceDetail } = useGetConfigDeviceDetailsQuery(
    parsedDeviceId.data || 0,
    {
      skip: !parsedDeviceId.success,
    },
  );

  const onRangeChange = (
    dates: [Dayjs | null | undefined, Dayjs | null | undefined] | undefined,
  ) => {
    if (!dates) {
      setSearchParams(prev => {
        prev.delete('fromDate');
        prev.delete('toDate');
        return prev;
      });
      return;
    }

    const [from, to] = dates;
    setSearchParams(prev => {
      prev.set('fromDate', from?.format(YEAR_DATE_FORMAT) || '');
      prev.set('toDate', to?.format(YEAR_DATE_FORMAT) || '');
      return prev;
    });
  };

  return (
    <Wrapper>
      <div className="device-name">{deviceDetail?.deviceNm}</div>
      <div className="left-group">
        <LimitedRangePicker
          availableDays={7}
          fromDate={fromDate}
          toDate={toDate}
          onChange={onRangeChange}
        />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  height: 32px;

  .device-name {
    font-size: ${themeGet('fontSizes.s4')};
    font-weight: ${themeGet('fontWeights.medium')};
    background-color: ${themeGet('colors.gray100')};
    border: 1px solid ${themeGet('colors.gray300')};
    border-radius: ${themeGet('borderRadius.normal')};
    padding: 0 ${themeGet('spacing.s2')};
  }
`;

export default Header;
