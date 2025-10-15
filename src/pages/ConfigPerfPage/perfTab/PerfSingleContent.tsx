import { useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import styled from 'styled-components';
import DoubleTrafficLineChart from '@/components/charts/DoubleTrafficLineChart';
import SingleUsageLineChart from '@/components/charts/SingleUsageLineChart';
import NoData from '@/components/fallbacks/NoData';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getPerfDeviceDetails } from '@/features/configPerfPage/configPerfSlice';
import { SIPrefix } from '@/types/enum';
import { divideBySIPrefix } from '@/utils/formatters';
import ExcelSymbol from '@/assets/icon__excel.svg?react';
import { RANGE_FROM_7DAYS } from '@/config';

const { RangePicker } = DatePicker;
type RangeValue = [Dayjs | null, Dayjs | null] | null;

const PerfSingleContent = () => {
  const dispatch = useAppDispatch();
  const {
    perf: { resDeviceDetails },
  } = useAppSelector(store => store.configPerf);
  const [dateRange, setDateRange] = useState<RangeValue>(RANGE_FROM_7DAYS);

  useEffect(() => {
    if (!dateRange) return;

    dispatch(getPerfDeviceDetails(dateRange));
  }, [dateRange, dispatch]);

  const datasets = useMemo(() => {
    if (!resDeviceDetails) return null;

    const cpu = {
      dimensions: ['datetime', 'value'],
      source: resDeviceDetails.cpuPerformanceList.map(d => ({
        datetime: dayjs(d.date).format('MM/DD HH:mm'),
        value: d.cpuUtil,
      })),
    };
    const memory = {
      dimensions: ['datetime', 'value'],
      source: resDeviceDetails.memPerformanceList.map(d => ({
        datetime: dayjs(d.date).format('MM/DD HH:mm'),
        value: d.memUtil,
      })),
    };
    const disk = {
      dimensions: ['datetime', 'value'],
      source: resDeviceDetails.fsPerformanceList.map(d => ({
        datetime: dayjs(d.date).format('MM/DD HH:mm'),
        value: d.size,
      })),
    };
    const traffic = {
      dimensions: ['datetime', 'inbound', 'outbound'],
      source: resDeviceDetails
        ? resDeviceDetails.networkPerformanceList.map(d => ({
            datetime: dayjs(d.date).format('MM/DD HH:mm'),
            inbound: divideBySIPrefix(d.inBps, SIPrefix.Mega, 1),
            outbound: divideBySIPrefix(d.outBps, SIPrefix.Mega, 1),
          }))
        : [],
    };

    return {
      cpu,
      memory,
      disk,
      traffic,
    };
  }, [resDeviceDetails]);

  if (!resDeviceDetails) return <NoData />;

  const lastItem =
    resDeviceDetails.networkPerformanceList[
      resDeviceDetails.networkPerformanceList.length - 1
    ];

  // 데이터의 단위를 정하기 위한 로직
  const prefixUnit = !lastItem
    ? 1
    : lastItem.inBps > 10 ** 5 && lastItem.outBps > 10 ** 5
      ? SIPrefix.Mega
      : SIPrefix.Kilo;

  const disabledDate: DatePickerProps['disabledDate'] = (current, { from }) => {
    if (from) {
      return Math.abs(current.diff(from, 'days')) >= 7;
    }

    return false;
  };

  return (
    <Wrapper>
      <div className="header">
        <RangePicker
          value={dateRange}
          disabledDate={disabledDate}
          onChange={setDateRange}
        />
        <Button>
          <ExcelSymbol />
        </Button>
      </div>
      <div className="charts-wrapper">
        {!datasets ? (
          <NoData />
        ) : (
          <>
            <SingleUsageLineChart
              dataset={datasets.cpu}
              name="CPU 사용률"
              minHeight="160px"
            />
            <SingleUsageLineChart
              dataset={datasets.memory}
              name="메모리 사용률"
              minHeight="160px"
            />
            <SingleUsageLineChart
              dataset={datasets.disk}
              name="디스크 사용률"
              minHeight="160px"
            />
            <DoubleTrafficLineChart
              dataset={datasets.traffic}
              minHeight="160px"
              unit={prefixUnit === SIPrefix.Mega ? 'Mbps' : 'kbps'}
            />
          </>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .header {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  .charts-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export default PerfSingleContent;
