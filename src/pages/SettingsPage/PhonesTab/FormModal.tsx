import { useEffect, useMemo } from 'react';
import { App, Cascader, Form, Input, Modal, Select } from 'antd';
import styled from 'styled-components';
import useManagementOptions from '@/hooks/useManagementOptions';
import { useGetManagementQuery } from '@/services/api/settings/managements';
import {
  useCreatePhoneMutation,
  useGetPhoneQuery,
  useGetPhoneTypeListQuery,
  useUpdatePhoneMutation,
} from '@/services/api/settings/phones';
import { OpenedModalType, PhoneFormValues } from '@/types/api/settings';
import { isQueryResponseError } from '@/types/common';
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
    Omit<PhoneFormValues, 'managementCd'> & { managementCds: number[] }
  >();
  const { data: phone, isLoading: isLoadingPhone } = useGetPhoneQuery(id, {
    skip: openedModalType !== 'update',
  });
  const { data: managementDetails } = useGetManagementQuery(
    phone?.managementCd,
    {
      skip: openedModalType !== 'update' || !phone?.managementCd,
    },
  );
  const parentNodes = useMemo<(number | null)[] | undefined>(() => {
    if (openedModalType === 'create') return [null];
    if (!managementDetails) return undefined;

    return [
      null,
      ...(managementDetails.path.split('/').slice(1, -1).map(Number) ?? []),
    ];
  }, [openedModalType, managementDetails]);
  const {
    options,
    loadOptions,
    isLoading: isLoadingCascader,
    isInitialized,
  } = useManagementOptions({
    hasRoot: false,
    initialValues: parentNodes,
  });
  const { data: phoneTypeList } = useGetPhoneTypeListQuery({
    hasPagination: false,
  });

  const [createPhone, { isLoading: isCreating }] = useCreatePhoneMutation();
  const [updatePhone, { isLoading: isUpdating }] = useUpdatePhoneMutation();

  const phoneTypeOptions = useMemo(
    () =>
      phoneTypeList?.listPhoneType.map(item => ({
        label: item.phoneTypeNm,
        value: item.phoneType,
      })) || [],
    [phoneTypeList],
  );

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onValuesChange = (
    changedValues: Partial<
      Omit<PhoneFormValues, 'managementCd'> & { managementCds: number[] }
    >,
  ) => {
    if (changedValues.managementCds) {
      loadOptions(changedValues.managementCds);
    }
  };

  const onSubmit = async () => {
    const { managementCds, ...rest } = await form.validateFields();

    try {
      if (openedModalType === 'update' && id) {
        await updatePhone({
          ...rest,
          managementCd: managementCds[managementCds.length - 1],
          phoneKey: id,
        }).unwrap();
        message.success(getSuccessMessage('update', '전화기가'));
      } else {
        await createPhone({
          ...rest,
          managementCd: managementCds[managementCds.length - 1],
        }).unwrap();
        message.success(getSuccessMessage('create', '전화기가'));
      }
      onCloseModal();
    } catch (error) {
      if (isQueryResponseError(error)) {
        if (error.data.status === '6013') {
          message.error('해당 내선번호가 이미 존재합니다.');
          return;
        }

        message.error(ERROR_MESSAGES[500]);
      }
    }
  };

  const afterCloseModal = () => {
    form.resetFields();
  };

  const modalTitle = useMemo(
    () =>
      openedModalType === 'update'
        ? '기존 전화기 수정하기'
        : '새 전화기 추가하기',
    [openedModalType],
  );

  const isLoading = isCreating || isUpdating || isLoadingPhone;

  useEffect(() => {
    if (!isInitialized) return;

    if (openedModalType === 'update' && id && phone && managementDetails) {
      const managementCds = managementDetails.path
        .split('/')
        .slice(1)
        .map(Number);
      form.setFieldsValue({
        managementCds,
        phoneNm: phone?.phoneNm,
        phoneType: phone?.phoneType,
        internalNum: phone?.internalNum,
        phoneLocation: phone?.phoneLocation,
        externalNum: phone?.externalNum,
        manageYn: phone?.manageYn,
      });
    }
  }, [
    openedModalType,
    id,
    form,
    phone,
    managementDetails,
    isInitialized,
    parentNodes,
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
        name="phones-form-in-modal"
        layout="horizontal"
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
          label="전화기명"
          name="phoneNm"
          rules={[{ required: true, message: '전화기명을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="전화기 종류"
          name="phoneType"
          rules={[{ required: true, message: '전화기 종류를 선택하세요.' }]}
        >
          <Select options={phoneTypeOptions} />
        </Form.Item>
        <Form.Item
          label="내선번호"
          name="internalNum"
          rules={[{ required: true, message: '내선번호를 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="설치장소" name="phoneLocation">
          <Input />
        </Form.Item>
        <Form.Item label="국선발신번호" name="externalNum">
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
