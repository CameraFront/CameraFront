import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import NotFoundContent from '@/components/fallbacks/NotFoundContent';
import { useGetUnregisteredPhoneDetailsQuery } from '@/services/api/telephoneExchange';
import { intIdSchema } from '@/services/validation/common';
import DescriptionsSection from './DescriptionsSection';

const UnregisteredDetail = () => {
  const { branchId, deviceId } = useParams();
  const parsedBranchId = intIdSchema.parse(branchId);
  const parsedDeviceId = intIdSchema.parse(deviceId);
  const {
    data: resUnregisteredPhoneDetails,
    isLoading: isLoadingUnregisteredPhoneDetails,
  } = useGetUnregisteredPhoneDetailsQuery(parsedDeviceId ?? 0, {
    skip: !parsedDeviceId,
  });

  if (!parsedBranchId || !parsedDeviceId) return <NotFoundContent />;

  return (
    <Wrapper>
      {resUnregisteredPhoneDetails && (
        <DescriptionsSection
          resUnregisteredPhoneDetails={resUnregisteredPhoneDetails}
        />
      )}
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

        background-color: ${themeGet(
          'colors.bgDescriptionsContent',
        )} !important;
        span {
          padding-left: 1rem;
          font-size: 18px;
          color: ${themeGet('colors.textDescriptionsContent')};
        }
      }
    }
  }
`;

export default UnregisteredDetail;
