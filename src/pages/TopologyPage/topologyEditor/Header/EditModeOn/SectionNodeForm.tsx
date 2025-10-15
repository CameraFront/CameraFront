import { useCallback, useEffect } from 'react';
import { Form, FormProps, Input } from 'antd';
import { styled } from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { saveNodes } from '@/features/topologyPage/topologySlice';
import { SectionNode } from '@/features/topologyPage/types';

interface Props {
  selectedNode: SectionNode;
}

const SectionNodeForm = ({ selectedNode }: Props) => {
  const dispatch = useAppDispatch();
  const {
    content: { nodesSaved },
  } = useAppSelector(store => store.topology);
  const [form] = Form.useForm();

  // 선택된 노드 데이터를 폼에 셋팅
  useEffect(() => {
    form.setFieldsValue(selectedNode.data);
  }, [selectedNode, form]);

  const handleChangeValue = useCallback<
    NonNullable<FormProps['onValuesChange']>
  >(
    async (_changedValues, { label }) => {
      const newNodes = nodesSaved.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              label,
            },
          };
        }

        return node;
      });

      dispatch(saveNodes(newNodes));
    },
    [nodesSaved, selectedNode, dispatch],
  );

  return (
    <Wrapper
      form={form}
      // preserve={true}
      autoComplete="off"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 18 }}
      // style={{ maxWidth: 900 }}
      name="form-in-modal"
      layout="inline"
      onValuesChange={handleChangeValue}
    >
      <Form.Item name="label" rules={[{ required: true, message: '' }]}>
        <Input />
      </Form.Item>
    </Wrapper>
  );
};

const Wrapper = styled(Form)`
  .select-box {
    width: 20rem;
  }

  .input-box {
    width: 14rem;
  }
`;

export default SectionNodeForm;
