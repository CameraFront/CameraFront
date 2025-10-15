import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Table, TableColumnsType, Tag } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import SimpleUsageLineChart from '@/components/charts/SimpleUsageLineChart';
import { useGetDiskPerfInfoByDeviceQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { configPerfSearchParamsSchema } from '@/services/validation/configPerf';
import { ResDiskPerfInfoByDevice } from '@/types/api/configPerf';
import { SIPrefix } from '@/types/enum';
import { divideBySIPrefix, formatNumber } from '@/utils/formatters';

const DiskContent = () => {
  const { deviceId } = useParams();
  const parsedDeviceId = intIdSchema.parse(deviceId);
  const [searchParams, setSearchParams] = useSearchParams();
  const { fromDate, toDate, page } = configPerfSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { data: diskPerfInfo, isLoading: isDiskPerfInfoLoading } =
    useGetDiskPerfInfoByDeviceQuery({
      deviceId: parsedDeviceId ?? 0,
      fromDate,
      toDate,
      page,
    });

  const dataset = useMemo(
    () => ({
      dimensions: ['label', 'value'],
      source:
        diskPerfInfo?.fsPerformanceList.map(item => ({
          label: item.date,
          value: item.usageUtil,
        })) || [],
    }),
    [diskPerfInfo],
  );

  const columns = useMemo<
    TableColumnsType<ResDiskPerfInfoByDevice['fsPerformanceList'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        align: 'center',
        ellipsis: true,
        width: '5%',
      },
      // {
      //   title: '파일시스템 번호',
      //   dataIndex: 'skey',
      //   key: 'skey',
      //   align: 'center',
      //   ellipsis: true,
      //   width: '5%',
      // },
      {
        title: '파일시스템',
        dataIndex: 'skey',
        key: 'skey',
        align: 'center',
        ellipsis: true,
        width: '30%',
      },
      {
        title: '수집시간',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        ellipsis: true,
        width: '15%',
      },
      {
        title: '총용량(GB)',
        dataIndex: 'totalSize',
        key: 'totalSize',
        render: (_, record) =>
          `${divideBySIPrefix(record.totalSize, SIPrefix.Kilo, 2)}`,
        align: 'center',
        ellipsis: true,
        width: '15%',
      },
      {
        title: '평균 사용량(GB)',
        dataIndex: 'avgUseSize',
        key: 'avgUseSize',
        render: (_, record) =>
          `${divideBySIPrefix(record.avgUseSize, SIPrefix.Kilo, 2)}`,
        align: 'center',
        ellipsis: true,
        width: '10%',
      },
      {
        title: '평균 사용률(%)',
        dataIndex: 'usageUtil',
        key: 'usageUtil',
        render: (_, record) => `${formatNumber(record.usageUtil, 0, 2)}`,
        align: 'center',
        ellipsis: true,
        width: '10%',
      },
      {
        title: '상태',
        dataIndex: 'fsStatus',
        key: 'fsStatus',
        render: (_, record) => (
          <Tag
            color={
              record.fsStatus === '위험'
                ? 'error'
                : record.fsStatus === '경고'
                  ? 'warning'
                  : 'success'
            }
          >
            {record.fsStatus}
          </Tag>
        ),
        align: 'center',
        ellipsis: true,
        width: '10%',
      },
    ],
    [],
  );
  return (
    <Wrapper>
      {/* <SimpleUsageLineChart
        name="파일시스템 사용률"
        unit="%"
        dataset={dataset}
        xAxisLabel="수집시간"
        yAxisLabel="평균사용률"
        minHeight="180px"
      /> */}
      <Table<ResDiskPerfInfoByDevice['fsPerformanceList'][number]>
        loading={{
          spinning: isDiskPerfInfoLoading,
          indicator: <RegularLoadingSpinner />,
        }}
        size="small"
        rowKey={record => record.no}
        columns={columns}
        dataSource={diskPerfInfo?.fsPerformanceList}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
          current: diskPerfInfo?.page.page,
          pageSize: diskPerfInfo?.page.rows,
          total: diskPerfInfo?.page.records,
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
export default DiskContent;
