import { NodeProps } from 'reactflow';
import { Badge, Popover } from 'antd';
import styled, { useTheme } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { useAppSelector } from '@/app/hooks';
import { SpotItemNodeData } from '@/types/api/mapView';
import officeActive from '@/assets/images/office-active.png';
import office from '@/assets/images/office.png';
import EventTable from './EventTable';

const SpotItemNode = ({ data, id }: NodeProps<SpotItemNodeData>) => {
  const {
    isEditMode,
    content: { selectedNode },
  } = useAppSelector(store => store.railwayMap);

  const theme = useTheme();
  const isSelected = selectedNode ? id === selectedNode.id : false;
  const hasUrgent = !!data.urgent;
  const hasImportant = !!data.important;
  const color = hasUrgent
    ? theme.colors.urgent
    : hasImportant
      ? theme.colors.important
      : theme.colors.green;
      
  return (
    <Wrapper
      className={`${isSelected ? 'selected' : ''}`}
      content={<EventTable data={data} />}
      placement="right"
      trigger={isEditMode ? [] : ['hover']}
      overlayClassName='map-custom-popover'
      arrow
    >
      { data.urgent > 0 ? (
        <img
          src={officeActive}
          width={28}
          height={28}
          alt={data.managementNm}
          className="blinking-image"
        />
      ) : (
        <img src={office} width={22} height={22} alt={data.managementNm} />
      )}
      <div className="label">{data.managementNm}</div>
    </Wrapper>
  );
};

const Wrapper = styled(Popover)`
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  /* width: 12px;
  height: 12px; */

  /* &.selected {
    outline: 3px solid ${themeGet('colors.nodeSelected')};
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.25);
  } */

  .label {
    position: absolute;
    bottom: -1.5em;
    color: ${themeGet('colors.textMapPopover')};
    font-size: ${themeGet('fontSizes.s1')};
    font-weight: ${themeGet('fontWeights.bold')};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // text-shadow:
    //   -1px -1px 0 ${themeGet('colors.textInv')},
    //   1px -1px 0 ${themeGet('colors.textInv')},
    //   -1px 1px 0 ${themeGet('colors.textInv')},
    //   1px 1px 0 ${themeGet('colors.textInv')};
  }

  & .ant-badge.ant-badge-status .ant-badge-status-dot {
    width: 14px;
    height: 14px;
    padding: 0;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  .blinking-image {
    animation: blink 3s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

export default SpotItemNode;
