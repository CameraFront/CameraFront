import { Key, useCallback, useEffect, useMemo } from 'react';
import {
  Button,
  Form,
  FormItemProps,
  Input,
  Modal,
  Radio,
  Select,
  Upload,
  UploadProps,
  message,
} from 'antd';
import styled from 'styled-components';
import { UploadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  createDeviceImage,
  getDeviceImage,
  getDeviceImages,
  updateDeviceImage,
} from '@/features/settingsPage/settingsSliceThunks';
import { getDeviceTypeOptions } from '@/features/topologyPage/topologySlice';
import { DEVICE_IMAGE_UNIT_OPTIONS } from '@/config/options';

interface Props {
  isOpen: boolean;
  id: Key | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRow: React.Dispatch<React.SetStateAction<Key[]>>;
}
const FormModal = ({ isOpen, id, setIsOpen, setSelectedRow }: Props) => {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    deviceImagesTab: { deviceImage },
  } = useAppSelector(store => store.settings);
  const {
    content: { deviceTypeOptions },
  } = useAppSelector(store => store.topology);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getDeviceTypeOptions());
  }, [dispatch]);

  useEffect(() => {
    if (!id) return;

    dispatch(getDeviceImage(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!deviceImage || !id) return;

    form.setFieldsValue({
      ...deviceImage,
      fileList: [
        {
          uid: '-1',
          name: deviceImage.fileNm,
          url: `${
            import.meta.env.VITE_APP_API_BASE_URL +
            import.meta.env.VITE_APP_API_PREFIX
          }configuration/getDeviceImageFile.do/${deviceImage.seqNum}`,
        },
      ],
    });
  }, [deviceImage, id, form]);

  const deviceTypeTypes = useMemo(() => {
    if (!deviceTypeOptions) return [];

    return deviceTypeOptions.map(category => ({
      label: category.deviceKindNm,
      value: category.deviceKind,
    }));
  }, [deviceTypeOptions]);

  const beforeUpload = useCallback<NonNullable<UploadProps['beforeUpload']>>(
    file => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('JPG/PNG 파일만 선택할 수 있습니다.');
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('이미지의 용량은 2MB를 넘을 수 없습니다.');
        return Upload.LIST_IGNORE;
      }

      return false;
    },
    [],
  );

  const normFile = useCallback<NonNullable<FormItemProps['getValueFromEvent']>>(
    e => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    },
    [],
  );

  return (
    <Wrapper
      centered
      destroyOnClose
      title={id ? '기존 장비이미지 수정하기' : '새 장비이미지 추가하기'}
      open={isOpen}
      okText="저장"
      cancelText="취소"
      onCancel={() => {
        setIsOpen(false);
        form.resetFields();
      }}
      onOk={async () => {
        try {
          const values = await form.validateFields();

          if (id) {
            await dispatch(
              updateDeviceImage({
                seqNum: values.seqNum,
                deviceKind: values.deviceKind,
                deviceFileNm: values.deviceFileNm,
                file: values.fileList[0].originFileObj,
                unit: values.unit,
              }),
            );
          } else {
            await dispatch(
              createDeviceImage({
                deviceKind: values.deviceKind,
                deviceFileNm: values.deviceFileNm,
                file: values.fileList[0].originFileObj,
                unit: values.unit,
              }),
            );
          }

          await dispatch(getDeviceImages({ page: 1 }));
          setSelectedRow([]);
          setIsOpen(false);
        } catch (error) {
          console.log(error);
        }
      }}
      confirmLoading={isLoading}
      okButtonProps={{ disabled: isLoading }}
      cancelButtonProps={{ disabled: isLoading }}
      afterClose={() => {
        form.resetFields();
      }}
    >
      <Form
        form={form}
        preserve={false}
        labelCol={{ span: 6 }}
        name="form-in-modal"
        layout="horizontal"
      >
        {id ? (
          <Form.Item label="아이디" name="seqNum">
            <Input disabled />
          </Form.Item>
        ) : null}
        <Form.Item
          label="장비종류"
          name="deviceKind"
          rules={[{ required: true, message: '장비종류를 선택하세요.' }]}
        >
          <Select options={deviceTypeTypes} />
        </Form.Item>
        <Form.Item
          label="장비명"
          name="deviceFileNm"
          rules={[{ required: true, message: '장비명을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="fileList"
          label="장비 이미지"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: '이미지를 선택하세요.' }]}
        >
          <Upload
            listType="picture"
            accept=".jpg, .jpeg, .png"
            showUploadList={{ showPreviewIcon: false }}
            maxCount={1}
            beforeUpload={beforeUpload}
            multiple={false}
          >
            <Button icon={<UploadOutlined />}>업로드</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="유닛"
          name="unit"
          rules={[{ required: true, message: '유닛을 선택하세요.' }]}
          initialValue={1}
        >
          <Radio.Group options={DEVICE_IMAGE_UNIT_OPTIONS} />
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
