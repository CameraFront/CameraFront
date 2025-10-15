import { useCallback, useEffect, useMemo } from 'react';
import {
  App,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  SelectProps,
  Switch,
} from 'antd';
import styled from 'styled-components';
import AudioPlayButton from '@/components/AudioPlayButton';
import { useGetAllAudiosQuery } from '@/services/api/settings/audios';
import {
  useGetEventQuery,
  useUpdateEventMutation,
} from '@/services/api/settings/events';
import { EventFormValues, OpenedModalType } from '@/types/api/settings';
import { getSuccessMessage } from '@/config/messages';
import { EVENT_TYPE_OPTIONS } from '@/config/options';

interface Props {
  openedModalType: OpenedModalType;
  id: string | null;
  onCloseModal: () => void;
}

const FormModal = ({ openedModalType, id, onCloseModal }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<EventFormValues>();
  const { data: event } = useGetEventQuery(id, {
    skip: openedModalType !== 'update',
  });
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const { data: audios, isLoading: isLoadingAudios } = useGetAllAudiosQuery();

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (openedModalType === 'update' && id) {
      await updateEvent({ ...values, fCd: id });
      message.success(getSuccessMessage('update', '장애가'));
    }

    onCloseModal();
  };

  const afterCloseModal = () => {
    form.resetFields();
  };

  const modalTitle = useMemo(
    () =>
      openedModalType === 'update' ? '기존 장애 수정하기' : '새 장애 추가하기',
    [openedModalType],
  );

  const isLoading = isUpdating;

  const audioOptions = useMemo(
    () =>
      audios?.listAudio.map(audio => ({
        label: audio.soundNm,
        value: audio.seqNum,
      })) || [],
    [audios],
  );

  const audioOptionRender = useCallback<
    NonNullable<SelectProps['optionRender']>
  >(
    option => (
      <Flex justify="space-between">
        <span>{option.label}</span>
        <AudioPlayButton stopPropagation audioKey={option.value as number} />
      </Flex>
    ),
    [],
  );

  useEffect(() => {
    if (openedModalType === 'update' && id && event) {
      form.setFieldsValue({
        fDes: event?.fDes,
        fLv: event?.fLv,
        isAudible: event?.isAudible,
        manageYn: event?.manageYn,
        audioKey: event?.audioKey,
      });
    }
  }, [openedModalType, id, form, event]);

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
        name="events-form-in-modal"
        layout="horizontal"
      >
        <Form.Item
          label="장애명"
          name="fDes"
          rules={[{ required: true, message: '장애명을 입력하세요.' }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="장애레벨"
          name="fLv"
          rules={[{ required: true, message: '장애레벨을 선택하세요.' }]}
        >
          <Select options={EVENT_TYPE_OPTIONS} />
        </Form.Item>
        <Form.Item
          label="관리여부"
          name="manageYn"
          rules={[{ required: true, message: '관리여부를 선택하세요.' }]}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="가청알람여부"
          name="isAudible"
          rules={[{ required: true, message: '가청알람여부를 선택하세요.' }]}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item label="가청알람음" name="audioKey">
          <Select
            loading={isLoadingAudios}
            options={audioOptions}
            optionRender={audioOptionRender}
          />
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
