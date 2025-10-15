import { useMemo } from 'react';
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import { useGetPerfDevicesByFilterQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { configPerfSearchParamsSchema } from '@/services/validation/configPerf';
import { ResPerfDevicesByFilter } from '@/types/api/configPerf';
import { formatNumber, truncateFloatToNDecimals } from '@/utils/formatters';
import TableHeader from './TableHeader';

const PerfList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { branchId } = useParams();
  const parsedBranchId = intIdSchema.parse(branchId);
  const { pathname } = useLocation();
  const { page, search, deviceType, sort } = configPerfSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { data: resDevicesByFilter, isLoading } =
    useGetPerfDevicesByFilterQuery({
      selectedBranch: parsedBranchId,
      deviceType,
      search,
      page,
      sort,
    });

  const columns = useMemo<
    TableColumnsType<ResPerfDevicesByFilter['devicePerformanceList'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        ellipsis: true,
        width: '5%',
        align: 'center',
      },
      {
        title: '소속',
        dataIndex: 'managementNm',
        key: 'managementNm',
        ellipsis: true,
        width: '16%',
        align: 'center',
      },
      {
        title: '대분류',
        dataIndex: 'deviceKindNm',
        key: 'deviceKindNm',
        ellipsis: true,
        width: '12%',
        align: 'center',
      },
      {
        title: '소분류',
        dataIndex: 'deviceKindNm2',
        key: 'deviceKindNm2',
        ellipsis: true,
        width: '12%',
        align: 'center',
      },
      {
        title: '장비명',
        dataIndex: 'deviceNm',
        key: 'deviceNm',
        ellipsis: true,
        render: (value, record) => (
          <Link to={`${pathname}/${record.deviceKey}`}>{value}</Link>
        ),
        align: 'center',
      },
      {
        title: '아이피',
        dataIndex: 'deviceIp',
        key: 'deviceIp',
        ellipsis: true,
        align: 'center',
      },
      {
        title: '사용률(%)',
        children: [
          {
            title: 'CPU',
            dataIndex: 'cpuUtil',
            key: 'cpuUtil',
            ellipsis: true,
            width: '8%',
            render: value => truncateFloatToNDecimals(value),
            align: 'center',
          },
          {
            title: '메모리',
            dataIndex: 'memUtil',
            key: 'memUtil',
            ellipsis: true,
            width: '8%',
            render: value => truncateFloatToNDecimals(value),
            align: 'center',
          },
          // {
          //   title: '디스크',
          //   dataIndex: 'usageUtil',
          //   key: 'usageUtil',
          //   ellipsis: true,
          //   width: '8%',
          //   render: value => truncateFloatToNDecimals(value),
          //   align: 'center',
          // },
        ],
      },
      // {
      //   title: '트래픽(BPS)',
      //   children: [
      //     {
      //       title: 'Inbound',
      //       dataIndex: 'inBps',
      //       key: 'inBps',
      //       ellipsis: true,
      //       width: '10%',
      //       render: value => formatNumber(value, 0, 0),
      //       align: 'center',
      //     },
      //     {
      //       title: 'Outbound',
      //       dataIndex: 'outBps',
      //       key: 'outBps',
      //       ellipsis: true,
      //       width: '10%',
      //       render: value => formatNumber(value, 0, 0),
      //       align: 'center',
      //     },
      //   ],
      // },
    ],
    [pathname],
  );

  return (
    <Wrapper>
      <TableHeader />
      <Table
        loading={{
          spinning: isLoading,
          indicator: <RegularLoadingSpinner />,
        }}
        rowKey={record => record.deviceKey}
        columns={columns}
        dataSource={resDevicesByFilter?.devicePerformanceList}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
          current: resDevicesByFilter?.page.page,
          pageSize: resDevicesByFilter?.page.rows,
          total: resDevicesByFilter?.page.records,
          // showTotal: total => `총 ${formatNumber(total)}개`,
          onChange: page => {
            setSearchParams({
              ...Object.fromEntries(searchParams),
              page: page.toString(),
            });
          },
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .ant-table-wrapper {
    height: 100%;
    border-bottom: none;

    .ant-table-thead > tr > th {
      padding: 0.6rem 1.2rem;
      background-color: ${themeGet('colors.bgDescriptionsLabel')};
      color: ${themeGet('colors.textDescriptionsLabel')};
      font-size: 18px;
    }

    .ant-table-thead > tr > th:not(:last-child) {
      border-right: 1px solid #b7b7b7;
      border-bottom: none;
    }

    .ant-table-tbody > tr > td {
      padding: 1.6rem 1.2rem;
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

    .ant-table-cell {
      a {
        color: ${themeGet('colors.textTableDevice')};
      }
    }

    .ant-pagination {
      margin: 3rem 0 0 0;
    }
  }
`;

export default PerfList;
