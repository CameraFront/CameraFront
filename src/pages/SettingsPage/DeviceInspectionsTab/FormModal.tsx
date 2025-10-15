import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  App,
  Button,
  DatePicker,
  Form,
  FormItemProps,
  Input,
  Modal,
  Select,
  Upload,
  UploadProps,
} from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { UploadOutlined } from '@ant-design/icons';
import { useGetDeviceTypeListQuery } from '@/services/api/common';
import { useLazyGetRackLayoutDevicesByDeviceTypeQuery } from '@/services/api/rackLayout';
import {
  useCreateDeviceInspectionMutation,
  useGetDeviceInspectionQuery,
  useUpdateDeviceInspectionMutation,
} from '@/services/api/settings/deviceInspections';
import { OptionType } from '@/types/api/common';
import {
  DeviceInspectionFormValues,
  OpenedModalType,
} from '@/types/api/settings';

interface Props {
  openedModalType: OpenedModalType;
  id: number | null;
  onCloseModal: () => void;
}

const FormModal = ({ openedModalType, id, onCloseModal }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<
    DeviceInspectionFormValues & { deviceType: number }
  >();
  const { data: deviceInspection, isLoading: isLoadingDeviceInspection } =
    useGetDeviceInspectionQuery(id, {
      skip: openedModalType !== 'update',
    });
  const { data: deviceTypeList, isLoading: isLoadingDeviceTypeList } =
    useGetDeviceTypeListQuery(true);
  const [getDevicesByDeviceType, { isLoading: isLoadingDevicesByDeviceType }] =
    useLazyGetRackLayoutDevicesByDeviceTypeQuery();
  const [createDeviceInspection, { isLoading: isCreating }] =
    useCreateDeviceInspectionMutation();
  const [updateDeviceInspection, { isLoading: isUpdating }] =
    useUpdateDeviceInspectionMutation();
  const [deviceOptions, setDeviceOptions] = useState<OptionType[]>([]);

  const deviceTypeOptions = useMemo(
    () =>
      deviceTypeList?.map(item => ({
        label: item.deviceKindNm,
        value: item.deviceKind,
      })) || [],
    [deviceTypeList],
  );

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onValuesChange = (
    changedValues: Partial<DeviceInspectionFormValues>,
  ) => {
    if (changedValues.deviceType) {
      getDevicesByDeviceType(changedValues.deviceType).then(res => {
        setDeviceOptions(
          res.data?.map(({ deviceKey, deviceNm }) => ({
            label: deviceNm,
            value: deviceKey,
          })) ?? [],
        );
      });
    }
  };

  const onSubmit = async () => {
    const formValues = await form.validateFields();

    if (openedModalType === 'update' && id) {
      await updateDeviceInspection({
        ...formValues,
        seqNum: id,
      });
    } else {
      await createDeviceInspection(formValues);
    }
    onCloseModal();
  };

  const afterCloseModal = () => {
    form.resetFields();
  };

  const modalTitle = useMemo(
    () =>
      openedModalType === 'update'
        ? '기존 점검기록 수정하기'
        : '새 점검기록 추가하기',
    [openedModalType],
  );

  const beforeUploadReportFile = useCallback<
    NonNullable<UploadProps['beforeUpload']>
  >(
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

  const beforeUploadPhotoFile = useCallback<
    NonNullable<UploadProps['beforeUpload']>
  >(
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

  const isLoading = isCreating || isUpdating || isLoadingDeviceInspection;

  useEffect(() => {
    if (openedModalType === 'update' && id && deviceInspection) {
      getDevicesByDeviceType(deviceInspection.deviceKind).then(res => {
        setDeviceOptions(
          res.data?.map(({ deviceKey, deviceNm }) => ({
            label: deviceNm,
            value: deviceKey,
          })) ?? [],
        );
      });
      form.setFieldsValue({
        deviceType: deviceInspection.deviceKind,
        deviceKey: deviceInspection.deviceKey,
        type: deviceInspection.type,
        checkDt: dayjs(deviceInspection.checkUpDt),
        companyNm: deviceInspection.companyNm,
        managerNm: deviceInspection.managerNm ?? '',
        reportFileList: deviceInspection.reportFileNm
          ? [
              {
                uid: '-1',
                name: deviceInspection.reportFileNm,
              },
            ]
          : [],
        photoFileList: deviceInspection.photoFileNm
          ? [
              {
                uid: '-1',
                name: deviceInspection.photoFileNm,
              },
            ]
          : [],
      });
    }
  }, [openedModalType, id, form, deviceInspection, getDevicesByDeviceType]);

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
        name="device-inspections-form-in-modal"
        layout="horizontal"
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="장비종류"
          name="deviceType"
          rules={[{ required: true, message: '장비종류를 선택하세요.' }]}
        >
          <Select
            loading={isLoadingDeviceTypeList}
            options={deviceTypeOptions}
          />
        </Form.Item>
        <Form.Item
          label="대상 장비"
          name="deviceKey"
          rules={[{ required: true, message: '대상 장비를 선택하세요.' }]}
        >
          <Select
            loading={isLoadingDevicesByDeviceType}
            options={deviceOptions}
          />
        </Form.Item>
        <Form.Item
          label="점검종류"
          name="type"
          rules={[{ required: true, message: '점검종류를 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="점검일자"
          name="checkDt"
          rules={[{ required: true, message: '점검일자를 선택하세요.' }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="담당업체"
          name="companyNm"
          rules={[{ required: true, message: '담당업체를 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="담당자" name="managerNm">
          <Input />
        </Form.Item>
        <Form.Item
          label="점검 보고서"
          name="reportFileList"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="text"
            accept=".pdf"
            showUploadList={{ showPreviewIcon: false }}
            maxCount={1}
            beforeUpload={beforeUploadReportFile}
            multiple={false}
          >
            <Button icon={<UploadOutlined />}>업로드</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="점검 사진"
          name="photoFileList"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="text"
            accept=".jpg,.jpeg,.png"
            showUploadList={{ showPreviewIcon: false }}
            maxCount={1}
            beforeUpload={beforeUploadPhotoFile}
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
