import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Image, Popconfirm, Table, TableColumnsType } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  deleteDeviceImages,
  getDeviceImages,
} from '@/features/settingsPage/settingsSliceThunks';
import { ResDeviceImage } from '@/features/settingsPage/types';
import { formatNumber } from '@/utils/formatters';
import FormModal from './FormModal';

const DeviceImagesTab = () => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    deviceImagesTab: { deviceImages },
  } = useAppSelector(store => store.settings);

  const [selectedRows, setSelectedRows] = useState<Key[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const columns = useMemo<TableColumnsType<ResDeviceImage>>(
    () => [
      {
        title: '장비종류',
        dataIndex: 'deviceKindNm',
        key: 'deviceKindNm',
        width: '12%',
      },
      {
        title: '모델명',
        dataIndex: 'deviceFileNm',
        key: 'deviceFileNm',
        ellipsis: true,
      },
      {
        title: '유닛',
        dataIndex: 'unit',
        key: 'unit',
        width: '6%',
        render: value => (value ? `${value}U` : 'U1'),
      },
      {
        title: '썸네일',
        dataIndex: 'seqNum',
        key: 'fileNm',
        width: 300,
        render: value => (
          // NOTE: 이미지 업데이트했어도 `src`값(seqNum)이 변하지 않으면 preview 업데이트 안됨
          <Image
            width={200}
            height={24}
            src={`${
              import.meta.env.VITE_APP_API_BASE_URL +
              import.meta.env.VITE_APP_API_PREFIX
            }configuration/getDeviceImageFile.do/${
              value
            }?${new Date().toISOString()}`}
          />
        ),
      },
      {
        title: '파일명',
        dataIndex: 'fileNm',
        key: 'fileNm',
        width: '20%',
        ellipsis: true,
      },
    ],
    [],
  );

  useEffect(() => {
    dispatch(getDeviceImages({ page: 1 }));
  }, [dispatch]);

  const handleDelete = useCallback(async () => {
    await dispatch(deleteDeviceImages(selectedRows));
    dispatch(getDeviceImages({ page: 1 }));
    setSelectedRows([]);
  }, [dispatch, selectedRows]);

  if (!deviceImages) return null;

  return (
    <Wrapper>
      <div className="header">
        <div className="left-wrapper" />
        <div className="right-wrapper">
          <Popconfirm
            title="데이터 삭제하기"
            description="정말 선택된 데이터를 삭제하시겠습니까?"
            onConfirm={handleDelete}
            okButtonProps={{ loading: isLoading, danger: true }}
            okText="삭제"
            cancelText="취소"
          >
            <Button disabled={!selectedRows.length} className="btn-delete">
              삭제
            </Button>
          </Popconfirm>
          <Button
            disabled={selectedRows.length !== 1}
            onClick={() => {
              setIsFormOpen(true);
            }}
          >
            수정
          </Button>
          <Button
            onClick={() => {
              setSelectedRows([]);
              setIsFormOpen(true);
            }}
            type="primary"
          >
            추가
          </Button>
        </div>
      </div>
      <div className="content">
        <Table
          bordered
          size="small"
          rowKey="seqNum"
          columns={columns}
          dataSource={deviceImages.listDeviceImage}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: deviceImages.page.page,
            pageSize: deviceImages.page.rows,
            total: deviceImages.page.records,
            showTotal: total =>
              `${(deviceImages.page.page - 1) * deviceImages.page.rows + 1}-${
                deviceImages.page.page * deviceImages.page.rows
              } / 총 ${formatNumber(total)}개`,
            onChange: page => {
              dispatch(getDeviceImages({ page }));
            },
          }}
          rowSelection={{
            selectedRowKeys: selectedRows,
            onChange: selectedRowKeys => {
              setSelectedRows(selectedRowKeys);
            },
          }}
        />
      </div>
      {isFormOpen && (
        <FormModal
          isOpen={isFormOpen}
          id={selectedRows[0] || null}
          setIsOpen={setIsFormOpen}
          setSelectedRow={setSelectedRows}
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

export default DeviceImagesTab;
