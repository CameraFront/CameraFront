import { Dispatch, SetStateAction, useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import { Form, Modal, Select, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  saveNodes,
  setSelectedNode,
} from '@/features/railwayMapPage/railwayMapSlice';
import { resetState } from '@/features/settingsPage/settingsSlice';
import { useGetParentBranchListQuery } from '@/services/api/common';
import { MapViewNode } from '@/types/api/mapView';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

type FieldType = {
  managementCd: number;
};

const AddNewNodeModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const dispatch = useAppDispatch();
  const {
    content: { nodesSaved },
  } = useAppSelector(store => store.railwayMap);
  const { data: branchList } = useGetParentBranchListQuery();

  const rfInstance = useReactFlow<MapViewNode>();
  const [form] = Form.useForm();

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    dispatch(resetState());
    form.resetFields();
  }, [dispatch, form, setIsModalOpen]);

  const handleSubmit = useCallback(async () => {
    if (!branchList) return;
    const { managementCd } = (await form.validateFields()) as FieldType;

    const selectedBranch = branchList.find(
      s => s.managementCd === managementCd,
    );

    if (!selectedBranch) {
      return message.warning('해당 소속을 찾을 수 없습니다.');
    }

    const newNode = {
      id: managementCd.toString(),
      type: 'spotItem',
      position: { x: 0, y: Math.random() * 100 },
      data: {
        managementCd,
        managementNm: selectedBranch.managementNm,
        path: '',
        urgent: 0,
        important: 0,
        minor: 0,
        total: 0,
      },
    };

    dispatch(saveNodes([...nodesSaved, newNode]));
    dispatch(setSelectedNode(newNode));

    handleCancel();
  }, [dispatch, form, nodesSaved, handleCancel, branchList]);

  const stationOptions =
    branchList?.map(branch => ({
      label: branch.managementNm,
      value: branch.managementCd,
      disabled: !!rfInstance.getNode(branch.managementCd.toString()),
    })) || [];

  return (
    <Modal
      width={500}
      centered
      title="새 소속 추가"
      open={isModalOpen}
      destroyOnClose
      styles={{ body: { padding: '2rem 1rem .6rem' } }}
      okText="저장"
      cancelText="취소"
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form<FieldType>
        form={form}
        autoComplete="off"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        name="add-map-view-modal"
        layout="horizontal"
      >
        <Form.Item
          label="소속"
          name="managementCd"
          rules={[{ required: true, message: '소속을 선택하세요.' }]}
        >
          <Select options={stationOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewNodeModal;
