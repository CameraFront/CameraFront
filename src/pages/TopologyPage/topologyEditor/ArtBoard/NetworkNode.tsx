import { useMemo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { App, Badge, Dropdown, Popover } from 'antd';
import type { MenuProps } from 'antd';
import styled, { useTheme } from 'styled-components';
import { RightOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getPortsBySwitch } from '@/features/configPerfPage/configPerfSlice';
import {
  checkPing,
  checkSnmp,
  getNodeDeviceDetails,
  getUnhandledEventsByDevice,
  resetDeviceDetails,
} from '@/features/topologyPage/topologySlice';
import { NetworkNodeDataWithEvent } from '@/types/api/topology';
import { ResManageYn } from '@/types/enum';
import { IMAGE_PATHS } from '@/config';
import CheckResult from './CheckResult';
import DeviceDetails from './DeviceDetails';
import EventStatusOfNode from './EventStatusOfNode';
import PortList from './PortList';

const NetworkNode = ({ data, id }: NodeProps<NetworkNodeDataWithEvent>) => {
  const dispatch = useAppDispatch();
  const {
    isEditMode,
    content: { selectedNode, nodeDeviceDetails },
  } = useAppSelector(store => store.topology);
  const theme = useTheme();
  const { message } = App.useApp();

  const isSelected = selectedNode ? id === selectedNode.id : false;
  const isSwitch =
    data.depth2Nm === 'L2' || data.depth2Nm === 'L3' || data.depth2Nm === 'L4';

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
            overlayClassName='custom-popover'
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
              <RightOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
            </div>
          </Popover>
        ),
        key: 'deviceDetails',
      },
      ...(isSwitch
        ? [
            {
              label: (
                <Popover
                  overlayClassName='custom-popover'
                  arrow={false}
                  placement="rightTop"
                  trigger="hover"
                  content={<PortList />}
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
                    <span>포트별 단말목록</span>
                    <RightOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
                  </div>
                </Popover>
              ),
              key: 'portList',
            },
          ]
        : []),
      {
        label: (
          <Popover
            overlayClassName='custom-popover'
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
              <RightOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
            </div>
          </Popover>
        ),
        key: 'eventStatus',
      },
      {
        label: '원격접속',
        key: 'remoteConnect',
        disabled: !nodeDeviceDetails?.deviceIp,
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
    [id, nodeDeviceDetails, data, dispatch, message, isSwitch],
  );

  return (
    <Dropdown
      overlayClassName='node-dropdown'
      menu={{ items }}
      trigger={['contextMenu']}
      open={isEditMode ? false : undefined}
      onOpenChange={open => {
        if (isEditMode) return;

        if (!open) {
          return dispatch(resetDeviceDetails());
        }

        if (open) {
          dispatch(getNodeDeviceDetails(data.deviceId));
          dispatch(
            getUnhandledEventsByDevice({ page: 1, deviceId: data.deviceId }),
          );

          if (isSwitch) {
            dispatch(getPortsBySwitch(data.deviceId));
          }
        }
      }}
    >
      <Wrapper
        className={`${isSelected ? 'selected' : ''}`}
        title={data.deviceName}
      >
        <div className="icon-wrapper">
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}__left-input`}
            className={`custom-node-handle input ${
              isEditMode ? 'show' : 'hide'
            }`}
          />
          <Handle
            type="target"
            position={Position.Top}
            id={`${id}__top-input`}
            className={`custom-node-handle input ${
              isEditMode ? 'show' : 'hide'
            }`}
          />
          {data.managementYn === ResManageYn.비관리 ? (
            <img
              src={
                IMAGE_PATHS.topology[data.depth2Cd] ||
                IMAGE_PATHS.topology.fallback
              }
              alt={`${data.depth2Nm} icon`}
            />
          ) : (
            <ManagementNDeviceIconBg>
              <img
                src={
                  IMAGE_PATHS.topology[data.depth2Cd] ||
                  IMAGE_PATHS.topology.fallback
                }
                alt={`${data.depth2Nm} icon`}
              />
            </ManagementNDeviceIconBg>
          )}
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}__right-output`}
            className={`custom-node-handle output ${
              isEditMode ? 'show' : 'hide'
            }`}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id={`${id}__bottom-output`}
            className={`custom-node-handle output ${
              isEditMode ? 'show' : 'hide'
            }`}
          />
          <div className={`badge-group ${isEditMode ? 'hide' : 'show'}`}>
            {data.managementYn === ResManageYn.비관리 ? (
              <Badge size="small" color={theme.colors.managementN} count="비" />
            ) : (
              <>
                <Badge
                  size="small"
                  color={theme.colors.urgent}
                  count={data.urgent}
                  showZero={false}
                />
                <Badge
                  size="small"
                  color={theme.colors.important}
                  count={data.important}
                  showZero={false}
                />
                <Badge
                  size="small"
                  color={theme.colors.minor}
                  count={data.minor}
                  showZero={false}
                />
              </>
            )}
          </div>
        </div>
        <div className="label">{data.deviceName}</div>
      </Wrapper>
    </Dropdown>
  );
};

const Wrapper = styled.div`
  position: relative;
  border-radius: ${themeGet('borderRadius.normal')};
  border: 3px solid transparent;

  &.selected {
    border: 3px solid ${themeGet('colors.nodeSelected')};
    box-shadow: ${themeGet('shadows.nodeSelected')};
  }

  .icon-wrapper {
    display: grid;
    place-content: center;

    position: relative;
    width: 50px;
    /* height: 50px;
    border-radius: 50%;
    border: 1px solid ${themeGet('colors.palette.gray3')};
    background: ${themeGet('colors.palette.gray1')};
    color: #222;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 15%),
      0 2px 4px -1px rgb(0 0 0 / 8%); */

    img {
      width: 100%;
    }
  }

  .label {
    position: absolute;
    left: -36px;
    right: -36px;
    bottom: -18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    font-size: ${themeGet('fontSizes.s1')};
  }

  .custom-node-handle {
    width: 8px;
    height: 8px;
    background: ${themeGet('colors.palette.gray6')};

    &.input {
      background: ${themeGet('colors.palette.cyan5')};
    }

    &.output {
      background: ${themeGet('colors.palette.lime5')};
    }

    &.show {
      opacity: 1;
    }

    &.hide {
      opacity: 0;
    }
  }

  .badge-group {
    position: absolute;
    top: -8px;
    left: 0;
    right: -8px;

    &.show {
      display: flex;
      justify-content: flex-end;
      gap: 2px;
    }

    &.hide {
      display: none;
    }

    .ant-badge {
      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      &.ant-badge-status .ant-badge-status-dot {
        display: unset;
      }

      .ant-badge-count {
        color: ${themeGet('colors.white')};
        box-shadow: 0 0 0 1px ${themeGet('colors.white')};
      }
    }
  }
`;

const ManagementNDeviceIconBg = styled.div`
  display: inline-block;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    background-color: ${themeGet('colors.bgManagementDevice')};
    border-radius: 10%;
    z-index: -1;
  }
`;

export default NetworkNode;
