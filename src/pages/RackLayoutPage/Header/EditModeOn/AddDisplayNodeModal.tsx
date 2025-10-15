import {
  Dispatch,
  Key,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Image, Modal, Table, TableColumnsType, message } from 'antd';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  saveNodes,
  setSelectedNode,
} from '@/features/rackLayoutPage/rackLayoutSlice';
import { resetState } from '@/features/settingsPage/settingsSlice';
import { useLazyGetRackLayoutDeviceImagesByDeviceTypeQuery } from '@/services/api/rackLayout';
import { ResRackLayoutDeviceImagesByDeviceType } from '@/types/api/rackLayout';
import { formatNumber } from '@/utils/formatters';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const AddNewDisplayNodeModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const dispatch = useAppDispatch();
  const {
    content: { nodesSaved },
  } = useAppSelector(store => store.rackLayout);
  const [getDeviceImagesByDeviceType, { data: deviceImagesByDeviceType }] =
    useLazyGetRackLayoutDeviceImagesByDeviceTypeQuery();

  const [selectedRows, setSelectedRows] = useState<Key[]>([]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    dispatch(resetState());
    setSelectedRows([]);
  }, [dispatch, setIsModalOpen]);

  const handleSubmit = useCallback(async () => {
    if (selectedRows.length !== 1)
      return message.warning('사용할 장비 이미지를 선택하세요.');

    if (!deviceImagesByDeviceType) return;
    const deviceImageInfo = deviceImagesByDeviceType.listDeviceImage.find(
      image => image.seqNum === selectedRows[0],
    );
    if (!deviceImageInfo) {
      return message.warning('해당 장비이미지를 찾을 수 없습니다.');
    }

    const newNode = {
      id: `rackItemDisplay-${nanoid()}`,
      type: 'rackItemDisplay',
      position: { x: 0, y: Math.random() * 100 },
      data: {
        deviceImageId: deviceImageInfo.seqNum,
        unit: deviceImageInfo.unit,
        deviceTypeId: deviceImageInfo.deviceKind,
        deviceTypeName: deviceImageInfo.deviceKindNm,
      },
    };

    dispatch(saveNodes([...nodesSaved, newNode]));
    dispatch(setSelectedNode(newNode));

    handleCancel();
  }, [
    dispatch,
    nodesSaved,
    selectedRows,
    deviceImagesByDeviceType,
    handleCancel,
  ]);

  const columns = useMemo<
    TableColumnsType<
      ResRackLayoutDeviceImagesByDeviceType['listDeviceImage'][number]
    >
  >(
    () => [
      {
        title: '종류',
        dataIndex: 'deviceKindNm',
        key: 'deviceKindNm',
        width: '15%',
        ellipsis: true,
      },
      {
        title: '모델명',
        dataIndex: 'deviceFileNm',
        key: 'deviceFileNm',
      },
      {
        title: '유닛',
        dataIndex: 'unit',
        key: 'unit',
        width: '8%',
        render: value => (value ? `${value}U` : ''),
      },
      {
        title: '모델 이미지',
        dataIndex: 'seqNum',
        key: 'fileNm',
        width: 300,
        render: value => (
          // NOTE: 이미지 업데이트했어도 `src`값이 변하지 않으면 preview 업데이트 안됨
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
    ],
    [],
  );

  useEffect(() => {
    getDeviceImagesByDeviceType();
  }, [getDeviceImagesByDeviceType]);

  return (
    <Modal
      width={1000}
      centered
      title="새 디스플레이 장비 추가"
      open={isModalOpen}
      destroyOnClose
      styles={{ body: { padding: '2rem 1rem .6rem' } }}
      okText="저장"
      cancelText="취소"
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      {!deviceImagesByDeviceType ? null : (
        <Table
          bordered
          size="small"
          rowKey={record => record.seqNum}
          columns={columns}
          dataSource={deviceImagesByDeviceType.listDeviceImage || []}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            current: deviceImagesByDeviceType.page.page,
            pageSize: deviceImagesByDeviceType.page.rows,
            total: deviceImagesByDeviceType.page.records,
            showTotal: total =>
              `${(deviceImagesByDeviceType.page.page - 1) * deviceImagesByDeviceType.page.rows + 1}-${
                deviceImagesByDeviceType.page.page *
                deviceImagesByDeviceType.page.rows
              } / 총 ${formatNumber(total)}개`,
            onChange: page => {
              getDeviceImagesByDeviceType({ page });
            },
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedRows,
            onChange: selectedRowKeys => {
              setSelectedRows(selectedRowKeys);
            },
          }}
        />
      )}
    </Modal>
  );
};

export default AddNewDisplayNodeModal;
