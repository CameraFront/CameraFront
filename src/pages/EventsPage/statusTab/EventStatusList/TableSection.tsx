import { useCallback, useMemo, useState } from 'react';
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { App, Button, Checkbox, Input, Popconfirm, Select, Table, TableColumnsType, Tooltip } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import EventDot from '@/components/EventDot';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import NotFoundContent from '@/components/fallbacks/NotFoundContent';
import { useDownloadExcelMutation, useGetDeviceTypeListQuery } from '@/services/api/common';
import { useClearFaultEventByAdminMutation, useGetUnresolvedEventsByFiltersQuery, useLazyGetUnresolvedEventsByFiltersQuery } from '@/services/api/events';
import { intIdSchema } from '@/services/validation/common';
import { eventsSearchParamsSchema } from '@/services/validation/events';
import { ResUnresolvedEventsByFilters } from '@/types/api/events';
import { EventTypeEn } from '@/types/common';
import { EventLv } from '@/types/enum';
import { formatNumber } from '@/utils/formatters';
import { useAppSelector } from '@/app/hooks';
import { SyncOutlined } from '@ant-design/icons';

import { RoleGroupId } from '@/features/global/types';
import { EVENTS_PATH } from '@/services/api/apiPaths';

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
  const { message } = App.useApp();
  const { user } = useAppSelector( store => store.global);
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, search, deviceType, sort, eventTypes } =
    eventsSearchParamsSchema.parse(Object.fromEntries(searchParams));
  const { pathname } = useLocation();
  const { branchId } = useParams();
  const parsedBranchId = intIdSchema.parse(branchId);
  const [searchValue, setSearchValue] = useState(search);
  const { data: resDeviceTypeList, isLoading: isDeviceTypeListLoading } =
    useGetDeviceTypeListQuery();
  const { data: unresolvedEvents, isLoading: isUnresolvedEventsLoading, isError, refetch } =
    useGetUnresolvedEventsByFiltersQuery({
      branchId: parsedBranchId,
      deviceType,
      eventTypes,
      page,
      sort,
      search,
    });
  const [downloadExcel, { isLoading: isDownloading }] =
    useDownloadExcelMutation();
  const [ clearEvent, { isLoading: isClearing }] = useClearFaultEventByAdminMutation();

  const isDeveloper = user?.login.roleGroupId == RoleGroupId.DEVELOPER;

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

  const onClick = async (record: ResUnresolvedEventsByFilters['faultList'][number]) => {
    await clearEvent({eventKey: record.eventKey});
    await refetch();
  };

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
        align: 'center',
      },
      {
        title: '카메라명',
        dataIndex: 'managementNm',
        key: 'managementNm',
        ellipsis: true,
        //width: '10%',
        align: 'center',
      },
      {
        title: '접속 상태',
        dataIndex: 'deviceKindNmSub',
        key: 'deviceKindNmSub',
        ellipsis: true,
        width: '12%',
        align: 'center',
      },
      {
        title: '화각 상태',
        dataIndex: 'deviceNm',
        key: 'deviceNm',
        ellipsis: true,
        render: (value, record) => (
          <Link to={`${pathname}/${record.deviceKey}`}>{value}</Link>
        ),
        align: 'center',
        width: '12%'
      },
      {
        title: '알람 레벨',
        dataIndex: 'eventNm',
        key: 'eventNm',
        ellipsis: true,
        width: '12%',
        render: (value: EventTypeEn) => <EventDot type={value} hasText />,
        align: 'center',
      },
      // {
      //   title: '장애명',
      //   dataIndex: 'eventMsg',
      //   key: 'eventMsg',
      //   ellipsis: true,
      //   // width: '15%',
      //   align: 'center',
      // },
      {
        title: '발생일시',
        dataIndex: 'ocDate',
        key: 'ocDate',
        ellipsis: true,
        width: '23%',
        align: 'center',
      },
      ...(isDeveloper
        ? [
            {
              title: '장애해소',
              key: 'eventClear',
              width: '10%',
              render: (record: ResUnresolvedEventsByFilters['faultList'][number]) => (
                <Popconfirm
                title="장애 해소하기"
                description="정말 선택된 장애를 해소하시겠습니까?"
                onConfirm={()=>{onClick(record)}}
                okButtonProps={{ danger: true }}
                okText="해소"
                cancelText="취소"
              >
                <Button >해소</Button>
              </Popconfirm>
              ),
              
            },
          ]
        : []),
    ],
    [pathname],
  );

  const onCheck: CheckboxGroupProps['onChange'] = checkedValues => {
    setSearchParams(prev => {
      prev.set('eventTypes', checkedValues.join(','));
      return prev;
    });
  };

  const onSync = async () => {
    refetch();

    if (!isError)
      message.success('성공적으로 데이터를 갱신했습니다.');
  };

  return (
    <Wrapper>
      <div className="header">
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
        <Select<number>
          allowClear
          value={deviceType}
          loading={isDeviceTypeListLoading}
          placeholder="접속 상태"
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
        <Select<number>
          allowClear
          value={deviceType}
          loading={isDeviceTypeListLoading}
          placeholder="화각 상태"
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
        <Select<number>
          allowClear
          value={deviceType}
          loading={isDeviceTypeListLoading}
          placeholder="알람 레벨"
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
        {/* <Checkbox.Group
          value={eventTypes}
          options={checkboxOptions}
          onChange={onCheck}
        /> */}
        
        <Tooltip>
          <Button
              icon={<SyncOutlined spin={isUnresolvedEventsLoading} />}
              disabled={isUnresolvedEventsLoading}
              loading={isUnresolvedEventsLoading}
              onClick={onSync}/>
        </Tooltip>
        <Button
          onClick={async () => {
            await downloadExcel({
              urlPath: `${EVENTS_PATH}/exceldownloadFault.do`,
              filename: 'eventStatusList.xlsx',
              body: { 
                managementCdTree: branchId,
                ...(deviceType !== undefined && { deviceKind: deviceType }),
                eventLv: eventTypes.join(','),
                ...(search !== undefined && { search: search }),
              }
            });
          }}>
            엑셀로 저장
        </Button>
      </div>
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
      background-color: ${themeGet('colors.bgDescriptionsLabel')};
      color: ${themeGet('colors.textDescriptionsLabel')};
      font-size: 18px;
    }

    .ant-table-thead > tr > th:not(:last-child) {
      border-right: 1px solid #b7b7b7;
      border-bottom: none;
    }

    .ant-table-tbody > tr > td {
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
