import { useEffect, useMemo } from 'react';
import { App, Form, Input, Modal, Select } from 'antd';
import styled from 'styled-components';
import {
  useCreateDeviceManagerMutation,
  useGetDeviceManagerQuery,
  useUpdateDeviceManagerMutation,
} from '@/services/api/settings/deviceManagers';
import { DeviceManagerFormValues, OpenedModalType } from '@/types/api/settings';
import { getSuccessMessage } from '@/config/messages';
import { MANAGE_YN_OPTIONS } from '@/config/options';

interface Props {
  openedModalType: OpenedModalType;
  id: number | null;
  onCloseModal: () => void;
}

const FormModal = ({ openedModalType, id, onCloseModal }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<DeviceManagerFormValues>();
  const { data: deviceManager, isLoading: isLoadingDeviceManager } =
    useGetDeviceManagerQuery(id, {
      skip: openedModalType !== 'update',
    });
  const [createDeviceManager, { isLoading: isCreating }] =
    useCreateDeviceManagerMutation();
  const [updateDeviceManager, { isLoading: isUpdating }] =
    useUpdateDeviceManagerMutation();

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (openedModalType === 'update' && id) {
      await updateDeviceManager({ ...values, seqNum: id });
      message.success(getSuccessMessage('update', '장비관리자가'));
    } else {
      await createDeviceManager(values);
      message.success(getSuccessMessage('create', '장비관리자가'));
    }

    onCloseModal();
  };

  const afterCloseModal = () => {
    form.resetFields();
  };

  const modalTitle = useMemo(
    () =>
      openedModalType === 'update'
        ? '기존 장비관리자 수정하기'
        : '새 장비관리자 추가하기',
    [openedModalType],
  );

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (openedModalType === 'update' && id && deviceManager) {
      form.setFieldsValue({
        managerNm: deviceManager?.managerNm,
        department: deviceManager?.department,
        tel: deviceManager?.tel,
        email: deviceManager?.email,
        manageYn: deviceManager?.manageYn,
      });
    }
  }, [openedModalType, id, form, deviceManager]);

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
        name="device-managers-form-in-modal"
        layout="horizontal"
      >
        <Form.Item
          label="관리자명"
          name="managerNm"
          rules={[{ required: true, message: '관리자명을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="부서"
          name="department"
          rules={[{ required: true, message: '부서를 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="전화번호"
          name="tel"
          rules={[{ required: true, message: '전화번호를 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="이메일"
          name="email"
          rules={[{ required: true, message: '이메일을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="관리여부"
          name="manageYn"
          rules={[{ required: true, message: '관리여부을 선택하세요.' }]}
        >
          <Select options={MANAGE_YN_OPTIONS} />
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
