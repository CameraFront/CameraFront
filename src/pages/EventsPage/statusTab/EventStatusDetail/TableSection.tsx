import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import EventDot from '@/components/EventDot';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import NotFoundContent from '@/components/fallbacks/NotFoundContent';
import { useGetUnresolvedEventsByFiltersQuery } from '@/services/api/events';
import { intIdSchema } from '@/services/validation/common';
import { eventsSearchParamsSchema } from '@/services/validation/events';
import { ResUnresolvedEventsByFilters } from '@/types/api/events';
import { EventTypeEn } from '@/types/common';
import { formatNumber } from '@/utils/formatters';

const TableSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, sort } = eventsSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { deviceId } = useParams();
  const parsedDeviceId = intIdSchema.safeParse(deviceId);
  const { data: unresolvedEvents, isLoading: isUnresolvedEventsLoading } =
    useGetUnresolvedEventsByFiltersQuery(
      {
        deviceId: parsedDeviceId.data,
        page,
        sort,
      },
      {
        skip: !parsedDeviceId.success,
      },
    );

  const columns: TableColumnsType<
    ResUnresolvedEventsByFilters['faultList'][number]
  > = useMemo(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
        ellipsis: true,
        width: '4%',
      },
      {
        title: '소속',
        dataIndex: 'managementNm',
        key: 'managementNm',
        ellipsis: true,
        width: '20%',
        align: 'center',
      },
      {
        title: '장비IP',
        dataIndex: 'deviceIp',
        key: 'deviceIp',
        ellipsis: true,
        width: '20%',
        align: 'center',
      },
      // {
      //   title: '장애등급',
      //   dataIndex: 'eventNm',
      //   key: 'eventNm',
      //   ellipsis: true,
      //   width: '10%',
      //   render: (value: EventTypeEn) => <EventDot type={value} hasText />,
      //   align: 'center',
      // },
      {
        title: '장애명',
        dataIndex: 'eventMsg',
        key: 'eventMsg',
        ellipsis: true,
        align: 'center',
        // width: '15%',
      },
      {
        title: '발생일시',
        dataIndex: 'ocDate',
        key: 'ocDate',
        ellipsis: true,
        align: 'center',
        width: '15%',
      },
    ],
    [],
  );

  if (!parsedDeviceId.success) return <NotFoundContent />;

  return (
    <Wrapper>
      {unresolvedEvents && (
        <Table
          loading={{
            indicator: <RegularLoadingSpinner />,
            spinning: isUnresolvedEventsLoading,
          }}
          size="small"
          rowKey={row => row.eventKey}
          columns={columns}
          dataSource={unresolvedEvents.faultList}
          pagination={{
            // size: 'default',
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: unresolvedEvents.page.page,
            pageSize: unresolvedEvents.page.rows,
            total: unresolvedEvents.page.records,
            showTotal: total =>
              `${
                (unresolvedEvents.page.page - 1) * unresolvedEvents.page.rows +
                1
              }-${
                unresolvedEvents.page.page * unresolvedEvents.page.rows
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
    max-width: 100vw;

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
