import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Table, TableColumnsType, Tag } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import SimpleUsageLineChart from '@/components/charts/SimpleUsageLineChart';
import { useGetCpuPerfGraphInfoByDeviceQuery, useGetCpuPerfInfoByDeviceQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { configPerfSearchParamsSchema } from '@/services/validation/configPerf';
import { ResCpuPerfInfoByDevice } from '@/types/api/configPerf';
import { formatNumber } from '@/utils/formatters';

const CpuContent = () => {
  const { deviceId } = useParams();
  const parsedDeviceId = intIdSchema.parse(deviceId);
  const [searchParams, setSearchParams] = useSearchParams();
  const { fromDate, toDate, page } = configPerfSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { data: cpuPerfInfo, isLoading: isCpuPerfInfoLoading } =
    useGetCpuPerfInfoByDeviceQuery({
      deviceId: parsedDeviceId ?? 0,
      fromDate,
      toDate,
      page,
    });

  const { data: cpuPerfGraphInfo, isLoading: isCpuPerfGraphInfoLoading } =
    useGetCpuPerfGraphInfoByDeviceQuery({
      deviceId: parsedDeviceId ?? 0,
      fromDate,
      toDate,
      page,
  });

  const dataset = useMemo(
    () => ({
      dimensions: ['label', 'value'],
      source:
        cpuPerfGraphInfo?.map(item => ({
          label: item.date,
          value: item.cpuUtil,
        })) || [],
    }),
    [cpuPerfGraphInfo],
  );

  const columns = useMemo<
    TableColumnsType<ResCpuPerfInfoByDevice['cpuPerformanceList'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
      },
      {
        title: 'CPU 번호',
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
        title: '평균 사용률',
        dataIndex: 'cpuUtil',
        key: 'cpuUtil',
        render: (_, record) => `${formatNumber(record.cpuUtil, 0, 2)}%`,
        align: 'center',
      },
      {
        title: '상태',
        dataIndex: 'cpuStatus',
        key: 'cpuStatus',
        render: (_, record) => (
          <Tag
            color={
              record.cpuStatus === '위험'
                ? 'error'
                : record.cpuStatus === '경고'
                  ? 'warning'
                  : 'success'
            }
          >
            {record.cpuStatus}
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
        name="CPU 사용률"
        unit="%"
        dataset={dataset}
        xAxisLabel="수집시간"
        yAxisLabel="평균사용률"
        minHeight="180px"
      />
      <Table<ResCpuPerfInfoByDevice['cpuPerformanceList'][number]>
        loading={{
          spinning: isCpuPerfInfoLoading,
          indicator: <RegularLoadingSpinner />,
        }}
        size="small"
        rowKey={record => record.no}
        columns={columns}
        dataSource={cpuPerfInfo?.cpuPerformanceList}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
          current: cpuPerfInfo?.page.page,
          pageSize: cpuPerfInfo?.page.rows,
          total: cpuPerfInfo?.page.records,
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
export default CpuContent;
