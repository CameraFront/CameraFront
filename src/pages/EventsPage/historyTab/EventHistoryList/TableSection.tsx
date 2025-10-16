import { useCallback, useMemo, useState } from 'react';
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  Button,
  Checkbox,
  Input,
  Popover,
  Select,
  Table,
  TableColumnsType,
} from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import dayjs from 'dayjs';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import EventDot from '@/components/EventDot';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import { useGetDeviceTypeListQuery } from '@/services/api/common';
import { useGetEventsByFiltersQuery } from '@/services/api/events';
import { intIdSchema } from '@/services/validation/common';
import { eventsSearchParamsSchema } from '@/services/validation/events';
import { ResEventsByFilters } from '@/types/api/events';
import { EventTypeEn } from '@/types/common';
import { EventLv } from '@/types/enum';
import { formatNumber } from '@/utils/formatters';
import CommentForm from './CommentForm';

const { Search } = Input;

const checkboxOptions = [
  {
    label: (
      <EventDot type="urgent" size="large" hasText={false} active={false} />
    ),
    value: EventLv.Urgent,
  },
  {
    label: (
      <EventDot type="important" size="large" hasText={false} active={false} />
    ),
    value: EventLv.Important,
  },
  {
    label: (
      <EventDot type="minor" size="large" hasText={false} active={false} />
    ),
    value: EventLv.Minor,
  },
];

const TableSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, search, deviceType, sort, eventTypes } =
    eventsSearchParamsSchema.parse(Object.fromEntries(searchParams));
  const { pathname } = useLocation();
  const { branchId } = useParams();
  const parsedBranchId = intIdSchema.parse(branchId);
  const [searchValue, setSearchValue] = useState(search);
  const { data: resDeviceTypeList, isLoading: isDeviceTypeListLoading } =
    useGetDeviceTypeListQuery();
  const { data: unresolvedEvents, isLoading: isUnresolvedEventsLoading } =
    useGetEventsByFiltersQuery({
      branchId: parsedBranchId,
      deviceType,
      eventTypes,
      page,
      sort,
      search,
    });
  const [activeEventKey, setActiveEventKey] = useState<number | null>(null);
  const handleChangeActiveEventKey = useCallback((eventKey: number | null) => {
    setActiveEventKey(eventKey);
  }, []);

  const onDeviceTypeChange = (value: number) => {
    setSearchParams(prev => {
      prev.set('deviceType', value.toString());
      return prev;
    });
  };

  const onDeviceTypeClear = () => {
    setSearchParams(prev => {
      prev.delete('deviceType');
      return prev;
    });
  };

  const handlePopoverClose = () => {
    setActiveEventKey(null);
  };

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
        title: '소분류',
        dataIndex: 'deviceKindNmSub',
        key: 'deviceKindNmSub',
        ellipsis: true,
        width: '7%',
        align: 'center',
      },
      {
        title: '장비명',
        dataIndex: 'deviceNm',
        key: 'deviceNm',
        ellipsis: true,
        render: (value, record) => (
          <Link to={`${pathname}/${record.deviceKey}`}>{value}</Link>
        ),
        align: 'center',
      },
      {
        title: '등급',
        dataIndex: 'eventNm',
        key: 'eventNm',
        ellipsis: true,
        width: '5%',
        render: (value: EventTypeEn) => <EventDot type={value} hasText />,
        align: 'center',
      },
      {
        title: '장애명',
        dataIndex: 'eventMsg',
        key: 'eventMsg',
        ellipsis: true,
        // width: '15%',
        align: 'center',
      },
      {
        title: '발생일시',
        dataIndex: 'ocDate',
        key: 'ocDate',
        ellipsis: true,
        width: '18%',
        align: 'center',
      },
      {
        title: '복구일시',
        dataIndex: 'recDate',
        key: 'recDate',
        ellipsis: true,
        width: '18%',
        align: 'center',
      },
      {
        title: '코멘트',
        key: 'comment',
        width: '5%',
        render: (_, record) => (
          <Popover
            fresh
            open={record.eventKey === activeEventKey}
            onOpenChange={open => {
              if (!open) {
                handlePopoverClose();
              }

              handleChangeActiveEventKey(record.eventKey);
            }}
            arrow={false}
            placement="topRight"
            content={
              <CommentForm
                onPopoverClose={handlePopoverClose}
                eventKey={record.eventKey}
              />
            }
            trigger="click"
          >
            <Button type="link" style={{ padding: 0, height: '20px' }}>
              입력
            </Button>
          </Popover>
        ),
        align: 'center',
      },
    ],
    [pathname, activeEventKey, handleChangeActiveEventKey],
  );

  const onCheck: CheckboxGroupProps['onChange'] = checkedValues => {
    setSearchParams(prev => {
      prev.set('eventTypes', checkedValues.join(','));
      return prev;
    });
  };

  return (
    <Wrapper>
      <div className="header">
        <Select<number>
          allowClear
          value={deviceType}
          loading={isDeviceTypeListLoading}
          placeholder="장비 종류"
          style={{ width: '20rem', marginLeft: '8px' }}
          options={
            resDeviceTypeList?.map(item => ({
              label: item.deviceKindNm,
              value: item.deviceKind,
            })) || []
          }
          onChange={onDeviceTypeChange}
          onClear={onDeviceTypeClear}
        />
        <Checkbox.Group
          value={eventTypes}
          options={checkboxOptions}
          onChange={onCheck}
        />
        <Search
          allowClear
          style={{ maxWidth: '28rem' }}
          placeholder="장애 검색"
          className="search-bar"
          value={searchValue}
          onChange={e => {
            setSearchValue(e.currentTarget.value);
          }}
          onSearch={value => {
            setSearchParams(prev => {
              prev.set('search', value);
              return prev;
            });
          }}
        />
      </div>
      {unresolvedEvents && (
        <Table
          loading={{
            indicator: <RegularLoadingSpinner />,
            spinning: isUnresolvedEventsLoading,
          }}
          size="small"
          rowKey="eventKey"
          columns={columns}
          dataSource={unresolvedEvents.faultHistoryList}
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

    .search-bar {
      .ant-input-affix-wrapper {
        background-color: ${themeGet('colors.bgDescriptionsContent')};
      }
      .ant-input-group-addon button {
        background-color: ${themeGet('colors.bgDescriptionsLabel')};
      }
    }

    .ant-select-selector {
      background: ${themeGet('colors.bgDescriptionsContent')};
    }

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

    .ant-table-thead > tr > th:not(:last-child) {
      border-right: 1px solid #b7b7b7;
      border-bottom: none;
    }

    .ant-table-tbody > tr > td {
      padding: 1.2rem;
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
  }
`;

export default TableSection;
