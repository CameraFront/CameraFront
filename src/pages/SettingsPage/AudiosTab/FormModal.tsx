import { useCallback, useEffect, useMemo } from 'react';
import {
  App,
  Button,
  Form,
  FormItemProps,
  Input,
  Modal,
  Upload,
  UploadProps,
} from 'antd';
import styled from 'styled-components';
import { UploadOutlined } from '@ant-design/icons';
import { SETTINGS_PATH } from '@/services/api/apiPaths';
import {
  useCreateAudioMutation,
  useGetAudioQuery,
  useUpdateAudioMutation,
} from '@/services/api/settings/audios';
import { OpenedModalType } from '@/types/api/settings';
import { getSuccessMessage } from '@/config/messages';

interface Props {
  openedModalType: OpenedModalType;
  id: number | null;
  onCloseModal: () => void;
}

const FormModal = ({ openedModalType, id, onCloseModal }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { data: audio, isLoading: isLoadingAudio } = useGetAudioQuery(id, {
    skip: openedModalType !== 'update',
  });
  const [createAudio, { isLoading: isCreating }] = useCreateAudioMutation();
  const [updateAudio, { isLoading: isUpdating }] = useUpdateAudioMutation();

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();

    if (openedModalType === 'update' && id) {
      await updateAudio({
        seqNum: id,
        soundNm: values.soundNm,
        type: values.type,
        file: values.fileList[0].originFileObj,
      });
      message.success(getSuccessMessage('update', '오디오가'));
    } else {
      await createAudio({
        soundNm: values.soundNm,
        type: values.type,
        file: values.fileList[0].originFileObj,
      });
      message.success(getSuccessMessage('create', '오디오가'));
    }

    onCloseModal();
  };

  const afterCloseModal = () => {
    form.resetFields();
  };

  const normFile = useCallback<NonNullable<FormItemProps['getValueFromEvent']>>(
    e => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    },
    [],
  );

  const beforeUpload = useCallback<NonNullable<UploadProps['beforeUpload']>>(
    file => {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('이미지의 용량은 2MB를 넘을 수 없습니다.');
        return Upload.LIST_IGNORE;
      }

      return false;
    },
    [message],
  );

  const modalTitle = useMemo(
    () =>
      openedModalType === 'update'
        ? '기존 오디오 수정하기'
        : '새 오디오 추가하기',
    [openedModalType],
  );

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (openedModalType === 'update' && id && audio) {
      form.setFieldsValue({
        soundNm: audio?.soundNm,
        type: audio?.type,
        fileList: [
          {
            uid: '-1',
            name: audio.fileNm,
            url: `${
              import.meta.env.VITE_APP_API_BASE_URL +
              import.meta.env.VITE_APP_API_PREFIX +
              SETTINGS_PATH
            }/getAudioFileData.do/${audio.seqNum}`,
          },
        ],
      });
    }
  }, [openedModalType, id, form, audio]);

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
        name="audios-form-in-modal"
        layout="horizontal"
        initialValues={{
          type: 1,
        }}
      >
        <Form.Item
          label="사운드명"
          name="soundNm"
          rules={[{ required: true, message: '사운드명을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="사운드타입"
          name="type"
          rules={[{ required: true, message: '사운드타입을 선택하세요.' }]}
          hidden
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="사운드파일"
          name="fileList"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: '파일을 선택하세요.' }]}
        >
          <Upload
            accept=".mp3, .wav"
            showUploadList={{ showPreviewIcon: false }}
            maxCount={1}
            beforeUpload={beforeUpload}
            multiple={false}
          >
            <Button icon={<UploadOutlined />}>업로드</Button>
          </Upload>
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
