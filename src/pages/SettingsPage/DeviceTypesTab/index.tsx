import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getDeviceTypes } from '@/features/settingsPage/settingsSliceThunks';
import { ResDeviceType } from '@/features/settingsPage/types';
import { SettingsTab } from '@/types/enum';
import ModalForm from './ModalFrom';

const DeviceTypesTab = () => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    selectedTab,
    deviceTypesTab: { deviceTypes },
  } = useAppSelector(store => store.settings);

  const [selectedRow, setSelectedRow] = useState<Key[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const columns = useMemo<TableColumnsType<ResDeviceType>>(
    () => [
      {
        title: '아이디',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '대분류',
        dataIndex: 'depth1Nm',
        key: 'depth1Nm',
      },
      {
        title: '장비종류',
        dataIndex: 'depth2Nm',
        key: 'depth2Nm',
      },
    ],
    [],
  );

  // useEffect(() => {
  //   if (selectedTab !== SettingsTab.DeviceTypesTab) return;

  //   dispatch(getDeviceTypes());
  // }, []);

  if (!deviceTypes) return null;

  return (
    <Wrapper>
      <div className="header">
        <div className="left-wrapper" />
        <div className="right-wrapper">
          <Button
            disabled={!selectedRow.length}
            onClick={() => {
              setIsFormOpen(true);
            }}
          >
            수정
          </Button>
        </div>
      </div>
      <div className="content">
        <Table
          bordered
          size="small"
          rowKey="id"
          columns={columns}
          dataSource={deviceTypes}
          pagination={false}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedRow,
            onChange: selectedRowKeys => {
              setSelectedRow(selectedRowKeys);
            },
          }}
        />
      </div>
      {isFormOpen && (
        <ModalForm
          isOpen={isFormOpen}
          id={selectedRow[0] || null}
          setIsOpen={setIsFormOpen}
          setSelectedRow={setSelectedRow}
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

export default DeviceTypesTab;
