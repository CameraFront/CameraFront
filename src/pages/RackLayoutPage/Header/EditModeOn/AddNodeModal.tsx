import {
  Dispatch,
  Key,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useReactFlow } from 'reactflow';
import {
  Alert,
  Cascader,
  Flex,
  Form,
  Image,
  Modal,
  Table,
  TableColumnsType,
  message,
} from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  saveNodes,
  setSelectedNode,
} from '@/features/rackLayoutPage/rackLayoutSlice';
import { resetState } from '@/features/settingsPage/settingsSlice';
import { DeviceTypeSelectOptions } from '@/features/topologyPage/types';
import { useGetDeviceTypeListQuery } from '@/services/api/common';
import {
  useLazyGetRackLayoutDeviceImagesByDeviceTypeQuery,
  useLazyGetRackLayoutDevicesByDeviceTypeQuery,
} from '@/services/api/rackLayout';
import { ResRackLayoutDeviceImagesByDeviceType } from '@/types/api/rackLayout';
import { formatNumber } from '@/utils/formatters';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

type FieldType = {
  deviceTypeAndId: [number, number];
};

const AddNewNodeModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const rfInstance = useReactFlow();
  const dispatch = useAppDispatch();
  const {
    content: { nodesSaved },
  } = useAppSelector(store => store.rackLayout);
  const [form] = Form.useForm<FieldType>();
  const deviceTypeAndId = Form.useWatch('deviceTypeAndId', form);
  const [deviceTypeId, deviceId] = deviceTypeAndId || [];
  const { data: deviceTypeList } = useGetDeviceTypeListQuery(true);
  const [getDevicesByDeviceType, { data: deviceListByDeviceType }] =
    useLazyGetRackLayoutDevicesByDeviceTypeQuery();
  const [getDeviceImagesByDeviceType, { data: deviceImagesByDeviceType }] =
    useLazyGetRackLayoutDeviceImagesByDeviceTypeQuery();

  const [selectedRows, setSelectedRows] = useState<Key[]>([]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    dispatch(resetState());
    setSelectedRows([]);
    form.resetFields();
  }, [dispatch, form, setIsModalOpen]);

  const handleSubmit = useCallback(async () => {
    const { deviceTypeAndId } = (await form.validateFields()) as FieldType;

    if (selectedRows.length !== 1)
      return message.warning('사용할 장비 이미지를 선택하세요.');

    const [deviceTypeId, deviceId] = deviceTypeAndId;
    if (!deviceTypeId || !deviceId)
      return message.warning('장비종류와 장비를 모두 선택하세요.');

    const deviceTypeInfo = deviceTypeList?.find(
      o => o.deviceKind === deviceTypeId,
    );
    if (!deviceTypeInfo) {
      return message.warning('해당 장비종류를 찾을 수 없습니다.');
    }

    const deviceInfo = deviceListByDeviceType?.find(
      o => o.deviceKey === deviceId,
    );
    if (!deviceInfo) {
      return message.warning('해당 장비를 찾을 수 없습니다.');
    }

    if (!deviceImagesByDeviceType) return;
    const deviceImageInfo = deviceImagesByDeviceType.listDeviceImage.find(
      image => image.seqNum === selectedRows[0],
    );

    if (!deviceImageInfo) {
      return message.warning('해당 장비이미지를 찾을 수 없습니다.');
    }

    const newNode = {
      id: deviceId.toString(),
      type: 'rackItem',
      position: { x: 0, y: Math.random() * 100 },
      data: {
        deviceImageId: deviceImageInfo.seqNum,
        unit: deviceImageInfo.unit,
        deviceTypeId,
        deviceTypeName: deviceTypeInfo.deviceKindNm,
        deviceId,
        deviceName: deviceInfo.deviceNm,
      },
    };

    dispatch(saveNodes([...nodesSaved, newNode]));
    dispatch(setSelectedNode(newNode));

    handleCancel();
  }, [
    dispatch,
    form,
    nodesSaved,
    selectedRows,
    deviceImagesByDeviceType,
    deviceListByDeviceType,
    deviceTypeList,
    handleCancel,
  ]);

  // 장비종류 및 장비옵션 변경시 Cascader options 업데이트
  const OptionsForDeviceType = useMemo<DeviceTypeSelectOptions[]>(() => {
    if (!deviceTypeList) return [];

    return deviceTypeList.map(el => ({
      label: el.deviceKindNm,
      value: el.deviceKind,
      isLeaf: false,
      ...(el.deviceKind === deviceTypeId && {
        isLeaf: !deviceListByDeviceType?.length,
        children:
          deviceListByDeviceType?.map(el => ({
            label: el.deviceNm,
            value: el.deviceKey,
            ...(rfInstance.getNode(el.deviceKey.toString()) && {
              disabled: true,
            }),
          })) || [],
      }),
    }));
  }, [deviceListByDeviceType, rfInstance, deviceTypeId, deviceTypeList]);

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
        render: value => (value ? `${value}U` : 'U1'),
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
    if (deviceTypeId) {
      getDevicesByDeviceType(deviceTypeId);
      getDeviceImagesByDeviceType({ deviceTypeId, page: 1 });
    }
  }, [deviceTypeId, getDevicesByDeviceType, getDeviceImagesByDeviceType]);

  return (
    <Modal
      width={1000}
      centered
      title="새 장비 추가"
      open={isModalOpen}
      destroyOnClose
      styles={{ body: { padding: '2rem 1rem .6rem' } }}
      okText="저장"
      cancelText="취소"
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form<FieldType>
        form={form}
        autoComplete="off"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        name="add-device-modal"
        layout="horizontal"
      >
        <Form.Item
          label="장비"
          name="deviceTypeAndId"
          rules={[{ required: true, message: '장비를 선택하세요.' }]}
        >
          <Cascader
            placeholder="장비 선택"
            options={OptionsForDeviceType}
            // loadData={handleLoadDevices}
            changeOnSelect
          />
        </Form.Item>
      </Form>
      {deviceImagesByDeviceType ? (
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
              getDeviceImagesByDeviceType({ deviceTypeId, page });
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
      ) : (
        <Flex justify="center">
          <Alert type="info" message="장비종류를 선택하세요." showIcon />
        </Flex>
      )}
    </Modal>
  );
};

export default AddNewNodeModal;
