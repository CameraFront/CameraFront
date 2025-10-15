import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Segmented, Typography } from 'antd';
import { Dayjs } from 'dayjs';
import styled from 'styled-components';
import LimitedRangePicker from '@/components/LimitedRangePicker';
import { useGetConfigDeviceDetailsQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { configPerfSearchParamsSchema } from '@/services/validation/configPerf';
import { DeviceType } from '@/types/enum';
import { YEAR_DATE_FORMAT } from '@/config';

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { contentType, fromDate, toDate } = configPerfSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { deviceId } = useParams();
  const parsedDeviceId = intIdSchema.parse(deviceId);
  const { data: deviceDetail } = useGetConfigDeviceDetailsQuery(
    parsedDeviceId ?? 0,
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

  const onChange = (value: string) => {
    setSearchParams({
      contentType: value,
    });
  };

  const segmentedItems = useMemo(() => {
    const items = [
      {
        label: 'CPU',
        value: 'cpu',
      },
      {
        label: 'Memory',
        value: 'memory',
      },
      {
        label: 'Disk',
        value: 'disk',
      },
    ];

    if (!deviceDetail) return items;
    const { deviceKind } = deviceDetail;
    if (deviceKind === DeviceType.Network) {
      items.push({
        label: 'Port',
        value: 'port',
      });
    }
    return items;
  }, [deviceDetail]);

  return (
    <Wrapper>
      <div className="left-group">
        <Typography.Title level={4} style={{ marginBottom: 0 }}>
          {deviceDetail?.deviceNm}
        </Typography.Title>
      </div>
      <div className="center-group">
        <Segmented
          options={segmentedItems}
          value={contentType}
          onChange={onChange}
        />
      </div>
      <div className="right-group">
        <LimitedRangePicker
          availableDays={30}
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
  position: relative;

  .center-group {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export default Header;
