import { useMemo, useState } from 'react';
import { App, Button, Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import DangerConfirmButton from '@/components/DangerConfirmButton';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import {
  useDeleteUserMutation,
  useGetUserListQuery,
} from '@/services/api/settings/users';
import { OpenedModalType, ResUserList } from '@/types/api/settings';
import { getSuccessMessage } from '@/config/messages';
import FormModal from './FormModal';

const UsersTab = () => {
  const { message } = App.useApp();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [openedModalType, setOpenedModalType] = useState<OpenedModalType>(null);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const { data: userList, isLoading } = useGetUserListQuery();

  const columns = useMemo<TableColumnsType<ResUserList['userList'][number]>>(
    () => [
      {
        title: '아이디',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '이름',
        dataIndex: 'userNm',
        key: 'userNm',
      },
      {
        title: '권한명',
        dataIndex: 'roleNm',
        key: 'roleNm',
      },
    ],
    [],
  );

  const onDelete = () => {
    if (!selectedRowId) return;
    deleteUser(selectedRowId);
    message.success(getSuccessMessage('delete', '사용자가'));
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
        <div className="left-wrapper" />
        <div className="right-wrapper">
          <DangerConfirmButton
            title="정말 선택된 사용자를 삭제하시겠습니까?"
            description="삭제된 사용자는 복구할 수 없습니다."
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
          rowKey={row => row.userId}
          columns={columns}
          dataSource={userList?.userList}
          pagination={false}
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

export default UsersTab;
