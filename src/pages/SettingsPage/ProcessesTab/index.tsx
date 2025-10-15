import { useMemo, useState } from 'react';
import { App, Button, Input, Select, Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import DangerConfirmButton from '@/components/DangerConfirmButton';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import { useGetDeviceTypeListQuery } from '@/services/api/common';
import {
  useDeleteProcessMutation,
  useGetProcessListQuery,
} from '@/services/api/settings/processes';
import {
  OpenedModalType,
  ProcessListFilters,
  ResProcessList,
} from '@/types/api/settings';
import { ResBoolean } from '@/types/enum';
import { formatNumber } from '@/utils/formatters';
import { getSuccessMessage } from '@/config/messages';
import { YEAR_DATE_FORMAT } from '@/config';
import FormModal from './FormModal';

const { Search } = Input;

const ProcessesTab = () => {
  const { message } = App.useApp();
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openedModalType, setOpenedModalType] = useState<OpenedModalType>(null);
  const { data: deviceTypes } = useGetDeviceTypeListQuery(true);
  const [filter, setFilter] = useState<ProcessListFilters>({
    deviceType: undefined,
    search: undefined,
    page: 1,
  });
  const { data: processList, isLoading } = useGetProcessListQuery(filter);
  const [deleteProcess, { isLoading: isDeleting }] = useDeleteProcessMutation();

  const columns = useMemo<
    TableColumnsType<ResProcessList['listProcess'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
      },

      {
        title: '서버',
        dataIndex: 'deviceNm',
        key: 'deviceNm',
      },
      {
        title: '프로세스명',
        dataIndex: 'procNm',
        key: 'procNm',
      },
      {
        title: '경로',
        dataIndex: 'procPath',
        key: 'procPath',
      },
      {
        title: '파라미터',
        dataIndex: 'procParam',
        key: 'procParam',
      },
      {
        title: '등록일자',
        dataIndex: 'regDt',
        key: 'regDt',
        render: (value: string) => dayjs(value).format(YEAR_DATE_FORMAT),
      },
      {
        title: '관리여부',
        dataIndex: 'manageYn',
        key: 'manageYn',
        render: (value: ResBoolean) =>
          value === ResBoolean.True ? '관리' : '비관리',
      },
    ],
    [],
  );

  const onDelete = () => {
    if (!selectedRowId) return;
    deleteProcess(selectedRowId);
    message.success(getSuccessMessage('delete', '프로세스가'));
  };

  const onSearch = (value: string) => {
    setFilter(prev => ({ ...prev, page: 1, search: value }));
  };

  const onPageChange = (page: number) => {
    setFilter(prev => ({ ...prev, page }));
  };

  const onDeviceTypeChange = (value: number) => {
    setFilter(prev => ({
      ...prev,
      page: 1,
      deviceType: value,
    }));
    setSelectedRowId(null);
  };

  const onModalOpen = (type: OpenedModalType) => {
    setOpenedModalType(type);
  };

  const onModalClose = () => {
    setOpenedModalType(null);
    setSelectedRowId(null);
  };

  const deviceTypeOptions = useMemo(
    () =>
      deviceTypes?.map(item => ({
        label: item.deviceKindNm,
        value: item.deviceKind,
      })) || [],
    [deviceTypes],
  );

  return (
    <Wrapper>
      <div className="header">
        <div className="left-wrapper">
          <Search
            className="search-phone"
            placeholder="프로세스 검색"
            allowClear
            onSearch={onSearch}
          />
          <Select
            className="select-type"
            allowClear
            placeholder="장비종류"
            value={filter.deviceType}
            options={deviceTypeOptions}
            onChange={onDeviceTypeChange}
          />
        </div>
        <div className="right-wrapper">
          <DangerConfirmButton
            title="정말 선택된 프로세스를 삭제하시겠습니까?"
            description="삭제된 프로세스는 복구할 수 없습니다."
            onConfirm={onDelete}
            loading={isDeleting}
            disabled={!selectedRowId}
          >
            삭제
          </DangerConfirmButton>
          <Button
            disabled={!selectedRowId}
            onClick={() => onModalOpen('update')}
          >
            수정
          </Button>
          <Button type="primary" onClick={() => onModalOpen('create')}>
            추가
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
          rowKey={row => row.seqNum}
          columns={columns}
          dataSource={processList?.listProcess}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: processList?.page.page || 1,
            pageSize: processList?.page.rows || 10,
            total: processList?.page.records || 0,
            showTotal: total => `총 ${formatNumber(total)}개`,
            onChange: onPageChange,
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedRowId ? [selectedRowId] : [],
            onChange: selectedRowKeys => {
              setSelectedRowId(selectedRowKeys[0] as number);
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

      .search-phone {
        width: auto;
      }

      .select-type {
        width: 16rem;
      }
    }

    .right-wrapper {
      display: flex;
      gap: 0.8rem;
    }

    .btn-delete {
      &.ant-btn-default:not(:disabled):not(.ant-btn-disabled):hover {
        color: ${themeGet('colors.textDanger')};
        border-color: ${themeGet('colors.textDanger')};
      }
    }
  }

  .content {
    .ant-table-wrapper .ant-table-selection-col {
      width: 4.8rem;
    }
  }
`;

export default ProcessesTab;
