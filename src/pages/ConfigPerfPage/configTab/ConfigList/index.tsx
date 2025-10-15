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
import { useGetConfigDevicesByFilterQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { configPerfSearchParamsSchema } from '@/services/validation/configPerf';
import { ResConfigDevicesByFilter } from '@/types/api/configPerf';
import TableHeader from './TableHeader';

const ConfigList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { branchId } = useParams();
  const parsedBranchId = intIdSchema.parse(branchId);
  const { pathname } = useLocation();
  const { page, search, deviceType, sort } = configPerfSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { data: resDevicesByFilter, isLoading } =
    useGetConfigDevicesByFilterQuery({
      selectedBranch: parsedBranchId,
      deviceType,
      search,
      page,
      sort,
    });

  const columns = useMemo<
    TableColumnsType<ResConfigDevicesByFilter['deviceList'][number]>
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
        title: '카메라명',
        dataIndex: 'managementNm',
        key: 'managementNm',
        ellipsis: true,
        //width: '16%',
        align: 'center',
      },
      {
        title: '종류',
        dataIndex: 'deviceKindNm',
        key: 'deviceKindNm',
        ellipsis: true,
        width: '12%',
        align: 'center',
      },
      {
        title: '접속 상태',
        dataIndex: 'deviceKindNm2',
        key: 'deviceKindNm2',
        ellipsis: true,
        width: '12%',
        align: 'center',
      },
      {
        title: '화각 상태',
        dataIndex: 'deviceNm',
        key: 'deviceNm',
        ellipsis: true,
        render: (value, record) => (
          <Link to={`${pathname}/${record.deviceKey}`}>{value}</Link>
        ),
        align: 'center',
        width: '12%'
      },
      {
        title: '알람 레벨',
        dataIndex: 'deviceIp',
        key: 'deviceIp',
        ellipsis: true,
        width: '12%',
        align: 'center',
      },
      {
        title: '수동 화각 분석',
        dataIndex: 'manageYnNm',
        key: 'manageYnNm',
        ellipsis: true,
        width: '12%',
        align: 'center',
      },
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
        dataSource={resDevicesByFilter?.deviceList}
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
      padding: 1.7rem 1.2rem;
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

export default ConfigList;
