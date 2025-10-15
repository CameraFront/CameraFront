import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import { useGetProcessDetailsQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { ResProcessDetails } from '@/types/api/configPerf';
import { YEAR_DATE_TIME_FORMAT } from '@/config';
import TableHeader from './TableHeader';

const ProcessDetail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { deviceKey } = useParams();
  const parsedDeviceId = intIdSchema.parse(deviceKey);

  const { data: ProcessDetail, isLoading } = useGetProcessDetailsQuery({
    deviceKey: parsedDeviceId ?? 0,
    page: 1,
  });

  const columns = useMemo<
    TableColumnsType<ResProcessDetails['listProcess'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        ellipsis: true,
        width: '6%',
        align: 'center',
      },
      {
        title: '인덱스',
        dataIndex: 'seqNum',
        key: 'seqNum',
        ellipsis: true,
        width: '8%',
        align: 'center',
      },
      {
        title: '프로세스명',
        dataIndex: 'procNm',
        key: 'procNm',
        ellipsis: true,
        width: '14%',
        align: 'center',
      },
      {
        title: '경로',
        dataIndex: 'procPath',
        key: 'procPath',
        ellipsis: true,
        align: 'center',
        width: '14%',
      },
      {
        title: '파라미터',
        dataIndex: 'procParam',
        key: 'procParam',
        ellipsis: true,
        width: '14%',
        align: 'center',
      },
      {
        title: '상태',
        dataIndex: 'procStat',
        key: 'procStat',
        ellipsis: true,
        width: '6%',
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
    [],
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
        dataSource={ProcessDetail?.listProcess}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
          current: ProcessDetail?.page.page,
          pageSize: ProcessDetail?.page.rows,
          total: ProcessDetail?.page.records,
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
      padding: 1.5rem 1.2rem;
      background-color: ${themeGet('colors.bgDescriptionsLabel')};
      color: ${themeGet('colors.textDescriptionsLabel')};
      font-size: 18px;
    }

    .ant-table-thead > tr > th:not(:last-child) {
      border-right: 1px solid #b7b7b7;
      border-bottom: none;
    }

    .ant-table-tbody > tr > td {
      padding: 1.2rem;
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
  }
`;
export default ProcessDetail;
