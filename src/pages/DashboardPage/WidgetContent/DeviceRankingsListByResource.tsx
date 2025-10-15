import { Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useAppSelector } from '@/app/hooks';
import { useGetDeviceRankingsByResourceDataQuery } from '@/services/api/dashboard';
import {
  DeviceRankingsListByResourceWidgetData,
  ResDeviceRankingsByResourceData,
} from '@/types/api/dashboard';
import { RankCount, ResourceType } from '@/types/enum';
import { isNotNullish } from '@/utils/nullChecking';

type Props = {
  data: DeviceRankingsListByResourceWidgetData;
};

const LABEL = {
  [ResourceType.Cpu]: 'CPU',
  [ResourceType.Memory]: 'Memory',
  [ResourceType.Disk]: 'Disk',
  [ResourceType.Traffic]: 'Traffic',
};

const DeviceRankingsListByResource = ({ data }: Props) => {
  const { isFullScreenMode } = useAppSelector(store => store.dashboard);
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetDeviceRankingsByResourceDataQuery(
    {
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
    },
    {
      pollingInterval: data.options.updateInterval * 1000,
    },
  );

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  const rankCount = data.options.rankCount === RankCount.Top10 ? 10 : 5;
  const isPercentUnit =
    data.options.selectedResource === ResourceType.Cpu ||
    data.options.selectedResource === ResourceType.Memory ||
    data.options.selectedResource === ResourceType.Disk;

  const title = isNotNullish(data.options.selectedResource)
    ? LABEL[data.options.selectedResource]
    : '';

  const columns: TableColumnsType<
    ResDeviceRankingsByResourceData['usageUtil'][0]
  > = [
    {
      title: '순위',
      dataIndex: 'ranking',
      key: 'ranking',
      width: '14%',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '지역',
      dataIndex: 'managementNm',
      key: 'managementNm',
      ellipsis: true,
    },
    {
      title: '장비종류',
      dataIndex: 'deviceKindNm',
      key: 'deviceKindNm',
      width: '13%',
      ellipsis: true,
    },
    {
      title: '장비명',
      dataIndex: 'deviceNm',
      key: 'deviceNm',
      width: '30%',
      ellipsis: true,
    },
    {
      // title: (
      //   <Tooltip
      //     title={`${title} ${isPercentUnit ? '사용률(%)' : '사용량(Mbps)'}`}
      //   >
      //     {title}
      //   </Tooltip>
      // ),
      title: `${title} ${isPercentUnit ? '사용률(%)' : '사용량(Mbps)'}`,
      dataIndex: 'usageUtil',
      key: 'usageUtil',
      ellipsis: true,
    },
  ];

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper $isFullScreenMode={isFullScreenMode}>
        <Table
          rowKey="deviceKey"
          columns={columns}
          dataSource={widgetData.usageUtil}
          pagination={false}
        />
      </Wrapper>
    </LoadingSpinner>
  );
};

const Wrapper = styled.div<{ $isFullScreenMode: boolean }>`
  display: flex;
  gap: 1rem;

  width: 100%;
  height: 100%;
  overflow: auto;
  /* padding: 0 1rem; */

  .ant-table-wrapper {
    height: 100%;

    .ant-table-thead > tr > th {
      padding: 0.4rem 1.2rem;
      font-size: 14px;
    }

    .ant-table-tbody > tr > td {
      padding: 0.4rem 1.2rem;
      font-size: 14px;
    }
  }

  .ant-table-wrapper {
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

export default DeviceRankingsListByResource;
