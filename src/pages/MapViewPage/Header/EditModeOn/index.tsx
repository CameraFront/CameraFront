import { useCallback, useState } from 'react';
import { useOnSelectionChange } from 'reactflow';
import { Button, Popconfirm } from 'antd';
import { styled } from 'styled-components';
import { WarningOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setEditMode,
  setSelectedNode,
  setSelectedNodes,
} from '@/features/railwayMapPage/railwayMapSlice';
import { useUpdateMapViewMapMutation } from '@/services/api/mapView';
import { light } from '@/css/theme';
import AddNewNodeModal from './AddNodeModal';
import KeyTooltip from './KeyTooltip';

const EditModeOn = () => {
  const dispatch = useAppDispatch();
  const {
    isEditMode,
    content: { selectedNode, nodesSaved },
  } = useAppSelector(store => store.railwayMap);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [updateMapViewMap] = useUpdateMapViewMapMutation();

  // 선택된 노드를 변경할 때마다 store에 저장
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      if (nodes.length === 1) {
        if (!isEditMode) return;
        dispatch(setSelectedNode(nodes[0]));
        return;
      }

      if (!nodes.length) {
        dispatch(setSelectedNode(null));
      }

      dispatch(setSelectedNodes(nodes));
    },
  });

  const handleCancel = useCallback(async () => {
    // await getMapViewContent();
    dispatch(setSelectedNode(null));
    dispatch(setEditMode(false));
  }, [dispatch]);

  const handleSave = useCallback(async () => {
    await updateMapViewMap({ dataNode: nodesSaved });
    handleCancel();
  }, [handleCancel, updateMapViewMap, nodesSaved]);

  return (
    <Wrapper>
      <AddNewNodeModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="left-wrapper" />
      <div className="middle-wrapper">
        {selectedNode ? null : (
          <Button
            type="primary"
            className="btn__add-node"
            onClick={() => setIsModalOpen(true)}
          >
            소속 추가
          </Button>
        )}
      </div>
      <div className="right-wrapper">
        <KeyTooltip />
        <Popconfirm
          title="변경사항 되돌리기"
          description="변경사항을 저장하지 않고 보기 화면으로 돌아갑니다."
          onConfirm={handleCancel}
          okText="되돌리기"
          cancelText="편집 계속하기"
          icon={<WarningOutlined style={{ color: light.colors.textDanger }} />}
        >
          <Button>취소</Button>
        </Popconfirm>
        <Button type="primary" onClick={handleSave}>
          저장
        </Button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 30% 40% 30%;
  align-items: center;

  width: 100%;
  max-height: 5rem;
  padding: 1rem;
  height: 100%;
  /* margin-bottom: 1rem; */

  .left-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;

    .modify-name {
      color: ${themeGet('colors.textSub')};

      &:hover {
        color: ${themeGet('colors.textMain')};
        cursor: pointer;
      }
    }

    .input-edit-title {
      max-width: 16rem;
      padding: 0 4px;
      font-size: ${themeGet('fontSizes.s3')};
    }
  }

  .middle-wrapper {
    justify-self: center;
    display: flex;
    align-items: center;
    gap: 1rem;

    .ant-form-inline .ant-form-item:not(:nth-last-child(2)) {
      margin-inline-end: 0;
    }
  }

  .right-wrapper {
    justify-self: flex-end;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

export default EditModeOn;
