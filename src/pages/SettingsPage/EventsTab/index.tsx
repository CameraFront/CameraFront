import { useMemo, useState } from 'react';
import { Button, Input, Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import AudioPlayButton from '@/components/AudioPlayButton';
import EventTag from '@/components/EventTag';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import { useGetEventListQuery } from '@/services/api/settings/events';
import { OpenedModalType, ResEventList } from '@/types/api/settings';
import { EventTypeEn } from '@/types/common';
import { ResBoolean } from '@/types/enum';
import { formatNumber } from '@/utils/formatters';
import FormModal from './FormModal';

const { Search } = Input;

const EventsTab = () => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [openedModalType, setOpenedModalType] = useState<OpenedModalType>(null);
  const [filter, setFilter] = useState<{
    search: string | undefined;
    page: number;
  }>({
    search: undefined,
    page: 1,
  });

  const { data: eventList, isLoading } = useGetEventListQuery(filter);

  const columns = useMemo<TableColumnsType<ResEventList['eventList'][number]>>(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: '장애명',
        dataIndex: 'fDes',
        key: 'fDes',
      },
      {
        title: '장애레벨',
        dataIndex: 'fLvNm',
        key: 'fLvNm',
        render: (value: EventTypeEn) => <EventTag type={value} />,
      },
      {
        title: '관리여부',
        dataIndex: 'manageYn',
        key: 'manageYn',
        render: (value: ResBoolean) =>
          ResBoolean.True === value ? '관리' : '비관리',
      },
      {
        title: '가청알람여부',
        dataIndex: 'isAudible',
        key: 'isAudible',
        render: (value: ResBoolean) =>
          ResBoolean.True === value ? '가청' : '비가청',
      },
      {
        title: '가청알람음',
        dataIndex: 'audioKey',
        key: 'audioKey',
        render: (value: number) =>
          value && <AudioPlayButton audioKey={value} />,
      },
    ],
    [],
  );

  const onSearch = (value: string) => {
    setFilter(prev => ({ ...prev, page: 1, search: value }));
  };

  const onPageChange = (page: number) => {
    setFilter(prev => ({ ...prev, page }));
  };

  const onModalOpen = (type: OpenedModalType) => {
    setOpenedModalType(type);
  };

  const onModalClose = () => {
    setOpenedModalType(null);
    setSelectedRowId(null);
  };

  return (
    <Wrapper>
      <div className="header">
        <div className="left-wrapper">
          <Search placeholder="이름 검색" allowClear onSearch={onSearch} />
        </div>
        <div className="right-wrapper">
          <Button
            disabled={!selectedRowId}
            onClick={() => onModalOpen('update')}
          >
            수정
          </Button>
        </div>
      </div>
      <div className="content">
        <Table
          bordered
          loading={{
            spinning: isLoading,
            indicator: <RegularLoadingSpinner />,
          }}
          size="small"
          rowKey={row => row.fCd}
          columns={columns}
          dataSource={eventList?.eventList}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: eventList?.page.page || 1,
            pageSize: eventList?.page.rows || 10,
            total: eventList?.page.records || 0,
            showTotal: total => `총 ${formatNumber(total)}개`,
            onChange: onPageChange,
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedRowId ? [selectedRowId] : [],
            onChange: selectedRowKeys => {
              setSelectedRowId(selectedRowKeys[0] as string);
            },
          }}
        />
      </div>
      {openedModalType && (
        <FormModal
          openedModalType={openedModalType}
          id={selectedRowId}
          onCloseModal={onModalClose}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .left-wrapper {
      display: flex;
      gap: 0.8rem;
    }

    .right-wrapper {
      display: flex;
      gap: 0.8rem;
    }
  }

  .content {
    .ant-table-wrapper .ant-table-selection-col {
      width: 4.8rem;
    }
  }
`;

export default EventsTab;
