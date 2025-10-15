import { Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import { WarningOutlined } from '@ant-design/icons';
import { themeGet } from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useAppSelector } from '@/app/hooks';
import { useGetEventStatusByDeviceTypesDataQuery } from '@/services/api/dashboard';
import { EventStatusByDeviceTypesWidgetData } from '@/types/api/dashboard';

type Props = {
  data: EventStatusByDeviceTypesWidgetData;
};

interface SourceItem {
  key: number;
  deviceKindNm: string;
  managedDeviceCount: number;
  totalEvents: number;
}

const columns: TableColumnsType<SourceItem> = [
  {
    title: '디바이스명',
    dataIndex: 'deviceKindNm',
    key: 'deviceKindNm',
    ellipsis: true,
    width: '40%',
  },
  {
    title: '장애',
    dataIndex: 'totalEvents',
    key: 'totalEvents',
    ellipsis: true,
    width: '25%',
    render(value) {
      return (
        <span>{value}대</span>
      );
    },
  },
  
  {
    title: '관리',
    dataIndex: 'managedDeviceCount',
    key: 'managedDeviceCount',
    ellipsis: true,
    width: '25%',
    render(value) {
      return (
        <span>{value}대</span>
      );
    },
  },
  {
    title: '',
    dataIndex: 'hasEvent',
    key: 'hasEvent',
    width: '1rem',
    render(_, record) {
      if (record.totalEvents) {
        return <WarningOutlined style={{ color: '#FE4F4C' }} />;
      }
      return null;
    },
  },
];

const EventStatusByDeviceTypes = ({ data }: Props) => {
  const { isFullScreenMode } = useAppSelector(store => store.dashboard);
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetEventStatusByDeviceTypesDataQuery(
    {
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
      deviceTypes: data.options.deviceTypes,
      eventTypes: data.options.eventTypes,
    },
    {
      pollingInterval: data.options.updateInterval * 1000,
    },
  );

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;
  const dataSource = widgetData.deviceKindList.map(el => ({
    key: el.deviceKind,
    deviceKindNm: el.deviceKindNm,
    managedDeviceCount: el.managedDeviceCount,
    totalEvents: el.total,
  }));

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper $isFullScreenMode={isFullScreenMode}>
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      </Wrapper>
    </LoadingSpinner>
  );
};
const Wrapper = styled.div<{ $isFullScreenMode: boolean }>`
  width: 100%;
  height: 100%;
  padding: 0.5rem 0;

  .ant-table-wrapper {
    height: 100%;

    .ant-table-thead > tr > th {
      padding: 0.4rem 1.2rem;
      font-size: 14px;
    }

    .ant-table-tbody > tr > td {
      padding: 0.2rem 1.2rem;
      font-size: 14px;
    }
  }

  .ant-table-wrapper {
    margin-top: -7px;
    height: 100%;

    .ant-spin-nested-loading {
      height: 100%;

      .ant-spin-container {
        height: 100%;

        .ant-table {
          height: 100%;

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
                    font-weight: 300;
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

export default EventStatusByDeviceTypes;
