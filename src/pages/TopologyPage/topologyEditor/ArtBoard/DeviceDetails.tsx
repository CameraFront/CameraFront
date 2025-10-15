import { Divider } from 'antd';
import { styled } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import NoData from '@/components/fallbacks/NoData';
import { useAppSelector } from '@/app/hooks';
import { NetworkNodeData } from '@/features/topologyPage/types';

interface Props {
  data: NetworkNodeData;
  id: string;
}

const DeviceDetails = ({ data, id }: Props) => {
  const {
    content: { nodeDeviceDetails },
  } = useAppSelector(store => store.topology);

  if (!nodeDeviceDetails) return <NoData />;

  const hasPerfInfo =
    nodeDeviceDetails.cpuUtil ||
    nodeDeviceDetails.memUtil ||
    nodeDeviceDetails.usageUtil;

  return (
    <Wrapper>
      <Divider style={{ marginTop: 0, marginBottom: '8px', fontSize: 14 }}>
        운영
      </Divider>
      <div className="row">
        <div className="label">지역본부</div>
        <div className="content" title={nodeDeviceDetails.managementNm}>
          {nodeDeviceDetails.managementNm}
        </div>
      </div>
      <div className="row">
        <div className="label">장비종류</div>
        <div className="content" title={nodeDeviceDetails.deviceKindNm}>
          {nodeDeviceDetails.deviceKindNm}
        </div>
      </div>
      <div className="row">
        <div className="label">장비명</div>
        <div className="content" title={nodeDeviceDetails.deviceNm}>
          {nodeDeviceDetails.deviceNm}
        </div>
      </div>
      {nodeDeviceDetails.deviceIp ? (
        <div className="row">
          <div className="label">IP주소</div>
          <div className="content" title={nodeDeviceDetails.deviceIp}>
            {nodeDeviceDetails.deviceIp}
          </div>
        </div>
      ) : null}
      <div className="row">
        <div className="label">관리여부</div>
        <div className="content" title={nodeDeviceDetails.manageYnNm}>
          {nodeDeviceDetails.manageYnNm}
        </div>
      </div>
      <div className="row">
        <div className="label">설치업체</div>
        <div className="content" title={nodeDeviceDetails.installCompany}>
          {nodeDeviceDetails.installCompany}
        </div>
      </div>
      <div className="row">
        <div className="label">제조사</div>
        <div className="content" title={nodeDeviceDetails.productCompany}>
          {nodeDeviceDetails.productCompany}
        </div>
      </div>
      <div className="row">
        <div className="label">설치일자</div>
        <div className="content" title={nodeDeviceDetails.installDate}>
          {nodeDeviceDetails.installDate}
        </div>
      </div>
      <div className="row">
        <div className="label">모델명</div>
        <div className="content" title={nodeDeviceDetails.modelNm}>
          {nodeDeviceDetails.modelNm}
        </div>
      </div>
      <div className="row">
        <div className="label">관리자(정)</div>
        <div className="content" title={nodeDeviceDetails.managerANm}>
          {nodeDeviceDetails.managerANm}
        </div>
      </div>
      <div className="row">
        <div className="label">관리자(부)</div>
        <div className="content" title={nodeDeviceDetails.managerBNm}>
          {nodeDeviceDetails.managerBNm}
        </div>
      </div>
      {nodeDeviceDetails.sysUptime ? (
        <div className="row">
          <div className="label">구동시간</div>
          <div className="content" title={nodeDeviceDetails.sysUptime}>
            {nodeDeviceDetails.sysUptime}
          </div>
        </div>
      ) : null}
      {nodeDeviceDetails.fsNm ? (
        <div className="row">
          <div className="label">OS</div>
          <div className="content" title={nodeDeviceDetails.fsNm}>
            {nodeDeviceDetails.fsNm}
          </div>
        </div>
      ) : null}

      {hasPerfInfo && (
        <Divider style={{ marginTop: 0, marginBottom: '8px', fontSize: 14 }}>
          성능
        </Divider>
      )}
      {nodeDeviceDetails.cpuUtil ? (
        <div className="row">
          <div className="label">CPU 사용률</div>
          <div className="content" title={`${nodeDeviceDetails.cpuUtil}%`}>
            {`${nodeDeviceDetails.cpuUtil}%`}
          </div>
        </div>
      ) : null}
      {nodeDeviceDetails.memUtil ? (
        <div className="row">
          <div className="label">메모리 사용률</div>
          <div className="content" title={`${nodeDeviceDetails.memUtil}%`}>
            {`${nodeDeviceDetails.memUtil}%`}
          </div>
        </div>
      ) : null}
      {nodeDeviceDetails.usageUtil ? (
        <div className="row">
          <div className="label">디스크 총용량</div>
          <div className="content" title={`${nodeDeviceDetails.usageUtil}GB`}>
            {`${nodeDeviceDetails.usageUtil}GB`}
          </div>
        </div>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  padding: 0.8rem 1.6rem 1.6rem;
  width: 30rem;
  /* max-width: 30rem;
  min-width: 10rem; */

  .row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      flex: 0 0 34%;
      color: ${themeGet('colors.textSub')};
    }

    .content {
      flex: 0 0 66%;
      text-align: end;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
export default DeviceDetails;
