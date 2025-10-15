import { NodeProps, NodeResizer } from 'reactflow';
import styled, { useTheme } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { useAppSelector } from '@/app/hooks';
import { SectionNodeData } from '@/features/topologyPage/types';

const SectionNode = ({ data, id }: NodeProps<SectionNodeData>) => {
  const {
    content: { selectedNode },
  } = useAppSelector(store => store.topology);
  const theme = useTheme();
  const isSelected = selectedNode ? id === selectedNode.id : false;

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    left: '0',
    top: '0',
    padding: '0 4px',
    backgroundColor: theme.colors.bgTag,
    border: `1px solid ${theme.colors.borderSection}`,
    borderRadius: 4,
    fontSize: 10,
    color: theme.colors.textMain,
  };

  return (
    <Wrapper className={isSelected ? 'selected' : ''}>
      <div className="label" style={labelStyle}>
        {data.label}
      </div>
      <NodeResizer
        isVisible={isSelected}
        minWidth={100}
        minHeight={30}
        color={theme.colors.nodeSelected}
        handleClassName="resizer-handle"
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${themeGet('colors.bgSectionNode')};

  .resizer-handle {
    width: 8px;
    height: 8px;
  }

  height: 100%;

  &.selected {
    box-shadow: ${themeGet('shadows.nodeSelected')};
  }
`;

export default SectionNode;
