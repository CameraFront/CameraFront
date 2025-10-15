import { useCallback, useEffect, useMemo, useState } from 'react';
import { App, Form, Input, Modal, Select } from 'antd';
import styled from 'styled-components';
import { useGetDeviceTypeListQuery } from '@/services/api/common';
import {
  useCreateProcessMutation,
  useGetProcessQuery,
  useLazyGetSshDeviceListQuery,
  useUpdateProcessMutation,
} from '@/services/api/settings/processes';
import { OpenedModalType, ProcessFormValues } from '@/types/api/settings';
import { ResBoolean } from '@/types/enum';
import { ERROR_MESSAGES, getSuccessMessage } from '@/config/messages';
import { MANAGE_YN_OPTIONS } from '@/config/options';

interface Props {
  openedModalType: OpenedModalType;
  id: number | null;
  onCloseModal: () => void;
}

const FormModal = ({ openedModalType, id, onCloseModal }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<
    ProcessFormValues | (ProcessFormValues & { manageYn: ResBoolean })
  >();
  const { data: process, isLoading: isLoadingProcess } = useGetProcessQuery(
    id,
    {
      skip: openedModalType !== 'update',
    },
  );

  const { data: deviceTypeList, isLoading: isLoadingDeviceTypeList } =
    useGetDeviceTypeListQuery(true);
  const [getSshDeviceList, { isLoading: isLoadingSshDeviceList }] =
    useLazyGetSshDeviceListQuery();
  const [createProcess, { isLoading: isCreating }] = useCreateProcessMutation();
  const [updateProcess, { isLoading: isUpdating }] = useUpdateProcessMutation();
  const [deviceOptions, setDevicesOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const deviceTypeOptions = useMemo(
    () =>
      deviceTypeList?.map(item => ({
        label: item.deviceKindNm,
        value: item.deviceKind,
      })) || [],
    [deviceTypeList],
  );

  const updateDeviceOptions = useCallback(
    async (deviceKind: number) => {
      const res = await getSshDeviceList(deviceKind).unwrap();
      setDevicesOptions(
        res.sshDeviceList.map(item => ({
          label: item.deviceNm,
          value: item.deviceKey,
        })) || [],
      );
    },
    [getSshDeviceList],
  );

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onSubmit = async () => {
    const formValues = await form.validateFields();

    try {
      if (openedModalType === 'update' && id) {
        await updateProcess({
          ...(formValues as ProcessFormValues & { manageYn: ResBoolean }),
          seqNum: id,
        }).unwrap();
        message.success(getSuccessMessage('update', '프로세스가'));
      } else {
        await createProcess({
          ...formValues,
        }).unwrap();
        message.success(getSuccessMessage('create', '프로세스가'));
      }
      onCloseModal();
    } catch (error) {
      message.error(ERROR_MESSAGES[500]);
    }
  };

  const onValuesChange = async (changedValues: Partial<ProcessFormValues>) => {
    if (changedValues.deviceKind) {
      updateDeviceOptions(changedValues.deviceKind);
    }
  };

  const afterCloseModal = () => {
    form.resetFields();
  };

  const modalTitle = useMemo(
    () =>
      openedModalType === 'update'
        ? '기존 프로세스 수정하기'
        : '새 프로세스 추가하기',
    [openedModalType],
  );

  const isLoading = isCreating || isUpdating || isLoadingProcess;

  useEffect(() => {
    if (openedModalType === 'update' && id && process) {
      updateDeviceOptions(process.deviceKind);
      form.setFieldsValue({
        ...process,
        manageYn: process.manageYn,
      });
    }
  }, [openedModalType, id, process, form, updateDeviceOptions]);

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
        name="processes-form-in-modal"
        layout="horizontal"
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="장비종류"
          name="deviceKind"
          rules={[{ required: true, message: '장비종류를 선택하세요.' }]}
        >
          <Select
            loading={isLoadingDeviceTypeList}
            options={deviceTypeOptions}
          />
        </Form.Item>
        <Form.Item
          label="장비"
          name="deviceKey"
          rules={[{ required: true, message: '장비를 선택하세요.' }]}
        >
          <Select loading={isLoadingSshDeviceList} options={deviceOptions} />
        </Form.Item>
        <Form.Item
          label="프로세스명"
          name="procNm"
          rules={[{ required: true, message: '프로세스명을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="프로세스 경로"
          name="procPath"
          rules={[{ required: true, message: '프로세스 경로를 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="파라미터" name="procParam">
          <Input />
        </Form.Item>
        {openedModalType === 'update' && (
          <Form.Item
            label="관리여부"
            name="manageYn"
            rules={[{ required: true, message: '관리여부을 선택하세요.' }]}
          >
            <Select options={MANAGE_YN_OPTIONS} />
          </Form.Item>
        )}
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
