import { useEffect, useMemo, useState } from 'react';
import { App, Cascader, DatePicker, Form, Input, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import useManagementOptions from '@/hooks/useManagementOptions';
import {
  useGetDeviceTypeListQuery,
  useLazyGetDeviceTypesByDepthQuery,
} from '@/services/api/common';
import { useGetDeviceManagerListAllQuery } from '@/services/api/settings/deviceManagers';
import {
  useCreateDeviceMutation,
  useGetDeviceQuery,
  useUpdateDeviceMutation,
} from '@/services/api/settings/devices';
import { useGetManagementQuery } from '@/services/api/settings/managements';
import { OptionType } from '@/types/api/common';
import { DeviceFormValues, OpenedModalType } from '@/types/api/settings';
import { getSuccessMessage } from '@/config/messages';
import { MANAGE_OPTIONS } from '@/config/options';

const initialValues = {
  managementCds: [],
  device1Depth: undefined,
  device2Depth: undefined,
  deviceNm: '',
  pstnNm: '',
  deviceIp: '',
  installCompany: '',
  modelNm: '',
  productCompany: '',
  installDate: '',
  managerA: '',
  managerB: '',
  manageYn: '',
};
interface Props {
  openedModalType: OpenedModalType;
  id: number | null;
  onCloseModal: () => void;
}

const FormModal = ({ openedModalType, id, onCloseModal }: Props) => {
  const isUpdate = useMemo(
    () => openedModalType === 'update',
    [openedModalType],
  );
  const isClone = useMemo(() => openedModalType === 'clone', [openedModalType]);
  const { message } = App.useApp();
  const [form] = Form.useForm<
    Omit<DeviceFormValues, 'managementCd'> & {
      managementCds: number[];
    }
  >();
  const { data: device, isLoading: isLoadingDevice } = useGetDeviceQuery(id, {
    skip: !(isUpdate || isClone),
  });
  const { data: managementDetails } = useGetManagementQuery(
    device?.managementCd,
    {
      skip: !(isUpdate || isClone) || !device?.managementCd,
    },
  );
  const parentNodes = useMemo<(number | null)[] | undefined>(() => {
    if (!isUpdate && !isClone) return [null];
    if (!managementDetails) return undefined;

    return [
      null,
      ...(managementDetails.path.split('/').slice(1, -1).map(Number) ?? []),
    ];
  }, [isUpdate, isClone, managementDetails]);
  const {
    options,
    loadOptions: loadManagementOptions,
    isLoading: isLoadingCascader,
    isInitialized,
  } = useManagementOptions({
    hasRoot: false,
    initialValues: parentNodes,
  });
  const { data: deviceTypes1 } = useGetDeviceTypeListQuery(true);
  const [getDeviceTypes2, { isLoading: isLoadingDeviceTypes2 }] =
    useLazyGetDeviceTypesByDepthQuery();
  const { data: deviceManagers } = useGetDeviceManagerListAllQuery();
  const [createDevice, { isLoading: isCreating }] = useCreateDeviceMutation();
  const [updateDevice, { isLoading: isUpdating }] = useUpdateDeviceMutation();
  const [deviceType2Options, setDeviceType2Options] = useState<OptionType[]>(
    [],
  );

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onValuesChange = (
    changedValues: Partial<
      Omit<DeviceFormValues, 'managementCd'> & {
        managementCds: number[];
      }
    >,
  ) => {
    if (changedValues.managementCds) {
      loadManagementOptions(changedValues.managementCds);
    }

    if (changedValues.device1Depth) {
      getDeviceTypes2({
        depth: 2,
        deviceType: changedValues.device1Depth,
      }).then(res => {
        setDeviceType2Options(
          res.data?.deviceDepthList.map(({ deviceKind, deviceKindNm }) => ({
            label: deviceKindNm,
            value: deviceKind,
          })) ?? [],
        );
      });
    }
  };

  const onSubmit = async () => {
    const { managementCds, ...rest } = await form.validateFields();
    if (isUpdate && id) {
      const result = await updateDevice({
        ...rest,
        managementCd: managementCds[managementCds.length - 1],
        deviceKey: id,
      });
      if ('error' in result) return;

      message.success(getSuccessMessage('update', '장비가'));
    } else if (isClone && id) {
      const result = await createDevice({
        ...rest,
        managementCd: managementCds[managementCds.length - 1],
      });
      if ('error' in result) return;

      message.success(getSuccessMessage('clone', '장비가'));
    } else {
      const result = await createDevice({
        ...rest,
        managementCd: managementCds[managementCds.length - 1],
      });
      if ('error' in result) return;

      message.success(getSuccessMessage('create', '장비가'));
    }

    onCloseModal();
  };

  const afterCloseModal = () => {
    form.resetFields();
  };

  const modalTitle = useMemo(() => {
    if (isClone) {
      return '기존 장비 복제하기';
    }
    return isUpdate ? '기존 장비 수정하기' : '새 장비 추가하기';
  }, [isUpdate, isClone]);

  const deviceType1Options = useMemo(
    () =>
      deviceTypes1?.map(({ seqNum, deviceKindNm }) => ({
        label: deviceKindNm,
        value: seqNum,
      })) ?? [],
    [deviceTypes1],
  );

  const deviceManagerOptions = useMemo(
    () =>
      deviceManagers?.listEquipManager.map(({ seqNum, managerNm }) => ({
        label: managerNm,
        value: seqNum,
      })) ?? [],
    [deviceManagers],
  );

  const isLoading = isCreating || isUpdating || isLoadingDevice;

  useEffect(() => {
    if (!isInitialized) return;

    if (
      (isUpdate && id && device && managementDetails) ||
      (isClone && id && device && managementDetails)
    ) {
      getDeviceTypes2({
        depth: 1,
        deviceType: device.device1Depth,
      }).then(res => {
        setDeviceType2Options(
          res.data?.deviceDepthList.map(({ deviceKind, deviceKindNm }) => ({
            label: deviceKindNm,
            value: deviceKind,
          })) ?? [],
        );
      });
      const managementCds = managementDetails.path
        .split('/')
        .slice(1)
        .map(Number);
      form.setFieldsValue({
        managementCds,
        deviceNm: device.deviceNm,
        deviceIp: device.deviceIp,
        device1Depth: device.device1Depth,
        device2Depth: device.device2Depth,
        installCompany: device.installCompany,
        productCompany: device.productCompany,
        installDate: device.installDate ? dayjs(device.installDate) : undefined,
        modelNm: device.modelNm,
        pstnNm: device.pstnNm,
        managerA: device.managerA,
        managerB: device.managerB,
        manageYn: device.manageYn,
      });
    }
  }, [
    isUpdate,
    isClone,
    id,
    form,
    device,
    managementDetails,
    isInitialized,
    parentNodes,
    getDeviceTypes2,
  ]);

  return (
    <Wrapper
      centered
      destroyOnClose
      title={modalTitle}
      open={!!openedModalType}
      okText="저장"
      cancelText="취소"
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={isLoading}
      okButtonProps={{ disabled: isLoading }}
      cancelButtonProps={{ disabled: isLoading }}
      afterClose={afterCloseModal}
    >
      <Form
        form={form}
        preserve={false}
        labelCol={{ span: 6 }}
        name="devices-form-in-modal"
        layout="horizontal"
        initialValues={initialValues}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="소속"
          name="managementCds"
          rules={[{ required: true, message: '소속을 선택하세요.' }]}
        >
          <Cascader
            changeOnSelect
            loading={isLoadingCascader}
            options={options}
          />
        </Form.Item>
        <Form.Item
          label="상위 장비종류"
          name="device1Depth"
          rules={[{ required: true, message: '상위 장비종류를 선택하세요.' }]}
        >
          <Select options={deviceType1Options} />
        </Form.Item>
        <Form.Item
          label="하위 장비종류"
          name="device2Depth"
          rules={[{ required: true, message: '하위 장비종류를 선택하세요.' }]}
        >
          <Select
            loading={isLoadingDeviceTypes2}
            options={deviceType2Options}
          />
        </Form.Item>
        <Form.Item
          label="장비명"
          name="deviceNm"
          rules={[{ required: true, message: '장비명을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="위치"
          name="pstnNm"
          rules={[{ required: true, message: '위치를 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="IP주소"
          name="deviceIp"
          rules={[
            { required: true, message: 'IP주소를 입력하세요.' },
            {
              pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
              message: 'IP주소 형식이 올바르지 않습니다.',
            },
            {
              validator: (_, value: string) => {
                if (!value) return Promise.resolve();

                const parts = value.split('.');
                const isValid = parts.every(part => {
                  const num = parseInt(part, 10);
                  return num >= 0 && num <= 255;
                });

                return isValid
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error('IP주소는 0-255 사이의 숫자여야 합니다.'),
                    );
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="설치업체" name="installCompany">
          <Input />
        </Form.Item>
        <Form.Item label="모델명" name="modelNm">
          <Input />
        </Form.Item>
        <Form.Item label="제조사" name="productCompany">
          <Input />
        </Form.Item>
        <Form.Item label="설치일자" name="installDate">
          <DatePicker />
        </Form.Item>
        <Form.Item label="관리자(정)" name="managerA">
          <Select options={deviceManagerOptions} />
        </Form.Item>
        <Form.Item label="관리자(부)" name="managerB">
          <Select options={deviceManagerOptions} />
        </Form.Item>
        <Form.Item
          label="관리여부"
          name="manageYn"
          hidden={!isUpdate}
          rules={[{ required: isUpdate, message: '관리여부를 선택하세요.' }]}
        >
          <Select options={MANAGE_OPTIONS} />
        </Form.Item>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Modal)`
  .ant-modal-body {
    padding-top: 1.6rem;
    overflow-y: auto;
    max-height: 80vh;
    padding-right: 1.6rem;
  }
`;

export default FormModal;
