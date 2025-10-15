import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { App, Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import SyncButton from '@/components/buttons/SyncButton';
import { useGetPhoneStatisticsByFilterQuery } from '@/services/api/telephoneExchange';
import { intIdSchema } from '@/services/validation/common';
import { telephoneExchangeSearchParamsSchema } from '@/services/validation/telephoneExchange';
import { ResPhoneStatisticsByFilter } from '@/types/api/telephoneExchange';
import { formatNumber } from '@/utils/formatters';

const TableSection = () => {
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page } = telephoneExchangeSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { branchId } = useParams();
  const parsedBranchId = intIdSchema.parse(branchId);

  const {
    data: phoneStatistics,
    isLoading: isPhoneStatisticsLoading,
    refetch,
  } = useGetPhoneStatisticsByFilterQuery({
    branchId: parsedBranchId,
    page,
  });

  const columns: TableColumnsType<
    ResPhoneStatisticsByFilter['listPhoneRegStat'][number]
  > = useMemo(
    () => [
      {
        title: 'No.',
        dataIndex: 'NO',
        key: 'no',
        ellipsis: true,
        width: '4%',
        align: 'center',
      },
      {
        title: '수집일시',
        dataIndex: 'collectDateTime',
        key: 'collectDateTime',
        ellipsis: true,
        width: '15%',
        align: 'center',
      },
      {
        title: '소속',
        dataIndex: 'managementNm',
        key: 'managementNm',
        ellipsis: true,
        width: '15%',
        align: 'center',
      },
      {
        title: '비등록 전화기 수',
        dataIndex: 'unRegCnt',
        key: 'unRegCnt',
        ellipsis: true,
        width: '15%',
        align: 'center',
      },
      {
        title: '관리 전화기 수',
        dataIndex: 'totalPhones',
        key: 'totalPhones',
        ellipsis: true,
        width: '15%',
        align: 'center',
      },
    ],
    [],
  );

  const onSync = async () => {
    await refetch();
    message.success('최신 데이터로 업데이트되었습니다.');
  };

  return (
    <Wrapper>
      <div className="header">
        <SyncButton
          isLoading={isPhoneStatisticsLoading}
          disabled={isPhoneStatisticsLoading}
          onClick={onSync}
        />
      </div>
      {phoneStatistics && (
        <Table
          loading={{
            indicator: <RegularLoadingSpinner />,
            spinning: isPhoneStatisticsLoading,
          }}
          size="small"
          rowKey={row => row.NO}
          columns={columns}
          dataSource={phoneStatistics.listPhoneRegStat}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: phoneStatistics.page.page,
            pageSize: phoneStatistics.page.rows,
            total: phoneStatistics.page.records,
            showTotal: total =>
              `${
                (phoneStatistics.page.page - 1) * phoneStatistics.page.rows + 1
              }-${
                phoneStatistics.page.page * phoneStatistics.page.rows
              } / 총 ${formatNumber(total)}개`,
            onChange: page => {
              setSearchParams(prev => {
                prev.set('page', page.toString());
                return prev;
              });
            },
          }}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1.6rem;

    margin-bottom: 8px;
  }

  .ant-table-wrapper {
    max-width: 100vw;

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

    .ant-table-cell {
      a {
        color: ${themeGet('colors.textTableDevice')};
      }
    }
  }
`;

export default TableSection;
