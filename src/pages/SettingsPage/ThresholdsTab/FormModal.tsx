import { useEffect, useMemo } from 'react';
import { App, Form, Input, InputNumber, Modal } from 'antd';
import styled from 'styled-components';
import {
  useGetThresholdQuery,
  useUpdateThresholdMutation,
} from '@/services/api/settings/thresholds';
import { OpenedModalType, ThresholdFormValues } from '@/types/api/settings';
import { getSuccessMessage } from '@/config/messages';

interface Props {
  openedModalType: OpenedModalType;
  id: number | null;
  onCloseModal: () => void;
}

const FormModal = ({ openedModalType, id, onCloseModal }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<ThresholdFormValues>();
  const { data: threshold, isLoading: isLoadingThreshold } =
    useGetThresholdQuery(id, {
      skip: openedModalType !== 'update',
    });
  const [updateThreshold, { isLoading: isUpdating }] =
    useUpdateThresholdMutation();

  const isUpdateModal = useMemo(
    () => openedModalType === 'update',
    [openedModalType],
  );

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (!id) {
      message.error('장비가 선택되지 않았습니다.');
      return;
    }

    await updateThreshold({ ...values, deviceKey: id });
    message.success(getSuccessMessage('update', '임계치가'));

    onCloseModal();
  };

  const afterCloseModal = () => {
    form.resetFields();
  };

  const modalTitle = useMemo(
    () => (isUpdateModal ? '기존 임계치 수정하기' : '새 임계치 추가하기'),
    [isUpdateModal],
  );

  useEffect(() => {
    if (isUpdateModal && id && threshold) {
      form.setFieldsValue({
        deviceNm: threshold?.deviceNm || '',
        cpuThr: threshold?.cpuThr,
        memThr: threshold?.memThr,
        fsThr: threshold?.fsThr,
      });
    }
  }, [isUpdateModal, id, form, threshold]);

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
      confirmLoading={isUpdating}
      okButtonProps={{ disabled: isUpdating }}
      cancelButtonProps={{ disabled: isUpdating }}
      afterClose={afterCloseModal}
    >
      <Form
        form={form}
        preserve={false}
        labelCol={{ span: 6 }}
        name="thresholds-form-in-modal"
        layout="horizontal"
      >
        <Form.Item label="장비명" name="deviceNm">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="CPU"
          name="cpuThr"
          rules={[{ required: true, message: 'CPU 임계치를 입력하세요.' }]}
        >
          <InputNumber controls min={0} max={100} addonAfter="%" />
        </Form.Item>
        <Form.Item
          label="메모리"
          name="memThr"
          rules={[{ required: true, message: '메모리 임계치를 입력하세요.' }]}
        >
          <InputNumber controls min={0} max={100} addonAfter="%" />
        </Form.Item>
        <Form.Item
          label="디스크"
          name="fsThr"
          rules={[{ required: true, message: '디스크 임계치를 입력하세요.' }]}
        >
          <InputNumber controls min={0} max={100} addonAfter="%" />
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
