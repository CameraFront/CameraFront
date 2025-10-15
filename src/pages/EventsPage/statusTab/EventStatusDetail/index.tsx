import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import NotFoundContent from '@/components/fallbacks/NotFoundContent';
import { intIdSchema } from '@/services/validation/common';
import ChartSection from './ChartSection';
import Header from './Header';
import TableSection from './TableSection';

// FIXME: 테이블 필터조건 변경시 위 차트들이 다시 그려짐. 값 같아도.
const EventStatusDetail = () => {
  const { branchId, deviceId } = useParams();
  const parsedBranchId = intIdSchema.safeParse(branchId);
  const parsedDeviceId = intIdSchema.safeParse(deviceId);

  if (!parsedBranchId.success || !parsedDeviceId.success)
    return <NotFoundContent />;

  return (
    <Wrapper>
      <Header />
      <ChartSection />
      <TableSection />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeGet('spacing.s4')};
`;

export default EventStatusDetail;
