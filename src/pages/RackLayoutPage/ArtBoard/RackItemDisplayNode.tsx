import { NodeProps } from 'reactflow';
import { styled } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import { useAppSelector } from '@/app/hooks';

const RackItemDisplayNode = ({ data, id }: NodeProps) => {
  const {
    content: { selectedNode },
  } = useAppSelector(store => store.rackLayout);
  const isSelected = selectedNode ? id === selectedNode.id : false;

  return (
    <Wrapper
      className={`${isSelected ? 'selected' : ''}`}
      title={data.deviceName}
    >
      <div
        className="device-image-row"
        style={{
          height: 24 * data.unit,
        }}
      >
        <img
          src={`${
            import.meta.env.VITE_APP_API_BASE_URL +
            import.meta.env.VITE_APP_API_PREFIX
          }configuration/getDeviceImageFile.do/${data.deviceImageId}`}
          alt={`${data.deviceName} icon`}
        />
      </div>
      {/* <div className="label-row">
        <div className="status-lights" />
        <span className="label">{data.deviceName}</span>
      </div> */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;

  width: 280px;
  overflow: hidden;
  border-radius: ${themeGet('borderRadius.normal')};
  border: 3px solid transparent;

  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.5);
    z-index: 1000;
  }
    
  &.selected {
    border: 3px solid ${themeGet('colors.nodeSelected')};
    box-shadow: ${themeGet('shadows.nodeSelected')};
  }

  .device-image-row {
    height: 24px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .label-row {
    display: flex;
    align-items: center;
    gap: 12px;

    height: 24px;
    padding: 0 8px;
    background: repeating-linear-gradient(0.25turn, #101010, #101010f2 2px);

    .status-lights {
      flex: 0 0 35px;
      display: flex;
      gap: 4px;
    }

    .label {
      flex: 1;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: ${themeGet('fontSizes.s1')};
      color: ${themeGet('colors.palette.gray5')};
      letter-spacing: ${themeGet('letterSpacings.wide')};
      line-height: ${themeGet('lineHeights.none')};
    }
  }
`;

export default RackItemDisplayNode;
