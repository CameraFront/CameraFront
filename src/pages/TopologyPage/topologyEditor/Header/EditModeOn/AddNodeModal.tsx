import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { App, Cascader, CascaderProps, Form, Modal } from 'antd';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  saveNodes,
  setSelectedNode,
} from '@/features/topologyPage/topologySlice';
import { useGetDeviceTypeDepthListQuery } from '@/services/api/common';
import { useLazyGetDevicesByTypeQuery } from '@/services/api/topology';
import { CascaderOption } from '@/types/api/common';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

type FieldType = {
  deviceTypeAndId: [number, number, number];
};

const AddNewNodeModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const {
    content: { nodesSaved },
  } = useAppSelector(store => store.topology);
  const { data: deviceTypeList } = useGetDeviceTypeDepthListQuery();
  const [getDevicesByType, { data: devicesByType }] =
    useLazyGetDevicesByTypeQuery();
  const [form] = Form.useForm();
  const [selectedDepth2Id, setSelectedDepth2Id] = useState<number>();
  const [cascaderOptions, setCascaderOptions] = useState<CascaderOption[]>([]);

  const handleSubmit = useCallback(async () => {
    const { deviceTypeAndId } = (await form.validateFields()) as FieldType;

    const [depth1Id, depth2Id, deviceId] = deviceTypeAndId;
    const depth2Info = deviceTypeList?.find(
      deviceType => deviceType.depth2Cd === depth2Id,
    );
    const deviceInfo = devicesByType?.find(
      device => device.deviceKey === deviceId,
    );

    if (!depth2Info || !deviceInfo) {
      console.error('장비종류 또는 장비를 찾을 수 없습니다.');
    }

    const newNode = {
      id: `${deviceId}__${deviceInfo?.deviceNm}__${nanoid()}`,
      type: 'network',
      position: { x: Math.random() * 50, y: Math.random() * 50 },
      data: {
        depth1Cd: depth2Info?.depth1Cd,
        depth1Nm: depth2Info?.depth1Nm || 'No Name',
        depth2Cd: depth2Info?.depth2Cd,
        depth2Nm: depth2Info?.depth2Nm || 'No Name',
        deviceId,
        deviceName: deviceInfo?.deviceNm || 'No Name',
      },
    };
    dispatch(saveNodes([...nodesSaved, newNode]));
    dispatch(setSelectedNode(newNode));
    setIsModalOpen(false);
    form.resetFields();
  }, [
    deviceTypeList,
    devicesByType,
    dispatch,
    form,
    nodesSaved,
    setIsModalOpen,
  ]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    form.resetFields();
  }, [form, setIsModalOpen]);

  const handleLoadDevices: NonNullable<
    CascaderProps['loadData']
  > = selectedOptions => {
    if (selectedOptions.length !== 2) return;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    setSelectedDepth2Id(targetOption.value);
  };

  // 캐스케이더가 닫힐 때, 선택된 장비가 없으면 초기화
  const handleDropdownVisibleChange = (open: boolean) => {
    if (!open) {
      const deviceTypeAndId = form.getFieldValue('deviceTypeAndId');
      if (deviceTypeAndId.length < 3) {
        form.setFieldValue('deviceTypeAndId', undefined);
      }
    }
  };

  useEffect(() => {
    if (!deviceTypeList) return;
    const groupedByDepth1 = deviceTypeList.reduce(
      (acc, item) => {
        if (!acc[item.depth1Cd]) {
          acc[item.depth1Cd] = [];
        }
        acc[item.depth1Cd].push(item);
        return acc;
      },
      {} as Record<number, typeof deviceTypeList>,
    );

    const newCascaderOptions = Object.entries(groupedByDepth1).map(
      ([depth1Cd, items]) => ({
        label: items[0].depth1Nm,
        value: parseInt(depth1Cd),
        depth: 1,
        isLeaf: false,
        children: items.map(item => ({
          label: item.depth2Nm,
          value: item.depth2Cd,
          depth: 2,
          isLeaf: false,
        })),
      }),
    );

    setCascaderOptions(newCascaderOptions);
  }, [deviceTypeList]);

  useEffect(() => {
    if (!selectedDepth2Id) return;
    getDevicesByType(selectedDepth2Id);
  }, [getDevicesByType, selectedDepth2Id]);

  // 새로운 장비목록을 가져올 때마다 캐스케이더 옵션에 반영
  useEffect(() => {
    if (!devicesByType) return;
    if (!devicesByType.length) {
      message.warning('등록된 장비가 없습니다.');
      return;
    }

    const findAndAddChildren = (items: CascaderOption[]): CascaderOption[] =>
      items.map(item => {
        if (item.depth === 2 && item.value === selectedDepth2Id) {
          if (item.children) return item;

          return {
            ...item,
            children: devicesByType.map(device => ({
              label: device.deviceNm,
              value: device.deviceKey,
              depth: 3,
              isLeaf: true,
            })),
          };
        }

        if (item.children) {
          return {
            ...item,
            children: findAndAddChildren(item.children),
          };
        }

        return item;
      });

    setCascaderOptions(prev => findAndAddChildren(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devicesByType]);

  return (
    <Modal
      centered
      title="새 노드 추가"
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
        wrapperCol={{ span: 18 }}
        name="add-node-form"
        layout="horizontal"
      >
        <Form.Item
          label="장비"
          name="deviceTypeAndId"
          rules={[{ required: true, message: '장비를 선택하세요.' }]}
        >
          <Cascader
            placeholder="장비 선택"
            options={cascaderOptions}
            loadData={handleLoadDevices}
            displayRender={label => label.join(' > ')}
            changeOnSelect
            onDropdownVisibleChange={handleDropdownVisibleChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewNodeModal;
