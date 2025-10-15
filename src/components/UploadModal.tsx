import { App, Form, FormProps, Modal } from 'antd';
import styled from 'styled-components';
import FileUploadField from '@/components/FileUploadField';
import { useUploadExcelMutation } from '@/services/api/common';

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  urlPath: string;
  confirmTitle?: string;
  confirmMessage?: string;
  onSuccess?: () => void;
}

const UploadModal = ({
  title,
  confirmTitle = '기존 등록된 데이터를 덮어씌웁니다. 정말로 업로드하시겠습니까?',
  confirmMessage = '기존에 등록된 데이터는 모두 삭제되고 엑셀에 담긴 새로운 데이터가 추가됩니다.',
  isOpen,
  onClose,
  urlPath,
  onSuccess,
}: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { modal } = App.useApp();
  const [uploadExcel, { isLoading: isUploading }] = useUploadExcelMutation();

  const onSubmit: FormProps['onFinish'] = async () => {
    const values = await form.validateFields();
    const formData = new FormData();
    formData.append('file', values.file[0].originFileObj);

    try {
      await uploadExcel({ urlPath, formData }).unwrap();
      onSuccess?.();
      message.success('성공적으로 업로드가 완료되었습니다.');
      // eslint-disable-next-line no-empty
    } catch (error) {
    } finally {
      onClose();
    }
  };

  return (
    <Wrapper
      centered
      destroyOnClose
      title={title}
      open={isOpen}
      okText="업로드"
      cancelText="취소"
      closable
      maskClosable={false}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      onOk={async () => {
        try {
          await form.validateFields();
        } catch (error) {
          return;
        }

        modal.confirm({
          title: confirmTitle,
          content: confirmMessage,
          okText: '확인',
          cancelText: '취소',
          onOk: onSubmit,
          okButtonProps: {
            danger: true,
          },
          width: 560,
          closable: true,
          maskClosable: true,
        });
      }}
      width={600}
      styles={{
        body: {
          paddingTop: '1.6rem',
          overflowY: 'auto',
          maxHeight: '80vh',
          paddingRight: '1.6rem',
        },
      }}
      confirmLoading={isUploading}
      okButtonProps={{ disabled: isUploading }}
      cancelButtonProps={{ disabled: isUploading }}
      afterClose={() => {
        form.resetFields();
      }}
    >
      <Form
        form={form}
        preserve={false}
        name="upload-form-in-modal"
        layout="horizontal"
      >
        <FileUploadField
          name="file"
          constraints={{ extensions: ['xlsx'], size: 50 }}
          required
        />
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Modal)``;

export default UploadModal;
