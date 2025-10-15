import { useMemo, useState } from 'react';
import { App, Button, Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import RegularLoadingSpinner from '@/components/RegularLoadingSpinner';
import { useGetRoleListQuery } from '@/services/api/settings/roles';
import { OpenedModalType, ResRoleList } from '@/types/api/settings';
import FormModal from './FormModal';

const RolesTab = () => {
  const { message } = App.useApp();
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openedModalType, setOpenedModalType] = useState<OpenedModalType>(null);

  const { data: roleList, isLoading } = useGetRoleListQuery();

  const columns = useMemo<TableColumnsType<ResRoleList[number]>>(
    () => [
      {
        title: '권한명',
        dataIndex: 'roleNm',
        key: 'roleNm',
      },
      {
        title: '권한그룹',
        dataIndex: 'roleGroupKrNm',
        key: 'roleGroupKrNm',
      },
      {
        title: '관리권한지역',
        dataIndex: 'managementNm',
        key: 'managementNm',
      },
    ],
    [],
  );

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
          rowKey={row => row.roleId}
          columns={columns}
          dataSource={roleList}
          pagination={false}
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

export default RolesTab;
