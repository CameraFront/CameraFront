import { useEffect } from 'react';
import { Table } from 'antd';
import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useLazyGetUnregisteredPhoneListDataQuery } from '@/services/api/dashboard';
import { UnregisteredPhoneListWidgetData } from '@/types/api/dashboard';
import { columns } from './columns';
import { useAppSelector } from '@/app/hooks';

interface Props {
  data: UnregisteredPhoneListWidgetData;
}

const UnregisteredPhoneList = ({ data }: Props) => {
  const { isFullScreenMode } = useAppSelector(store => store.dashboard);
  const [
    getUnregisteredPhonesByTypeData,
    { data: widgetData, isError, isLoading },
  ] = useLazyGetUnregisteredPhoneListDataQuery({
    pollingInterval: data.options.updateInterval * 1000,
  });
  const hasFullData = widgetData?.listPhoneUnReg.length === 20;

  useEffect(() => {
    getUnregisteredPhonesByTypeData({
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
      phoneTypes: data.options.phoneTypes,
      page: 1,
    });
  }, [
    data.apiUrl,
    data.id,
    data.type,
    data.options.phoneTypes,
    getUnregisteredPhonesByTypeData,
  ]);

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  return (
    <Wrapper 
      $isFullScreenMode={isFullScreenMode} 
      $hasFullData={hasFullData}>
      <Table
        rowKey="phoneKey"
        dataSource={widgetData.listPhoneUnReg}
        columns={columns}
        loading={isLoading}
        pagination={{
          position: ['bottomCenter'],
          simple: true,
          current: widgetData.page.page,
          pageSize: widgetData.page.rows,
          total: widgetData.page.records,
          // showTotal: total => `총 ${total}개`,
          onChange: page => {
            getUnregisteredPhonesByTypeData({
              apiUrl: data.apiUrl,
              type: data.type,
              id: data.id,
              phoneTypes: data.options.phoneTypes,
              page,
            });
          },
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div<{ 
  $isFullScreenMode: boolean 
  $hasFullData: boolean;
}>`
  width: 100%;
  height: 100%;

  .ant-table-wrapper {
    height: 100%;

    .ant-table-thead > tr > th {
      padding: 0.9rem 1.2rem;
      font-size: 14px;
    }

    .ant-table-tbody > tr > td {
      padding: 0.9rem 1.2rem;
      font-size: 14px;
    }
  }

  .ant-table-wrapper {
    margin-top: -7px;

    .ant-spin-nested-loading {
      height: 100%;

      .ant-spin-container {
        height: 100%;

        .ant-table {
           height: ${({ $isFullScreenMode, $hasFullData }) =>
            $isFullScreenMode && $hasFullData ? 'calc(100% - 30px)' : 'auto'};

          .ant-table-container {
            height: 100%;

            .ant-table-content {
              height: 100%;

              table {
                height: 100%;

                .ant-table-thead {
                  height: ${({ $isFullScreenMode }) =>
                    $isFullScreenMode ? '46.8px' : 'auto'};

                  .ant-table-cell {
                    background-color: ${themeGet('colors.bgWidget')};
                    color: ${themeGet('colors.textDescriptionsLabel')};
                    border-bottom: 1px solid #B7B7B7;
                    font-weight: 400;
                    &::before {
                      background: none;
                    }
                  }
                }

                .ant-table-tbody {
                  .ant-table-cell {
                    background-color: ${themeGet('colors.bgWidget')};
                    color: ${themeGet('colors.textMain')};
                    border-bottom: 1px solid ${themeGet('colors.borderTableBottom')};
                  }
                }
              }
            }
          }
        }

        .ant-table-pagination {
          flex: none;
        }
      }
    }
  }
`;
export default UnregisteredPhoneList;
