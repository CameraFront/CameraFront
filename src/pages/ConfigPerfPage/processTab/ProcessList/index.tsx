import { useMemo } from 'react';
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import { useGetProcessesByFilterQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { configPerfSearchParamsSchema } from '@/services/validation/configPerf';
import { ResProcessesByFilter } from '@/types/api/configPerf';
import { YEAR_DATE_TIME_FORMAT } from '@/config';
import TableHeader from './TableHeader';

const ProcessList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const { branchId } = useParams();
  const parsedBranchId = intIdSchema.parse(branchId);
  const { page, search, deviceType, sort } = configPerfSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { data: resDevicesByFilter, isLoading } = useGetProcessesByFilterQuery({
    selectedBranch: parsedBranchId,
    deviceType,
    search,
    page,
    sort,
  });

  const columns = useMemo<
    TableColumnsType<ResProcessesByFilter['listProcess'][number]>
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
        title: '인덱스',
        dataIndex: 'seqNum',
        key: 'seqNum',
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
        title: '프로세스명',
        dataIndex: 'procNm',
        key: 'procNm',
        ellipsis: true,
        width: '12%',
        align: 'center',
      },
      {
        title: '경로',
        dataIndex: 'procPath',
        key: 'procPath',
        ellipsis: true,
        width: '12%',
        align: 'center',
      },
      {
        title: '파라미터',
        dataIndex: 'procParam',
        key: 'procParam',
        ellipsis: true,
        width: '12%',
        align: 'center',
      },
      {
        title: '상태',
        dataIndex: 'procStat',
        key: 'procStat',
        ellipsis: true,
        width: '8%',
        render: value => (
          <span style={{ color: value === 1 ? '' : 'red' }}>
            {value === 1 ? '정상' : '장애'}
          </span>
        ),
        align: 'center',
      },
      {
        title: '수집일자',
        dataIndex: 'regDt',
        key: 'regDt',
        ellipsis: true,
        width: '12%',
        render: value => dayjs(value).format(YEAR_DATE_TIME_FORMAT),
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
        rowKey={record => record.no}
        columns={columns}
        dataSource={resDevicesByFilter?.listProcess}
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

export default ProcessList;
