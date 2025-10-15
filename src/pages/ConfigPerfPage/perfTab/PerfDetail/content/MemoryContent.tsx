import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Table, TableColumnsType, Tag } from 'antd';
import styled, { useTheme } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import SimpleUsageLineChart from '@/components/charts/SimpleUsageLineChart';
import { useGetMemoryPerfChartInfoByDeviceQuery, useGetMemoryPerfInfoByDeviceQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { configPerfSearchParamsSchema } from '@/services/validation/configPerf';
import { ResMemoryPerfInfoByDevice } from '@/types/api/configPerf';
import { SIPrefix } from '@/types/enum';
import { divideBySIPrefix, formatNumber } from '@/utils/formatters';
import dayjs from 'dayjs';
import { DATE_SHORT_FORMAT } from '@/config';

const MemoryContent = () => {
  const theme = useTheme();
  const { deviceId } = useParams();
  const parsedDeviceId = intIdSchema.parse(deviceId);
  const [searchParams, setSearchParams] = useSearchParams();
  const { fromDate, toDate, page } = configPerfSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { data: memoryPerfInfo, isLoading: isMemoryPerfInfoLoading } =
    useGetMemoryPerfInfoByDeviceQuery({
      deviceId: parsedDeviceId ?? 0,
      fromDate,
      toDate,
      page,
    });

  const { data: memoryPerfChartInfo, isLoading: isMemoryPerfChartInfoLoading } =
    useGetMemoryPerfChartInfoByDeviceQuery({
      deviceId: parsedDeviceId ?? 0,
      fromDate,
      toDate,
      page,
    });

  const dataset = useMemo(
    () => ({
      dimensions: ['label', 'value'],
      source:
        memoryPerfInfo?.memPerformanceList.map(item => ({
          label: item.date,
          value: item.memUtil,
        })) || [],
    }),
    [memoryPerfInfo],
  );

  const chartDataset = useMemo(
    () => ({
      dimensions: ['label', 'value'],
      source: memoryPerfChartInfo?.map(item => ({
        label: item.date,
          //date: dayjs(item.date).format(DATE_SHORT_FORMAT),
        //avgUseMem: item.avgUseMem,
        value: item.memUtil,
      })) || [],
    }),
    [memoryPerfChartInfo],
  );

  const columns = useMemo<
    TableColumnsType<ResMemoryPerfInfoByDevice['memPerformanceList'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
      },
      {
        title: 'Memory 번호',
        dataIndex: 'skey',
        key: 'skey',
        align: 'center',
      },
      {
        title: '수집시간',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
      },
      {
        title: '총 용량(MB)',
        dataIndex: 'totalMem',
        key: 'totalMem',
        render: (_, record) =>
          `${divideBySIPrefix(record.totalMem, SIPrefix.Kilo, 2)}`,
        align: 'center',
      },
      {
        title: '평균 사용량(MB)',
        dataIndex: 'avgUseMem',
        key: 'avgUseMem',
        render: (_, record) =>
          `${divideBySIPrefix(record.avgUseMem, SIPrefix.Kilo, 2)}`,
        align: 'center',
      },
      {
        title: '평균 사용률(%)',
        dataIndex: 'memUtil',
        key: 'memUtil',
        render: (_, record) => `${formatNumber(record.memUtil, 0, 2)}`,
        align: 'center',
      },
      {
        title: '상태',
        dataIndex: 'memStatus',
        key: 'memStatus',
        render: (_, record) => (
          <Tag
            color={
              record.memStatus === '위험'
                ? 'error'
                : record.memStatus === '경고'
                  ? 'warning'
                  : 'success'
            }
          >
            {record.memStatus}
          </Tag>
        ),
        align: 'center',
      },
    ],
    [],
  );
  return (
    <Wrapper>
      <SimpleUsageLineChart
        name="Memory 평균사용률"
        unit="%"
        dataset={chartDataset}
        xAxisLabel="label"
        yAxisLabel="value"
        minHeight="180px"
      />
      <Table<ResMemoryPerfInfoByDevice['memPerformanceList'][number]>
        loading={{
          spinning: isMemoryPerfInfoLoading || isMemoryPerfChartInfoLoading,
          indicator: <RegularLoadingSpinner />,
        }}
        size="small"
        rowKey={record => record.no}
        columns={columns}
        dataSource={memoryPerfInfo?.memPerformanceList}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
          current: memoryPerfInfo?.page.page,
          pageSize: memoryPerfInfo?.page.rows,
          total: memoryPerfInfo?.page.records,
          showTotal: total => `총 ${formatNumber(total)}개`,
          onChange: page => {
            setSearchParams(prev => {
              prev.set('page', page.toString());
              return prev;
            });
          },
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeGet('spacing.s3')};
  margin-top: 0.5rem;

  .ant-table-wrapper {
    height: 100%;
    margin-top: 3rem;

    .ant-table-thead > tr > th {
      padding: 1.7rem 1.2rem;
      background-color: ${themeGet('colors.bgDescriptionsLabel')};
      color: ${themeGet('colors.textDescriptionsLabel')};
      font-size: 18px;
    }

    .ant-table-thead > tr > th:not(:last-child) {
      border-right: 1px solid #b7b7b7;
      border-bottom: none;
    }

    .ant-table-tbody > tr > td {
      padding: 1.8rem 1.2rem;
      font-size: 18px;
      background-color: ${themeGet('colors.bgDescriptionsContent')};
      color: ${themeGet('colors.textDescriptionsContent')};
    }

    .ant-table-tbody > tr:not(:last-child) > td {
      border-bottom: 1px solid ${themeGet('colors.borderTableBottom')};
    }

    .ant-table-tbody > tr:last-child > td {
      border-bottom: none;
    }
    .ant-pagination {
      margin: 5rem 0 1.6rem 0;
    }
  }
`;
export default MemoryContent;
