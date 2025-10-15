import { Node, NodeProps, NodeResizer } from 'reactflow';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { useAppSelector } from '@/app/hooks';
import { RackNodeData } from '@/features/rackLayoutPage/types';
import { IMAGE_PATHS } from '@/config';

const RackNode = ({ data, id }: NodeProps<RackNodeData>) => {
  const {
    content: { selectedNode },
  } = useAppSelector(store => store.rackLayout);

  const isSelected = selectedNode ? id === selectedNode.id : false;

  return (
    <Wrapper className={`img-rack ${isSelected ? 'selected' : ''}`}>
      <img src={IMAGE_PATHS.rackLayout.rack} alt="Rack" />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  /* border: 1px solid ${themeGet('colors.primary')}; */
  width: 360px;
  height: 1200px;
  
  img {
    /* display: block; */
    width: 100%;
    height: auto;
  }

  overflow: hidden;
  border-radius: ${themeGet('borderRadius.normal')};
  border: 3px solid transparent;

  &.selected {
    z-index: 1;
    border: 3px solid ${themeGet('colors.nodeSelected')};
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.25);
  }
`;

export default RackNode;
