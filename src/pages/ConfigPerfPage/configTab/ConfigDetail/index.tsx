import { ReactNode, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import NoData from '@/components/fallbacks/NoData';
import { useAppDispatch } from '@/app/hooks';
import {
  getPortsBySwitch,
  resetPortList,
} from '@/features/configPerfPage/configPerfSlice';
import { useGetConfigDeviceDetailsQuery } from '@/services/api/configPerf';
import { intIdSchema } from '@/services/validation/common';
import { DeviceType } from '@/types/enum';
import DescriptionsSection from './DescriptionsSection';
import NetworkTypeSection from './NetworkTypeSection';

const ConfigDetail = () => {
  const dispatch = useAppDispatch();
  const { deviceId } = useParams();
  const parsedDeviceId = intIdSchema.safeParse(deviceId);
  const {
    data: resConfigDeviceDetails,
    isLoading: isLoadingConfigDeviceDetails,
    isError: isErrorConfigDeviceDetails,
  } = useGetConfigDeviceDetailsQuery(parsedDeviceId.data ?? 0, {
    skip: !parsedDeviceId.success,
  });

  // 스위치일 경우에만 포트 목록을 가져옴
  useEffect(() => {
    if (!resConfigDeviceDetails) return;

    const isSwitch =
      resConfigDeviceDetails.deviceKindNm === 'L2' ||
      resConfigDeviceDetails.deviceKindNm === 'L3' ||
      resConfigDeviceDetails.deviceKindNm === 'L4';

    if (!isSwitch) {
      dispatch(resetPortList());
      return;
    }

    dispatch(getPortsBySwitch(resConfigDeviceDetails.deviceKey));
  }, [resConfigDeviceDetails, dispatch]);

  if (isLoadingConfigDeviceDetails) return null;
  if (isErrorConfigDeviceDetails) return <ErrorMessage />;
  if (!resConfigDeviceDetails) return <NoData />;

  return (
    <Wrapper>
      {resConfigDeviceDetails && (
        <DescriptionsSection resDeviceDetails={resConfigDeviceDetails} />
      )}
      <div className="additional-section">
        {resConfigDeviceDetails.deviceKind === DeviceType.Network && (
          <NetworkTypeSection deviceId={parsedDeviceId.data} />
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;

  .additional-section {
    grid-column: 1 / span 2;
  }

  .ant-descriptions {
    .ant-descriptions-view {
      border-radius: 6px;

      .ant-descriptions-item-label {
        width: 40%;
        background-color: ${themeGet('colors.bgDescriptionsLabel')} !important;

        span {
          padding-left: 1rem;
          font-size: 18px;
          color: ${themeGet('colors.textDescriptionsLabel')};
        }
      }
      .ant-descriptions-item-content {
        font-size: 18px;

        background-color: ${themeGet('colors.bgDescriptionsContent')} !important;
        span {
          padding-left: 1rem;
          font-size: 18px;
          color: ${themeGet('colors.textDescriptionsContent')};
        }
      }
    }
  }
`;
export default ConfigDetail;
