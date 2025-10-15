import { useEffect, useMemo } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useAppSelector } from '@/app/hooks';
import { useLazyGetEventStatusByStationDataQuery } from '@/services/api/dashboard';
import { EventStatusByStationWidgetData } from '@/types/api/dashboard';
import { light } from '@/css/theme';

type Props = {
  data: EventStatusByStationWidgetData;
};

interface SourceItem {
  key: number;
  stationId: number;
  stationName: string;
  urgent: number;
  important: number;
  minor: number;
  total: number;
}

const columns: ColumnsType<SourceItem> = [
  {
    title: '소속',
    dataIndex: 'stationName',
    key: 'stationName',
    ellipsis: true,
  },
  {
    title: () => (
      <span className="table-head" style={{ color: light.colors.urgent }}>
        긴급
      </span>
    ),
    dataIndex: 'urgent',
    key: 'urgent',
    ellipsis: true,
    width: '15%',
  },
  {
    title: () => (
      <span className="table-head" style={{ color: light.colors.important }}>
        중요
      </span>
    ),
    dataIndex: 'important',
    key: 'important',
    ellipsis: true,
    width: '15%',
  },
  {
    title: () => <span className="table-head-minor">일반</span>,
    dataIndex: 'minor',
    key: 'minor',
    ellipsis: true,
    width: '15%',
  },
  {
    title: '합계',
    dataIndex: 'total',
    key: 'total',
    ellipsis: true,
    width: '15%',
    render(value) {
      return <span>{value}</span>;
    },
  },
];

// 소속별 장애 현황
const EventStatusByStation = ({ data }: Props) => {
  const { isFullScreenMode } = useAppSelector(store => store.dashboard);
  const { isDarkMode } = useAppSelector(store => store.global);

  const [getEventStatusByStation, { data: widgetData, isLoading, isError }] =
    useLazyGetEventStatusByStationDataQuery({
      pollingInterval: data.options.updateInterval * 1000,
    });

  useEffect(() => {
    getEventStatusByStation({
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
      page: 1,
      deviceTypes: data.options.deviceTypes,
    });
  }, [data, getEventStatusByStation]);

  const hasFullData = widgetData?.faultList.length === 10;

  const onPageChange = (page: number) => {
    getEventStatusByStation({
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
      page,
      deviceTypes: data.options.deviceTypes,
    });
  };

  const dataSource = useMemo(() => {
    if (!widgetData) return [];

    return widgetData.faultList.map(el => {
      const total = el.urgent + el.important + el.minor;
      return {
        key: el.managementCd,
        stationId: el.managementCd,
        stationName: el.managementNm,
        urgent: el.urgent,
        important: el.important,
        minor: el.minor,
        total,
      };
    });
  }, [widgetData]);

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper
        $isFullScreenMode={isFullScreenMode}
        $hasFullData={hasFullData}
        $isDarkMode={isDarkMode}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            position: ['bottomCenter'],
            simple: true,
            current: widgetData.page.page,
            pageSize: widgetData.page.rows,
            total: widgetData.page.records,
            // showTotal: total => `총 ${total}개`,
            onChange: onPageChange,
          }}
        />
      </Wrapper>
    </LoadingSpinner>
  );
};

const Wrapper = styled.div<{
  $isFullScreenMode: boolean;
  $hasFullData: boolean;
  $isDarkMode: boolean;
}>`
  width: 100%;
  height: 100%;

  .ant-table-wrapper {
    margin-top: -7px;

    .ant-table-thead > tr > th {
      padding: ${({ $isFullScreenMode }) =>
        $isFullScreenMode ? '1.6rem 1.2rem' : '0.8rem 1.2rem'};
      font-size: 14px;
    }

    .ant-table-tbody > tr > td {
      padding: ${({ $isFullScreenMode }) =>
        $isFullScreenMode ? '1.6rem 1.2rem' : '0.8rem 1.2rem'};
      font-size: 14px;
    }

    .ant-pagination {
      display: flex;
      align-items: center;

      margin-top: 1.2rem;

      &.ant-pagination-simple .ant-pagination-simple-pager input {
        width: 6rem;
      }
    }

    .table-head {
      /* display: block; */
      /* text-align: center; */
      padding: 2px 4px;
      border-radius: ${themeGet('borderRadius.normal')};
    }

    .table-head-minor {
      color: ${({ $isDarkMode }) => ($isDarkMode ? '#EFEFEF' : '#707070')};
    }
  }

  .ant-table-wrapper {
    height: 100%;

    .ant-spin-nested-loading {
      height: 100%;

      .ant-spin-container {
        height: 100%;

        .ant-table {
          /* height: calc(100% - 30px); */
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
                    border-bottom: 1px solid #b7b7b7;

                    &::before {
                      background: none;
                    }
                  }
                }

                .ant-table-tbody {
                  .ant-table-cell {
                    background-color: ${themeGet('colors.bgWidget')};
                    color: ${themeGet('colors.textMain')};
                    border-bottom: 1px solid
                      ${themeGet('colors.borderTableBottom')};
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

export default EventStatusByStation;
