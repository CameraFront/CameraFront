import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, FormProps, Select, Space } from 'antd';
import { styled } from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { saveNodes } from '@/features/topologyPage/topologySlice';
import { NetworkNode } from '@/features/topologyPage/types';
import { useGetDeviceTypeDepthListQuery } from '@/services/api/common';
import { useLazyGetDevicesByTypeQuery } from '@/services/api/topology';
import { OptionType } from '@/types/api/common';

interface Props {
  selectedNode: NetworkNode;
}

const NetworkNodeForm = ({ selectedNode }: Props) => {
  const dispatch = useAppDispatch();
  const {
    content: { nodesSaved },
  } = useAppSelector(store => store.topology);
  const { data: deviceTypeList } = useGetDeviceTypeDepthListQuery();
  const [
    getDevicesByType,
    { data: devicesByType, isLoading: deviceOptionsLoading },
  ] = useLazyGetDevicesByTypeQuery();
  const [form] = Form.useForm();
  const [depth1Options, setDepth1Options] = useState<OptionType[]>([]);
  const [depth2Options, setDepth2Options] = useState<OptionType[]>([]);
  const [deviceOptionsPending, setDeviceOptionsPending] = useState(false);

  // 새 노드를 선택할 때마다 해당 노드의 장비로 기본값 업데이트
  useEffect(() => {
    if (!selectedNode) return;

    form.setFieldsValue({
      depth1Cd: selectedNode?.data.depth1Cd,
      depth2Cd: selectedNode?.data.depth2Cd,
      deviceId: selectedNode.data.deviceId,
    });
  }, [form, selectedNode]);

  // 새 노드를 선택할 때마다 장비옵션 업데이트
  useEffect(() => {
    if (!deviceTypeList) return;

    const depth1Map = deviceTypeList?.reduce(
      (acc, item) => {
        if (!acc[item.depth1Cd]) {
          acc[item.depth1Cd] = [];
        }
        acc[item.depth1Cd].push(item);
        return acc;
      },
      {} as Record<number, typeof deviceTypeList>,
    );

    const newDepth1Options = Object.entries(depth1Map).map(
      ([depth1Cd, items]) => ({
        label: items[0].depth1Nm,
        value: parseInt(depth1Cd),
      }),
    );

    setDepth1Options(newDepth1Options);
    setDepth2Options(
      deviceTypeList
        .filter(item => item.depth1Cd === selectedNode.data.depth1Cd)
        .map(item => ({
          label: item.depth2Nm,
          value: item.depth2Cd,
        })),
    );
    getDevicesByType(selectedNode.data.depth2Cd);
  }, [deviceTypeList, selectedNode, getDevicesByType]);

  // 장비목록이 변경될 때마다 장비옵션 업데이트
  const deviceOptions = useMemo(() => {
    if (!devicesByType || deviceOptionsPending) return [];
    return devicesByType?.map(item => ({
      label: item.deviceNm,
      value: item.deviceKey,
    }));
  }, [devicesByType, deviceOptionsPending]);

  const handleChangeValue = useCallback<
    NonNullable<FormProps['onValuesChange']>
  >(
    async (changedValues, values) => {
      if (!deviceTypeList) return;

      if ('depth1Cd' in changedValues) {
        form.setFieldValue('depth2Cd', null);
        form.setFieldValue('deviceId', null);
        setDepth2Options(
          deviceTypeList
            .filter(item => item.depth1Cd === changedValues.depth1Cd)
            .map(item => ({
              label: item.depth2Nm,
              value: item.depth2Cd,
            })),
        );
        setDeviceOptionsPending(true);
      }

      if ('depth2Cd' in changedValues) {
        getDevicesByType(changedValues.depth2Cd);
        setDeviceOptionsPending(false);
        form.setFieldValue('deviceId', null);
      }

      if ('deviceId' in changedValues) {
        const selectedDepth1 = depth1Options.find(
          item => item.value === values.depth1Cd,
        );

        const selectedDepth2 = depth2Options.find(
          item => item.value === values.depth2Cd,
        );

        const selectedDevice = deviceOptions.find(
          item => item.value === values.deviceId,
        );

        const newNode = nodesSaved.map(node => {
          if (node.data.deviceId === selectedNode.data.deviceId) {
            return {
              ...node,
              data: {
                ...node.data,
                depth1Cd: selectedDepth1?.value,
                depth1Nm: selectedDepth1?.label,
                depth2Cd: selectedDepth2?.value,
                depth2Nm: selectedDepth2?.label,
                deviceId: selectedDevice?.value,
                deviceName: selectedDevice?.label,
              },
            };
          }
          return node;
        });

        dispatch(saveNodes(newNode));
      }
    },
    [
      deviceTypeList,
      form,
      getDevicesByType,
      dispatch,
      nodesSaved,
      depth1Options,
      depth2Options,
      deviceOptions,
      selectedNode,
    ],
  );

  return (
    <Wrapper
      form={form}
      autoComplete="off"
      name="network-node-form"
      layout="inline"
      onValuesChange={handleChangeValue}
    >
      <Space>
        <Form.Item name="depth1Cd" rules={[{ required: true, message: '' }]}>
          <Select
            placeholder="상위장비종류 선택"
            className="select-box"
            options={depth1Options}
          />
        </Form.Item>
        <Form.Item name="depth2Cd" rules={[{ required: true, message: '' }]}>
          <Select
            placeholder="하위장비종류 선택"
            className="select-box"
            options={depth2Options}
          />
        </Form.Item>
        <Form.Item name="deviceId" rules={[{ required: true, message: '' }]}>
          <Select
            disabled={deviceOptionsPending}
            loading={deviceOptionsLoading}
            placeholder="장비 선택"
            className="select-box"
            options={deviceOptions}
          />
        </Form.Item>
      </Space>
    </Wrapper>
  );
};

const Wrapper = styled(Form)`
  .select-box {
    width: 18rem;
  }
`;

export default NetworkNodeForm;
