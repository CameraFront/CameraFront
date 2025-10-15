import { useDispatch } from 'react-redux';
import { Button, Select } from 'antd';
import { styled } from 'styled-components';
import { useAppSelector } from '@/app/hooks';
import { widgetSelectOptions } from '@/features/dashboardPage/initialState';
import {
  setEditMode,
  setUpdateInterval,
} from '@/features/rackLayoutPage/rackLayoutSlice';

const { options } = widgetSelectOptions.updateInterval;

const MoreDropdown = () => {
  const dispatch = useDispatch();
  const {
    canvasOptions: { updateInterval },
  } = useAppSelector(store => store.rackLayout);

  return (
    <Wrapper>
      <div className="item">
        <div className="label">업데이트주기</div>
        <Select
          style={{ width: '8rem' }}
          value={updateInterval}
          options={options}
          onChange={value => {
            dispatch(setUpdateInterval(value));
          }}
        />
      </div>
      <Button
        className="btn btn-edit-on"
        onClick={() => {
          dispatch(setEditMode(true));
        }}
      >
        랙실장도 편집하기
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* padding: 1rem; */

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.4rem;
  }

  .btn-edit-on {
    margin-top: 4px;
  }
`;

export default MoreDropdown;
