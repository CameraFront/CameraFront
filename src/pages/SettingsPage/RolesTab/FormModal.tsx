import { useEffect, useMemo } from 'react';
import { App, Form, Input, Modal, Select } from 'antd';
import styled from 'styled-components';
import { useGetParentBranchListQuery } from '@/services/api/common';
import {
  useCreateRoleMutation,
  useGetRoleGroupListQuery,
  useGetRoleQuery,
  useUpdateRoleMutation,
} from '@/services/api/settings/roles';
import { OpenedModalType, RoleFormValues } from '@/types/api/settings';
import { ALL_SELECTED_VALUE } from '@/config/constants';
import { getSuccessMessage } from '@/config/messages';

interface Props {
  openedModalType: OpenedModalType;
  id: number | null;
  onCloseModal: () => void;
}

const FormModal = ({ openedModalType, id, onCloseModal }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<RoleFormValues>();
  const { data: role, isLoading: isLoadingRole } = useGetRoleQuery(id, {
    skip: openedModalType !== 'update',
  });
  const { data: roleGroupList, isLoading: isLoadingRoleGroupList } =
    useGetRoleGroupListQuery();
  const { data: managementList, isLoading: isLoadingManagementList } =
    useGetParentBranchListQuery({ depth: 1 });
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (openedModalType === 'update' && id) {
      await updateRole({
        ...values,
        managementCd:
          values.managementCd === ALL_SELECTED_VALUE
            ? null
            : values.managementCd,
        roleId: id,
      });
      message.success(getSuccessMessage('update', '권한이'));
    } else {
      await createRole({
        ...values,
        managementCd:
          values.managementCd === ALL_SELECTED_VALUE
            ? null
            : values.managementCd,
      });
      message.success(getSuccessMessage('create', '권한이'));
    }

    onCloseModal();
  };

  const afterCloseModal = () => {
    form.resetFields();
  };

  const roleGroupOptions = useMemo(() => {
    if (!roleGroupList) return [];
    return roleGroupList?.groupRoleList.map(item => ({
      label: item.roleGroupKrNm,
      value: item.roleGroupId,
    }));
  }, [roleGroupList]);

  const managementOptions = useMemo(() => {
    if (!managementList) return [];
    return [
      {
        label: '전체',
        value: ALL_SELECTED_VALUE,
      },
      ...managementList.map(item => ({
        label: item.managementNm,
        value: item.managementCd,
      })),
    ];
  }, [managementList]);

  const modalTitle = useMemo(
    () =>
      openedModalType === 'update' ? '기존 권한 수정하기' : '새 권한 추가하기',
    [openedModalType],
  );

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (openedModalType === 'update' && id && role) {
      form.setFieldsValue({
        roleNm: role?.roleNm,
        roleGroupId: role?.roleGroupId,
        managementCd: role?.managementCd ?? ALL_SELECTED_VALUE,
      });
    }
  }, [openedModalType, id, form, role]);

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
        name="roles-form-in-modal"
        layout="horizontal"
      >
        <Form.Item
          label="권한명"
          name="roleNm"
          rules={[{ required: true, message: '권한명을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="권한그룹"
          name="roleGroupId"
          rules={[{ required: true, message: '권한그룹을 선택하세요.' }]}
        >
          <Select loading={isLoadingRoleGroupList} options={roleGroupOptions} />
        </Form.Item>
        <Form.Item
          label="관리권한지역"
          name="managementCd"
          rules={[{ required: true, message: '관리권한지역을 선택하세요.' }]}
        >
          <Select
            loading={isLoadingManagementList}
            options={managementOptions}
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
