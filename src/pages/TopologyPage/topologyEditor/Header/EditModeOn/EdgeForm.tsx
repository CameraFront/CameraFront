import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { saveEdges } from '@/features/topologyPage/topologySlice';
import { Form, FormProps, Select } from 'antd';
import { useCallback, useEffect } from 'react';
import { Edge } from 'reactflow';
import { styled } from 'styled-components';

const typeOptions = [
  { value: 'smoothstep', label: '매끄러운 꺽은선' },
  { value: 'step', label: '꺽은선' },
  { value: 'straight', label: '직선' },
  { value: 'default', label: '곡선' },
];

const thicknessOptions = [
  { value: 1, label: '1' },
  { value: 3, label: '3' },
  { value: 5, label: '5' },
];

interface Props {
  selectedEdge: Edge;
}

const NodeForm = ({ selectedEdge }: Props) => {
  const dispatch = useAppDispatch();
  const {
    content: { edgesSaved },
  } = useAppSelector(store => store.topology);
  const [form] = Form.useForm();

  const handleChangeValue = useCallback<
    NonNullable<FormProps['onValuesChange']>
  >(
    async (_changedValues, allValues) => {
      const { edgeType, edgeThickness } = allValues;
      const newEdges = edgesSaved.map(edge => {
        if (edge.id === selectedEdge.id) {
          return {
            ...edge,
            type: edgeType,
            style: {
              ...edge.style,
              strokeWidth: edgeThickness,
            },
          };
        }

        return edge;
      });

      dispatch(saveEdges(newEdges));
    },
    [edgesSaved, selectedEdge],
  );

  // 선택된 엣지의 정보를 폼에 반영
  useEffect(() => {
    const { type, style } = selectedEdge;
    form.setFieldsValue({ edgeType: type, edgeThickness: style?.strokeWidth });
  }, [selectedEdge]);

  return (
    <Wrapper
      form={form}
      autoComplete="off"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 18 }}
      name="form-in-modal"
      layout="inline"
      onValuesChange={handleChangeValue}
    >
      <Form.Item name="edgeType" rules={[{ required: true, message: '' }]}>
        <Select className="select-box type" placeholder="선종류">
          {typeOptions.map(option => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="edgeThickness" rules={[{ required: true, message: '' }]}>
        <Select className="select-box thickness" placeholder="선굵기">
          {thicknessOptions.map(option => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Wrapper>
  );
};

const Wrapper = styled(Form)`
  .select-box {
    &.type {
      width: 14rem;
    }

    &.thickness {
      width: 6rem;
    }
  }
`;

export default NodeForm;
