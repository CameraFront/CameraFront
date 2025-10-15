import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import EventDot from '@/components/EventDot';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import NotFoundContent from '@/components/fallbacks/NotFoundContent';
import { useGetEventsByFiltersQuery } from '@/services/api/events';
import { intIdSchema } from '@/services/validation/common';
import { eventsSearchParamsSchema } from '@/services/validation/events';
import { ResEventsByFilters } from '@/types/api/events';
import { EventTypeEn } from '@/types/common';
import { formatNumber } from '@/utils/formatters';
import { YEAR_DATE_TIME_FORMAT } from '@/config';

const TableSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, sort, fromDate, toDate } = eventsSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { deviceId } = useParams();
  const parsedDeviceId = intIdSchema.safeParse(deviceId);
  const { data: events, isLoading: isEventsLoading } =
    useGetEventsByFiltersQuery(
      {
        deviceId: parsedDeviceId.data,
        page,
        sort,
        fromDate,
        toDate,
      },
      {
        // skip: !parsedDeviceId.success,
      },
    );

  const columns: TableColumnsType<
    ResEventsByFilters['faultHistoryList'][number]
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
        title: '소속',
        dataIndex: 'managementNm',
        key: 'managementNm',
        ellipsis: true,
        width: '10%',
        align: 'center',
      },
      {
        title: '장애등급',
        dataIndex: 'eventNm',
        key: 'eventNm',
        ellipsis: true,
        width: '10%',
        render: (value: EventTypeEn) => <EventDot type={value} hasText />,
        align: 'center',
      },
      {
        title: '장애명',
        dataIndex: 'eventMsg',
        key: 'eventMsg',
        ellipsis: true,
        align: 'center',
      },
      {
        title: '발생일시',
        dataIndex: 'ocDate',
        key: 'ocDate',
        ellipsis: true,
        width: '15%',
        render: (value: string) => {
          if (!value) return '-';
          return dayjs(value).format(YEAR_DATE_TIME_FORMAT);
        },
        align: 'center',
      },
      {
        title: '복구일시',
        dataIndex: 'recDate',
        key: 'recDate',
        ellipsis: true,
        width: '15%',
        render: (value: string) => {
          if (!value) return '-';
          return dayjs(value).format(YEAR_DATE_TIME_FORMAT);
        },
        align: 'center',
      },
      {
        title: '장비IP',
        dataIndex: 'deviceIp',
        key: 'deviceIp',
        ellipsis: true,
        width: '10%',
        align: 'center',
      },
      {
        title: '장애코멘트',
        dataIndex: 'comment',
        key: 'comment',
        ellipsis: true,
        align: 'center',
      },
    ],
    [],
  );

  if (!parsedDeviceId.success) return <NotFoundContent />;

  return (
    <Wrapper>
      {events && (
        <Table
          loading={{
            indicator: <RegularLoadingSpinner />,
            spinning: isEventsLoading,
          }}
          size="small"
          rowKey={row => row.eventKey}
          columns={columns}
          dataSource={events.faultHistoryList}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: events.page.page,
            pageSize: events.page.rows,
            total: events.page.records,
            showTotal: total =>
              `${(events.page.page - 1) * events.page.rows + 1}-${
                events.page.page * events.page.rows
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

    .ant-checkbox-group {
      align-items: center;

      .ant-checkbox-wrapper {
        line-height: 1;
      }

      .ant-checkbox + span {
        padding-inline-start: 6px;
        padding-inline-end: 6px;
      }
    }
  }

  .ant-table-wrapper {
    max-width: 100vw;\
    
    .ant-table-thead > tr > th {
      padding: 0.6rem 1.2rem;
      background-color: ${themeGet('colors.bgDescriptionsLabel')};
      color: ${themeGet('colors.textDescriptionsLabel')};
      font-size: 18px;
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
