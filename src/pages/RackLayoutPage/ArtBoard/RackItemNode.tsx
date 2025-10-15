import { useMemo } from 'react';
import { NodeProps } from 'reactflow';
import { Dropdown, Popover, message } from 'antd';
import type { MenuProps } from 'antd';
import { styled } from 'styled-components';
import { RightOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import CheckResult from '@/pages/TopologyPage/topologyEditor/ArtBoard/CheckResult';
import GlowingCircle from '@/components/GlowingCircle';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  getNodeDeviceDetails,
  getUnhandledEventsByDevice,
} from '@/features/rackLayoutPage/rackLayoutSlice';
import { checkPing, checkSnmp } from '@/features/topologyPage/topologySlice';
import DeviceDetails from './DeviceDetails';
import EventStatusOfNode from './EventStatusOfNode';

const RackItemNode = ({ data, id }: NodeProps) => {
  const dispatch = useAppDispatch();
  const {
    isEditMode,
    content: { selectedNode, nodeDeviceDetails },
  } = useAppSelector(store => store.rackLayout);
  const isSelected = selectedNode ? id === selectedNode.id : false;

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        label: data.deviceName,
        key: 'deviceName',
        type: 'group',
      },
      {
        label: (
          <Popover
            arrow={false}
            placement="rightTop"
            trigger="hover"
            content={<DeviceDetails data={data} id={id} />}
            zIndex={9999}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>장비상세정보</span>
              <RightOutlined color="rgba(0, 0, 0, 0.45)" />
            </div>
          </Popover>
        ),
        key: 'deviceDetails',
      },
      {
        label: (
          <Popover
            // title={data.iconType}
            arrow={false}
            placement="rightTop"
            trigger="hover"
            content={<EventStatusOfNode data={data} id={id} />}
            zIndex={9999}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>장애 현황</span>
              <RightOutlined color="rgba(0, 0, 0, 0.45)" />
            </div>
          </Popover>
        ),
        key: 'eventStatus',
      },
      {
        label: '원격접속',
        key: 'remoteConnect',
        onClick: () => {
          if (!nodeDeviceDetails?.deviceIp)
            return message.error('IP정보가 존재하지 않습니다.');
          window.location.href = `smartstation://${nodeDeviceDetails.deviceIp}`;
          message.loading(
            `puTTY를 실행하여 ${nodeDeviceDetails.deviceIp}로 연결합니다...`,
          );
        },
      },
      {
        label: 'PING 체크',
        key: 'checkPing',
        onClick: async () => {
          const { cmd, ping } = await dispatch(
            checkPing(data.deviceId),
          ).unwrap();
          const config = {
            content: <CheckResult command={cmd} result={ping} />,
            duration: 7,
          };
          message.open(config);
        },
      },
      {
        label: 'SNMP 체크',
        key: 'checkSnmp',
        onClick: async () => {
          const { cmd, snmp } = await dispatch(
            checkSnmp(data.deviceId),
          ).unwrap();
          const config = {
            content: <CheckResult command={cmd} result={snmp} />,
            duration: 7,
          };
          message.open(config);
        },
      },
    ],
    [id, data, dispatch, nodeDeviceDetails?.deviceIp],
  );

  const events = useMemo(() => {
    if (!data.events)
      return {
        urgent: 0,
        important: 0,
        minor: 0,
        total: 0,
      };

    return {
      urgent: data.events.urgent,
      important: data.events.important,
      minor: data.events.minor,
      total: data.events.totalCnt,
    };
  }, [data.events]);

  return (
    <Dropdown
      menu={{ items }}
      trigger={['contextMenu']}
      open={isEditMode ? false : undefined}
      overlayClassName="context-menu"
      onOpenChange={open => {
        if (isEditMode) return;

        if (open) {
          dispatch(getNodeDeviceDetails(id));
          dispatch(getUnhandledEventsByDevice({ page: 1, deviceId: id }));
        }
      }}
    >
      <Wrapper
        className={`${isSelected ? 'selected' : ''} ${events.urgent !== 0 ? 'urgent-node' : ''}`}
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
        <div className="label-row">
          <div className="status-lights">
            {isEditMode ? (
              <>
                <GlowingCircle status="green" flickering={false} />
                <GlowingCircle status="red" flickering={false} />
                <GlowingCircle status="yellow" flickering={false} />
                <GlowingCircle status="gray" flickering={false} />
              </>
            ) : (
              <>
                <GlowingCircle
                  size="large"
                  status={events.total === 0 ? 'green' : 'inactive'}
                  flickering
                />
                <GlowingCircle
                  size="large"
                  status={events.urgent !== 0 ? 'red' : 'inactive'}
                  flickering={events.urgent !== 0}
                />
                <GlowingCircle
                  size="large"
                  status={events.important !== 0 ? 'yellow' : 'inactive'}
                  flickering={events.important !== 0}
                />
                <GlowingCircle
                  size="large"
                  status={events.minor !== 0 ? 'gray' : 'inactive'}
                  flickering={events.minor !== 0}
                />
              </>
            )}
          </div>
          <span className="label">{data.deviceName}</span>
        </div>
      </Wrapper>
    </Dropdown>
  );
};

const Wrapper = styled.div`
  z-index: 999;
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

  &.urgent-node {
    border: 5px solid ${themeGet('colors.urgent')};
    //box-shadow: 0 0 10px 0.5rem red;
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

    height: 28px;
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
      font-size: ${themeGet('fontSizes.s4')};
      color: ${themeGet('colors.palette.gray5')};
      letter-spacing: ${themeGet('letterSpacings.wide')};
      line-height: ${themeGet('lineHeights.none')};
    }
  }
`;

export default RackItemNode;
