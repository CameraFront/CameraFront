import { useEffect, useState } from 'react';
import { App, Cascader, Form, Input, Modal } from 'antd';
import styled from 'styled-components';
import { useLazyGetParentBranchListQuery } from '@/services/api/common';
import { useCreateManagementMutation } from '@/services/api/settings/managements';
import { CascaderOption } from '@/types/api/common';
import { CreateManagementFormValues } from '@/types/api/settings';
import { ROOT_KEY } from '@/config/constants';
import { getSuccessMessage } from '@/config/messages';

interface Props {
  isOpen: boolean;
  onCloseModal: () => void;
}

const NewFormModal = ({ isOpen, onCloseModal }: Props) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<CreateManagementFormValues>();
  const [cascaderOptions, setCascaderOptions] = useState<CascaderOption[]>([]);
  const [getParentBranchList, { isLoading: isLoadingCascader }] =
    useLazyGetParentBranchListQuery();
  const [createManagement, { isLoading: isLoadingCreate }] =
    useCreateManagementMutation();

  const afterClose = () => {
    form.resetFields();
  };
  const onCancel = () => {
    onCloseModal();
    afterClose();
  };

  const loadCascaderOptions = async (selectedValues: (number | null)[]) => {
    const depth = selectedValues.length;
    const managementCdTree = !selectedValues.length
      ? undefined
      : selectedValues[selectedValues.length - 1];
    const data = await getParentBranchList({
      depth,
      managementCdTree: managementCdTree ?? undefined,
    }).unwrap();

    setCascaderOptions(prevOptions => {
      if (!selectedValues.length) return prevOptions;

      const updateNodeChildren = (
        options: CascaderOption[],
      ): CascaderOption[] =>
        options.map(option => {
          if (option.value === managementCdTree) {
            if (data.length === 0) {
              return {
                ...option,
                isLeaf: true,
              };
            }

            return {
              ...option,
              isLeaf: false,
              children: data.map(item => ({
                label: item.managementNm,
                value: item.managementCd,
                depth: item.depth,
                isLeaf: false,
              })),
            };
          }

          if (option.children) {
            return {
              ...option,
              children: updateNodeChildren(option.children),
            };
          }
          return option;
        });

      return updateNodeChildren(prevOptions);
    });
  };

  const onValuesChange = (
    changedValues: Partial<CreateManagementFormValues>,
  ) => {
    if (changedValues.parentNodes) {
      loadCascaderOptions(changedValues.parentNodes);
    }
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    await createManagement(values);
    onCloseModal();
    message.success(getSuccessMessage('create', '소속이'));
  };

  useEffect(() => {
    getParentBranchList({ depth: 1 })
      .unwrap()
      .then(data => {
        setCascaderOptions([
          {
            label: '최상위 소속',
            value: ROOT_KEY,
            depth: 0,
            isLeaf: false,
            children: data.map(management => ({
              label: management.managementNm,
              value: management.managementCd,
              depth: 1,
              isLeaf: false,
            })),
          },
        ]);
      });
  }, [getParentBranchList]);

  useEffect(() => {
    form.setFieldValue('parentNodes', [ROOT_KEY]);
  }, [form]);

  return (
    <Wrapper
      centered
      destroyOnClose
      title="새 소속 추가하기"
      open={isOpen}
      okText="저장"
      cancelText="취소"
      onCancel={onCancel}
      onOk={onSubmit}
      confirmLoading={isLoadingCreate}
      okButtonProps={{ disabled: isLoadingCreate }}
      cancelButtonProps={{ disabled: isLoadingCreate }}
      afterClose={afterClose}
    >
      <Form
        form={form}
        preserve={false}
        labelCol={{ span: 7 }}
        name="new-management-form"
        layout="horizontal"
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="상위 소속"
          name="parentNodes"
          rules={[{ required: true, message: '상위 소속을 선택하세요.' }]}
        >
          <Cascader
            changeOnSelect
            loading={isLoadingCascader}
            options={cascaderOptions}
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
  .ant-modal-body {
    padding-top: 1.6rem;
    overflow-y: auto;
    max-height: 80vh;
    padding-right: 1.6rem;
  }
`;

export default NewFormModal;
