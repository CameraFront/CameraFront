import { useEffect, useMemo } from 'react';
import { App, Form, Input, Modal, Select } from 'antd';
import styled from 'styled-components';
import { useGetRoleListQuery } from '@/services/api/settings/roles';
import {
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useValidateUserIdMutation,
} from '@/services/api/settings/users';
import { OpenedModalType, UserFormValues } from '@/types/api/settings';
import { getSuccessMessage } from '@/config/messages';

interface Props {
  openedModalType: OpenedModalType;
  id: string | null;
  onCloseModal: () => void;
}

const FormModal = ({ openedModalType, id, onCloseModal }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<UserFormValues & { passwdConfirm: string }>();
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery(id, {
    skip: openedModalType !== 'update',
  });
  const { data: roles, isLoading: isLoadingRoles } = useGetRoleListQuery();
  const [validateUserId, { isLoading: isLoadingValidateUserId }] =
    useValidateUserIdMutation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const onCancel = () => {
    onCloseModal();
    form.resetFields();
  };

  const onSubmit = async () => {
    const { passwdConfirm, ...values } = await form.validateFields();
    if (openedModalType === 'update' && id) {
      await updateUser(values);
      message.success(getSuccessMessage('update', '사용자가'));
    } else {
      await createUser(values);
      message.success(getSuccessMessage('create', '사용자가'));
    }

    onCloseModal();
  };

  const afterCloseModal = () => {
    form.resetFields();
  };

  const modalTitle = useMemo(
    () =>
      openedModalType === 'update'
        ? '기존 사용자 수정하기'
        : '새 사용자 추가하기',
    [openedModalType],
  );

  const roleOptions = useMemo(
    () =>
      roles?.map(role => ({
        label: role.roleNm,
        value: role.roleId,
      })) || [],
    [roles],
  );

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (openedModalType === 'update' && id && user) {
      form.setFieldsValue({
        userId: user.userId,
        userNm: user.userNm,
        passwd: undefined,
        roleId: user.roleId,
      });
    }
  }, [openedModalType, id, form, user]);

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
        name="users-form-in-modal"
        layout="horizontal"
      >
        <Form.Item
          label="아이디"
          name="userId"
          validateTrigger="onBlur"
          rules={[
            { required: true, message: '아이디를 입력하세요.' },
            {
              validator: async (_, value) => {
                if (!value || openedModalType === 'update')
                  return Promise.resolve();

                const data = await validateUserId(value).unwrap();
                if (!data)
                  return Promise.reject(
                    new Error('이미 사용 중인 아이디입니다.'),
                  );

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input disabled={openedModalType === 'update'} />
        </Form.Item>
        <Form.Item
          label="사용자명"
          name="userNm"
          rules={[{ required: true, message: '사용자명을 입력하세요.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="비밀번호"
          name="passwd"
          rules={[
            openedModalType === 'update'
              ? { required: false }
              : { required: true, message: '비밀번호를 입력하세요.' },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="비밀번호 확인"
          name="passwdConfirm"
          dependencies={['passwd']}
          rules={[
            openedModalType === 'update'
              ? { required: false }
              : {
                  required: true,
                  message: '비밀번호를 입력하세요.',
                },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (openedModalType === 'update' && !value)
                  return Promise.resolve();
                if (getFieldValue('passwd') === value) return Promise.resolve();
                return Promise.reject(
                  new Error('비밀번호가 일치하지 않습니다.'),
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="권한"
          name="roleId"
          rules={[{ required: true, message: '권한을 선택하세요.' }]}
        >
          <Select loading={isLoadingRoles} options={roleOptions} />
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
