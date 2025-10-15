import { useDispatch } from 'react-redux';
import { useReactFlow } from 'reactflow';
import { Button, Popover, Select, Switch } from 'antd';
import { styled } from 'styled-components';
import { useAppSelector } from '@/app/hooks';
import { widgetSelectOptions } from '@/features/dashboardPage/initialState';
import {
  setEditMode,
  setGrid,
  setMiniMap,
  setStream,
  setUpdateInterval,
} from '@/features/topologyPage/topologySlice';

const { options } = widgetSelectOptions.updateInterval;

const MoreDropdown = () => {
  const dispatch = useDispatch();
  const {
    canvasOptions: { hasGrid, hasMiniMap, hasStream, updateInterval },
  } = useAppSelector(store => store.topology);

  const { isDarkMode } = useAppSelector(store => store.global);
  const { getEdges, setEdges } = useReactFlow();

  return (
    <Wrapper>
      <div className="item">
        <div className="label">업데이트주기</div>
        <Select
          style={{ width: '8rem' }}
          options={options}
          value={updateInterval}
          onChange={value => {
            dispatch(setUpdateInterval(value));
          }}
        />
      </div>
      <div className="item">
        <div className="label">그리드</div>
        <Switch
          // disabled={!isSuccess}
          checked={hasGrid}
          onChange={checked => dispatch(setGrid(checked))}
          style={{
            backgroundColor: hasGrid
              ? isDarkMode
                ? '#568EC9'
                : '#121C72'
              : isDarkMode
                ? '#B7B7B7'
                : '#878787',
          }}
        />
      </div>
      <div className="item">
        <div className="label">미니맵</div>
        <Switch
          checked={hasMiniMap}
          onChange={checked => dispatch(setMiniMap(checked))}
          style={{
            backgroundColor: hasMiniMap
              ? isDarkMode
                ? '#568EC9'
                : '#121C72'
              : isDarkMode
                ? '#B7B7B7'
                : '#878787',
          }}
        />
      </div>
      <div className="item">
        <div className="label">스트림</div>
        <Switch
          checked={hasStream}
          onChange={checked => dispatch(setStream(checked))}
          style={{
            backgroundColor: hasStream
              ? isDarkMode
                ? '#568EC9'
                : '#121C72'
              : isDarkMode
                ? '#B7B7B7'
                : '#878787',
          }}
        />
      </div>
      <Button
        className="btn btn-edit-on"
        onClick={() => {
          setEdges(getEdges().map(edge => ({ ...edge, animated: false })));
          dispatch(setEditMode(true));
        }}
      >
        토폴로지 편집하기
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled(Popover)`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;

  /* padding: 1rem; */

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3rem;
  }

  .btn-edit-on {
    margin-top: 4px;
  }
`;

export default MoreDropdown;
