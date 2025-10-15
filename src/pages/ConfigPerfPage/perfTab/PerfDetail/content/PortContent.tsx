import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Table, TableColumnsType, Tag } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import SimpleUsageLineChart from '@/components/charts/SimpleUsageLineChart';
import { useGetPortPerfInfoByDeviceQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { configPerfSearchParamsSchema } from '@/services/validation/configPerf';
import {
  ResDiskPerfInfoByDevice,
  ResPortPerfInfoByDevice,
} from '@/types/api/configPerf';
import { SIPrefix } from '@/types/enum';
import { divideBySIPrefix, formatNumber } from '@/utils/formatters';

const PortContent = () => {
  const { deviceId } = useParams();
  const parsedDeviceId = intIdSchema.parse(deviceId);
  const [searchParams, setSearchParams] = useSearchParams();
  const { fromDate, toDate, page } = configPerfSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { data: portPerfInfo, isLoading: isPortPerfInfoLoading } =
    useGetPortPerfInfoByDeviceQuery({
      deviceId: parsedDeviceId ?? 0,
      fromDate,
      toDate,
      page,
    });

  const dataset = useMemo(
    () => ({
      dimensions: ['label', 'value'],
      source:
        portPerfInfo?.networkPerformanceList.map(item => ({
          label: item.date,
          value: item.outbnd,
        })) || [],
    }),
    [portPerfInfo],
  );

  const columns = useMemo<
    TableColumnsType<ResPortPerfInfoByDevice['networkPerformanceList'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
      },
      {
        title: '포트 번호',
        dataIndex: 'skey',
        key: 'skey',
        align: 'center',
      },
      {
        title: '포트속도',
        dataIndex: 'speed',
        key: 'speed',
        align: 'center',
      },
      {
        title: '평균 수신량(MBps)',
        dataIndex: 'inBps',
        key: 'inBps',
        render: (_, record) =>
          `${divideBySIPrefix(record.inBps, SIPrefix.Mega, 2)}`,
        align: 'center',
      },
      {
        title: '평균 송신량(MBps)',
        dataIndex: 'outBps',
        key: 'outBps',
        render: (_, record) =>
          `${divideBySIPrefix(record.outBps, SIPrefix.Mega, 2)}`,
        align: 'center',
      },
      {
        title: '평균 수신률(%)',
        dataIndex: 'inbnd',
        key: 'inbnd',
        render: (_, record) => `${formatNumber(record.inbnd, 0, 2)}`,
        align: 'center',
      },
      {
        title: '평균 송신률(%)',
        dataIndex: 'outbnd',
        key: 'outbnd',
        render: (_, record) => `${formatNumber(record.outbnd, 0, 2)}`,
        align: 'center',
      },
      {
        title: '상태',
        dataIndex: 'networkStatus',
        key: 'networkStatus',
        render: (_, record) => (
          <Tag
            color={
              record.networkStatus === '위험'
                ? 'error'
                : record.networkStatus === '경고'
                  ? 'warning'
                  : 'success'
            }
          >
            {record.networkStatus}
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
        name="포트 송신률"
        unit="%"
        dataset={dataset}
        xAxisLabel="수집시간"
        yAxisLabel="평균사용률"
        minHeight="180px"
      />
      <Table<ResPortPerfInfoByDevice['networkPerformanceList'][number]>
        loading={{
          spinning: isPortPerfInfoLoading,
          indicator: <RegularLoadingSpinner />,
        }}
        size="small"
        rowKey={record => record.no}
        columns={columns}
        dataSource={portPerfInfo?.networkPerformanceList}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
          current: portPerfInfo?.page.page,
          pageSize: portPerfInfo?.page.rows,
          total: portPerfInfo?.page.records,
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

export default PortContent;
