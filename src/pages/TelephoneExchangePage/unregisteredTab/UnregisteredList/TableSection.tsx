import { useEffect, useMemo, useState } from 'react';
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { App, Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import SyncButton from '@/components/buttons/SyncButton';
import {
  useGetPhoneCountQuery,
  useGetUnregisteredPhonesByFilterQuery,
  useGetUnregisteredPhonesByFilterScanQuery,
} from '@/services/api/telephoneExchange';
import { intIdSchema } from '@/services/validation/common';
import { telephoneExchangeSearchParamsSchema } from '@/services/validation/telephoneExchange';
import { ResUnregisteredPhonesByFilter, ResUnregisteredPhonesByFilterScan } from '@/types/api/telephoneExchange';
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
    data: unregisteredPhones,
    isLoading: isUnregisteredPhonesLoading,
    refetch,
  } = useGetUnregisteredPhonesByFilterScanQuery({
    branchId: parsedBranchId,
    page,
  });

  const { data: phoneCount, isLoading: isPhoneCountsLoading } =
    useGetPhoneCountQuery();

  const columns: TableColumnsType<
    ResUnregisteredPhonesByFilterScan['listPhoneUnReg'][number]
  > = useMemo(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        ellipsis: true,
        width: '4%',
        align: 'center',
      },
      {
        title: '소속1',
        dataIndex: 'phoneDepth1',
        key: 'phoneDepth1',
        ellipsis: true,
        width: '15%',
        align: 'center',
      },
      
      {
        title: '소속2',
        dataIndex: 'phoneDepth2',
        key: 'phoneDepth2',
        ellipsis: true,
        width: '15%',
        align: 'center',
      },
      {
        title: '내선번호',
        dataIndex: 'internalNum',
        key: 'internalNum',
        ellipsis: true,
        width: '15%',
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
        title: '관리여부',
        dataIndex: 'manageYnNm',
        key: 'manageYnNm',
        ellipsis: true,
        width: '15%',
        align: 'center',
      }
    ],
    [],
  );

  const onSync = async () => {
    await refetch();
    message.success('최신 정보로 업데이트되었습니다.');
  };

  return (
    <Wrapper>
      <div className="header">
        <p>
          미등록 수 : {unregisteredPhones?.page.records}대 / 관리대수 :{' '}
          {phoneCount?.phoneCount}대
        </p>
        <SyncButton
          isLoading={isUnregisteredPhonesLoading}
          disabled={isUnregisteredPhonesLoading}
          onClick={onSync}
        />
      </div>
      {unregisteredPhones && (
        <Table
          loading={{
            indicator: <RegularLoadingSpinner />,
            spinning: isUnregisteredPhonesLoading,
          }}
          size="small"
          rowKey={row => row.phoneKey}
          columns={columns}
          dataSource={unregisteredPhones.listPhoneUnReg}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: unregisteredPhones.page.page,
            pageSize: unregisteredPhones.page.rows,
            total: unregisteredPhones.page.records,
            showTotal: total =>
              `${
                (unregisteredPhones.page.page - 1) *
                  unregisteredPhones.page.rows +
                1
              }-${
                unregisteredPhones.page.page * unregisteredPhones.page.rows
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

    margin-bottom: 10px;
  }

  .ant-table-wrapper {
    max-width: 100vw;

    .ant-table-thead > tr > th {
      padding: 1.7rem 1.2rem !important;
      background-color: ${themeGet('colors.bgDescriptionsLabel')};
      color: ${themeGet('colors.textDescriptionsLabel')};
      font-size: 18px;
    }

    .ant-table-thead > tr > th:not(:last-child) {
      border-right: 1px solid #b7b7b7;
      border-bottom: none;
    }

    .ant-table-tbody > tr > td {
      padding: 1.7rem 1.2rem !important;
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

export default TableSection;
