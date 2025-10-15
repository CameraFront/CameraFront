import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  App,
  Button,
  Form,
  FormItemProps,
  Input,
  Modal,
  Select,
  Upload,
  UploadProps,
} from 'antd';
import styled from 'styled-components';
import { UploadOutlined } from '@ant-design/icons';
import {
  useGetDeviceTypeListQuery,
  useLazyGetDeviceTypesByDepthQuery,
} from '@/services/api/common';
import { useLazyGetRackLayoutDevicesByDeviceTypeQuery } from '@/services/api/rackLayout';
import {
  useCreateDeviceManualMutation,
  useGetDeviceManualQuery,
  useUpdateDeviceManualMutation,
} from '@/services/api/settings/deviceManuals';
import { OptionType } from '@/types/api/common';
import { DevicesManualFormValues, OpenedModalType } from '@/types/api/settings';
import { NO_VALUE } from '@/config/constants';

const defaultDeviceOptions = [
  {
    label: '지정장비 없음',
    value: NO_VALUE,
  },
] as const;

interface Props {
  openedModalType: OpenedModalType;
  id: number | null;
  onCloseModal: () => void;
}

const FormModal = ({ openedModalType, id, onCloseModal }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<DevicesManualFormValues>();
  const { data: deviceManual, isLoading: isLoadingDeviceManual } =
    useGetDeviceManualQuery(id, {
      skip: openedModalType !== 'update',
    });
  const { data: deviceTypes1 } = useGetDeviceTypeListQuery(true);
  const [getDeviceTypes2, { isLoading: isLoadingDeviceTypes2 }] =
    useLazyGetDeviceTypesByDepthQuery();
  const [deviceType2Options, setDeviceType2Options] = useState<OptionType[]>(
    [],
  );
  const [deviceOptions, setDeviceOptions] = useState<OptionType[]>([]);
  const [getDevicesByDeviceType, { data: devicesByDeviceType }] =
    useLazyGetRackLayoutDevicesByDeviceTypeQuery();
  const [createDeviceManual, { isLoading: isCreating }] =
    useCreateDeviceManualMutation();
  const [updateDeviceManual, { isLoading: isUpdating }] =
    useUpdateDeviceManualMutation();

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onValuesChange = (changedValues: DevicesManualFormValues) => {
    if (changedValues.depth1) {
      getDeviceTypes2({
        depth: 2,
        deviceType: changedValues.depth1,
      }).then(res => {
        setDeviceType2Options(
          res.data?.deviceDepthList.map(({ deviceKind, deviceKindNm }) => ({
            label: deviceKindNm,
            value: deviceKind,
          })) ?? [],
        );
      });
      setDeviceOptions([...defaultDeviceOptions]);
      form.setFieldsValue({
        depth2: undefined,
        deviceKey: NO_VALUE,
      });
    }

    if (changedValues.depth2) {
      getDevicesByDeviceType(changedValues.depth2).then(res => {
        setDeviceOptions([
          ...defaultDeviceOptions,
          ...(res.data?.map(({ deviceKey, deviceNm }) => ({
            label: deviceNm,
            value: deviceKey,
          })) ?? []),
        ]);
      });
      form.setFieldsValue({
        deviceKey: NO_VALUE,
      });
    }
  };

  const onSubmit = async () => {
    const formValues = await form.validateFields();

    if (openedModalType === 'update' && id) {
      await updateDeviceManual({
        ...formValues,
        seqNum: id,
      });
    } else {
      await createDeviceManual(formValues);
    }
    onCloseModal();
  };

  const afterCloseModal = () => {
    form.resetFields();
  };

  const beforeUpload = useCallback<NonNullable<UploadProps['beforeUpload']>>(
    file => {
      const isPdf = file.type === 'application/pdf';
      if (!isPdf) {
        message.error('PDF 파일만 선택할 수 있습니다.');
        return Upload.LIST_IGNORE;
      }

      return false;
    },
    [message],
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

  const modalTitle = useMemo(
    () =>
      openedModalType === 'update'
        ? '기존 매뉴얼 수정하기'
        : '새 매뉴얼 추가하기',
    [openedModalType],
  );

  const isLoading = isCreating || isUpdating || isLoadingDeviceManual;

  const deviceType1Options = useMemo(
    () =>
      deviceTypes1?.map(({ seqNum, deviceKindNm }) => ({
        label: deviceKindNm,
        value: seqNum,
      })) ?? [],
    [deviceTypes1],
  );

  useEffect(() => {
    if (openedModalType === 'update' && id && deviceManual) {
      getDevicesByDeviceType(deviceManual.depth2).then(res => {
        setDeviceOptions([
          ...defaultDeviceOptions,
          ...(res.data?.map(({ deviceKey, deviceNm }) => ({
            label: deviceNm,
            value: deviceKey,
          })) ?? []),
        ]);
      });
      form.setFieldsValue({
        depth1: deviceManual.depth1,
        depth2: deviceManual.depth2,
        deviceKey: deviceManual.deviceKey ?? NO_VALUE,
        manualNm: deviceManual.manualNm,
        modelNm: deviceManual.modelNm,
        version: deviceManual.version,
        fileList: [
          {
            uid: '-1',
            name: deviceManual.fileNm,
          },
        ],
      });
    } else {
      setDeviceOptions([...defaultDeviceOptions]);
    }
  }, [openedModalType, id, form, deviceManual, getDevicesByDeviceType]);

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
        name="device-manuals-form-in-modal"
        layout="horizontal"
        onValuesChange={onValuesChange}
        initialValues={{
          deviceKey: NO_VALUE,
        }}
      >
        <Form.Item
          label="상위 장비종류"
          name="depth1"
          rules={[{ required: true, message: '상위 장비종류를 선택하세요.' }]}
        >
          <Select options={deviceType1Options} />
        </Form.Item>
        <Form.Item
          label="하위 장비종류"
          name="depth2"
          rules={[{ required: true, message: '하위 장비종류를 선택하세요.' }]}
        >
          <Select
            loading={isLoadingDeviceTypes2}
            options={deviceType2Options}
          />
        </Form.Item>
        <Form.Item label="장비" name="deviceKey">
          <Select options={deviceOptions} />
        </Form.Item>
        <Form.Item
          label="매뉴얼명"
          name="manualNm"
          rules={[{ required: true, message: '매뉴얼명을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="모델명"
          name="modelNm"
          rules={[{ required: true, message: '모델명을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="버전" name="version">
          <Input />
        </Form.Item>
        <Form.Item
          name="fileList"
          label="장비 매뉴얼"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: '매뉴얼 파일을 선택하세요.' }]}
        >
          <Upload
            listType="text"
            accept=".pdf"
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
