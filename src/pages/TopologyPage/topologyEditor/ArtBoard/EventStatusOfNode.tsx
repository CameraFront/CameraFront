import { Table, TableColumnsType } from 'antd';
import { useMemo } from 'react';
import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import EventDot from '@/components/EventDot';
import { ResEventDevice } from '@/features/eventsPage/types';
import { getUnhandledEventsByDevice } from '@/features/rackLayoutPage/rackLayoutSlice';
import { NetworkNodeData } from '@/features/topologyPage/types';
import { formatNumber } from '@/utils/formatters';
import { EventTypeEn } from '@/types/common';

interface Props {
  data: NetworkNodeData;
  id: string;
}

const EventStatusOfNode = ({ data, id }: Props) => {
  const dispatch = useAppDispatch();
  const {
    content: { unhandledEventDetailsList },
  } = useAppSelector(store => store.topology);

  const columns: TableColumnsType<ResEventDevice> = useMemo(
    () => [
      {
        title: '장애등급',
        dataIndex: 'eventNm',
        key: 'eventNm',
        width: '22.5%',
        render: (value: EventTypeEn) => <EventDot type={value} hasText />,
      },
      {
        title: '장애명',
        dataIndex: 'eventMsg',
        key: 'eventMsg',
        ellipsis: true,
      },
      {
        title: '발생일시',
        dataIndex: 'ocDate',
        key: 'ocDate',
        width: '32.5%',
      },
    ],
    [],
  );

  if (!unhandledEventDetailsList) return;

  return (
    <Wrapper>
      <Table
        size="small"
        rowKey="eventKey"
        columns={columns}
        dataSource={unhandledEventDetailsList.faultList}
        pagination={{
          size: 'small',
          position: ['bottomCenter'],
          showSizeChanger: false,
          current: unhandledEventDetailsList.page.page,
          pageSize: unhandledEventDetailsList.page.rows,
          total: unhandledEventDetailsList.page.records,
          showTotal: total =>
            `${
              (unhandledEventDetailsList.page.page - 1) *
                unhandledEventDetailsList.page.rows +
              1
            }-${
              unhandledEventDetailsList.page.page *
              unhandledEventDetailsList.page.rows
            } / 총 ${formatNumber(total)}개`,
          onChange: page => {
            dispatch(getUnhandledEventsByDevice({ page, deviceId: id }));
          },
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 40rem;
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
                  .ant-table-cell {
                    background-color: ${themeGet('colors.bgPopover')};
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
                    background-color: ${themeGet('colors.bgPopover')};
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
export default EventStatusOfNode;
