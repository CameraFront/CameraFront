import { useEffect, useMemo } from 'react';
import { App, Form, Input, Modal, Select } from 'antd';
import styled from 'styled-components';
import { useGetParentBranchListQuery } from '@/services/api/common';
import { useUpdateManagementMutation } from '@/services/api/settings/managements';
import {
  ResManagement,
  UpdateManagementFormValues,
} from '@/types/api/settings';
import { getSuccessMessage } from '@/config/messages';

interface Props {
  isOpen: boolean;
  selectedRow: ResManagement;
  onCloseModal: () => void;
}

const EditFormModal = ({ isOpen, selectedRow, onCloseModal }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<UpdateManagementFormValues>();
  const { data: parentBranchList, isLoading: isLoadingSelect } =
    useGetParentBranchListQuery({
      depth: selectedRow.depth - 1,
      // managementCdTree: selectedRow.parentNode ?? undefined,
    });
  const [updateManagement, { isLoading: isLoadingUpdate }] =
    useUpdateManagementMutation();

  const afterClose = () => {
    form.resetFields();
  };

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();

    await updateManagement({
      ...values,
      parentNode: !values.parentNode ? null : values.parentNode,
    });
    message.success(getSuccessMessage('update', '소속이'));
    onCloseModal();
  };

  useEffect(() => {
    if (!selectedRow || !parentBranchList) return;

    form.setFieldsValue({
      parentNode:
        !selectedRow.parentNode || selectedRow.depth === 1
          ? 0
          : selectedRow.parentNode,
      managementCd: selectedRow.managementCd,
      managementId: selectedRow.managementId,
      managementNm: selectedRow.managementNm,
    });
  }, [form, selectedRow, parentBranchList]);

  const selectOptions = useMemo(() => {
    if (selectedRow.depth === 1 || !parentBranchList)
      return [{ label: '없음', value: 0 }];

    return parentBranchList.map(item => ({
      label: item.managementNm,
      value: item.managementCd,
    }));
  }, [parentBranchList, selectedRow.depth]);

  return (
    <Wrapper
      centered
      destroyOnClose
      title="기존 소속 수정하기"
      open={isOpen}
      okText="저장"
      cancelText="취소"
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={isLoadingUpdate}
      okButtonProps={{ disabled: isLoadingUpdate }}
      cancelButtonProps={{ disabled: isLoadingUpdate }}
      afterClose={afterClose}
    >
      <Form
        form={form}
        preserve={false}
        labelCol={{ span: 7 }}
        name="edit-management-form"
        layout="horizontal"
      >
        <Form.Item label="소속 코드" name="managementCd" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="상위 지역"
          name="parentNode"
          rules={[{ required: true, message: '상위 소속을 선택하세요.' }]}
        >
          <Select
            disabled={selectedRow.depth === 1}
            loading={isLoadingSelect}
            options={selectOptions}
          />
        </Form.Item>
        <Form.Item
          label="소속 아이디"
          name="managementId"
          rules={[{ required: true, message: '소속 아이디를 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="소속명"
          name="managementNm"
          rules={[{ required: true, message: '소속명을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Modal)`
  &.ant-modal .ant-modal-body {
    padding-top: 1.6rem;
    overflow-y: auto;
    max-height: 80vh;
    padding-right: 1.6rem;
  }
`;

export default EditFormModal;
