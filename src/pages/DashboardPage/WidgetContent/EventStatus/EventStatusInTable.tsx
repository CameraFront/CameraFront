import { useCallback, useEffect, useMemo } from 'react';
import { Carousel, Skeleton, Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import EventDot from '@/components/EventDot';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useAppSelector } from '@/app/hooks';
import { useLazyGetEventStatusDataQuery } from '@/services/api/dashboard';
import { EventStatusWidgetData } from '@/types/api/dashboard';

interface Props {
  data: EventStatusWidgetData;
}
interface SourceItem {
  id: string;
  managementNm: string;
  deviceNm: string;
  deviceIp: string;
  eventMsg: string;
  eventType: string;
  ocDate: string;
}

const EventStatusInTable = ({ data }: Props) => {
  const { isFullScreenMode } = useAppSelector(store => store.dashboard);
  const [getEventStatusData, { data: widgetData, isLoading, isError }] =
    useLazyGetEventStatusDataQuery({
      pollingInterval: data.options.updateInterval * 1000,
    });

  useEffect(() => {
    getEventStatusData({
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
      page: 1,
      rows: 10,
      deviceTypes: data.options.deviceTypes,
      eventTypes: data.options.eventTypes,
    });
  }, [
    data.apiUrl,
    data.id,
    data.type,
    getEventStatusData,
    data.options.deviceTypes,
    data.options.eventTypes,
  ]);

  const dataSource: SourceItem[] = useMemo(() => {
    if (!widgetData) return [];

    return widgetData.faultList.map(el => ({
      id: el.eventKey.toString(),
      managementNm: el.managementNm,
      deviceNm: el.deviceNm,
      deviceIp: el.deviceIp,
      eventMsg: el.eventMsg,
      eventType: el.eventNm,
      ocDate: el.ocDate,
    }));
  }, [widgetData]);

  const handleSwipe = useCallback(
    (current: number) => {
      getEventStatusData({
        apiUrl: data.apiUrl,
        type: data.type,
        id: data.id,
        page: current + 1,
        rows: 10,
        deviceTypes: data.options.deviceTypes,
        eventTypes: data.options.eventTypes,
      });
    },
    [
      data.apiUrl,
      data.id,
      data.type,
      getEventStatusData,
      data.options.deviceTypes,
      data.options.eventTypes,
    ],
  );

  const columns = useMemo<TableColumnsType<SourceItem>>(
    () => [
      {
        title: '지역',
        dataIndex: 'managementNm',
        key: 'managementNm',
        width: '23%',
        ellipsis: true,
      },
      {
        title: '장비',
        dataIndex: 'deviceNm',
        key: 'deviceNm',
        width: '21%',
        ellipsis: true,
      },
      {
        title: '장비IP',
        dataIndex: 'deviceIp',
        key: 'deviceIp',
        width: '15%',
        ellipsis: true,
      },
      {
        title: '장애명',
        dataIndex: 'eventMsg',
        key: 'eventMsg',
        width: '20%',
        ellipsis: true,
      },
      {
        title: '장애등급',
        dataIndex: 'eventType',
        key: 'eventType',
        width: '10%',
        align: 'center',
        render: value => <EventDot size="medium" type={value} isInverted />,
        ellipsis: true,
      },
      {
        title: '발생일시',
        dataIndex: 'ocDate',
        key: 'ocDate',
        width: '15%',
        render: value => dayjs(value).format('MM-DD hh:mm:ss'),
        ellipsis: true,
      },
    ],
    [],
  );

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  return (
    <Wrapper $isFullScreenMode={isFullScreenMode}>
      {!dataSource.length ? (
        <ErrorMessage>현재 미처리 장애가 존재하지 않습니다.</ErrorMessage>
      ) : (
        // <Carousel afterChange={handleSwipe} autoplay autoplaySpeed={5000}>
        <Carousel afterChange={handleSwipe} autoplay autoplaySpeed={5000}>
          {Array(widgetData.page.totalPage)
            .fill(null)
            .map((_el, i) =>
              i + 1 === widgetData.page.page ? (
                // eslint-disable-next-line react/no-array-index-key
                <div className="slide" key={`slide${i}`}>
                  <Table
                    rowKey={el => el.id}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                  />
                </div>
              ) : (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`slide${i}`}>
                  {Array(widgetData.page.rows)
                    .fill(null)
                    .map((el, i) => (
                      <Skeleton.Button
                        active={isLoading}
                        // eslint-disable-next-line react/no-array-index-key
                        key={`slide${i}`}
                        shape="square"
                        block
                        size="large"
                        style={{}}
                      />
                    ))}
                </div>
              ),
            )}
        </Carousel>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $isFullScreenMode: boolean }>`
  width: 100%;
  height: 100%;

  .slide {
    display: flex !important;
    flex-direction: column;
    gap: ${({ $isFullScreenMode }) => ($isFullScreenMode ? '10px' : '6px')};
  }

  .slick-dots {
    li {
      width: 1rem;
      margin: 0 4px;

      button {
        background-color: ${themeGet('colors.primary')};
        height: 1rem;
        border-radius: 5px;
      }

      &.slick-active button {
        background-color: ${themeGet('colors.primary')};
        width: 100%;
      }
    }
  }

  .slick-dots-bottom {
    position: relative;
    margin: ${({ $isFullScreenMode }) => ($isFullScreenMode ? '30px' : '0px')}
      auto 1rem;
    bottom: 0;
  }

  .ant-table-wrapper {
    margin-top: -7px;

    .ant-table-thead > tr > th {
      padding: ${({ $isFullScreenMode }) =>
        $isFullScreenMode ? '1.6rem 1.2rem' : '0.8rem 1.2rem'};
      font-size: 14px;
    }

    .ant-table-tbody > tr > td {
      padding: ${({ $isFullScreenMode }) =>
        $isFullScreenMode ? '1.4rem 1.2rem' : '0.6rem 1.2rem'};
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
  }

  .ant-table-wrapper {
    height: 100%;

    .ant-spin-nested-loading {
      height: 100%;

      .ant-spin-container {
        height: 100%;

        .ant-table {
          /* height: calc(100% - 30px); */
          height: ${({ $isFullScreenMode }) =>
            $isFullScreenMode ? 'calc(100% - 30px)' : 'auto'};
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
                  font-size: 14px;
                  
                  .ant-table-cell {
                    background-color: ${themeGet('colors.bgWidget')};
                    color: ${themeGet('colors.textMain')};
                    border-bottom: 1px solid ${themeGet('colors.borderTableBottom')};
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

export default EventStatusInTable;
