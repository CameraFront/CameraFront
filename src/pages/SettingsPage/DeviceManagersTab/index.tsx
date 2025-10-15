import { useMemo, useState } from 'react';
import { App, Button, Input, Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import DangerConfirmButton from '@/components/DangerConfirmButton';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import {
  useDeleteDeviceManagerMutation,
  useGetDeviceManagerListQuery,
} from '@/services/api/settings/deviceManagers';
import { OpenedModalType, ResDeviceManagerList } from '@/types/api/settings';
import { formatNumber } from '@/utils/formatters';
import { getSuccessMessage } from '@/config/messages';
import FormModal from './FormModal';

const { Search } = Input;

const DeviceManagersTab = () => {
  const { message } = App.useApp();
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openedModalType, setOpenedModalType] = useState<OpenedModalType>(null);
  const [deleteDeviceManager, { isLoading: isDeleting }] =
    useDeleteDeviceManagerMutation();
  const [filter, setFilter] = useState<{
    search: string | undefined;
    page: number;
  }>({
    search: undefined,
    page: 1,
  });

  const { data: deviceManagerList, isLoading } =
    useGetDeviceManagerListQuery(filter);

  const columns = useMemo<
    TableColumnsType<ResDeviceManagerList['listEquipManager'][number]>
  >(
    () => [
      {
        title: 'No.',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: '이름',
        dataIndex: 'managerNm',
        key: 'managerNm',
      },
      {
        title: '소속부서',
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: '전화번호',
        dataIndex: 'tel',
        key: 'tel',
      },
      {
        title: '이메일',
        dataIndex: 'email',
        key: 'email',
      },
    ],
    [],
  );

  const onDelete = () => {
    if (!selectedRowId) return;
    deleteDeviceManager(selectedRowId);
    message.success(getSuccessMessage('delete', '장비관리자가'));
  };

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
          <DangerConfirmButton
            title="정말 선택된 장비관리자를 삭제하시겠습니까?"
            description="삭제된 장비관리자는 복구할 수 없습니다."
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
          <Button onClick={() => onModalOpen('create')} type="primary">
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
          dataSource={deviceManagerList?.listEquipManager}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: deviceManagerList?.page.page || 1,
            pageSize: deviceManagerList?.page.rows || 10,
            total: deviceManagerList?.page.records || 0,
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

export default DeviceManagersTab;
