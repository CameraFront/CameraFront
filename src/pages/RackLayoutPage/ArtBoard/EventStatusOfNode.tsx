import { useMemo } from 'react';
import { Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import EventDot from '@/components/EventDot';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { ResEventDevice } from '@/features/eventsPage/types';
import { getUnhandledEventsByDevice } from '@/features/rackLayoutPage/rackLayoutSlice';
import { RackItemNodeData } from '@/features/rackLayoutPage/types';
import { EventTypeEn } from '@/types/common';
import { formatNumber } from '@/utils/formatters';

interface Props {
  data: RackItemNodeData;
  id: string;
}

const EventStatusOfNode = ({ data, id }: Props) => {
  const dispatch = useAppDispatch();
  const {
    content: { unhandledEventDetailsList },
  } = useAppSelector(store => store.rackLayout);

  const columns: TableColumnsType<ResEventDevice> = useMemo(
    () => [
      {
        title: '장애등급',
        dataIndex: 'eventNm',
        key: 'eventNm',
        // ellipsis: true,
        width: '22.5%',
        render: (value: EventTypeEn) => <EventDot type={value} hasText />,
      },
      {
        title: '장애명',
        dataIndex: 'eventMsg',
        key: 'eventMsg',
        ellipsis: true,
        // width: '60%',
      },
      {
        title: '발생일시',
        dataIndex: 'ocDate',
        key: 'ocDate',
        // ellipsis: true,
        // width: '32.5%',
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
  /* .ant-table-fixed {
    table-layout: fixed;
  }

  .ant-table-tbody > tr > td {
    word-wrap: break-word;
    word-break: break-all;
  } */
`;
export default EventStatusOfNode;
