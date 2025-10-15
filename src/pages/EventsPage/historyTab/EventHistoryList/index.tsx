import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import NotFoundContent from '@/components/fallbacks/NotFoundContent';
import { intIdSchema } from '@/services/validation/common';
import ChartSection from './ChartSection';
import TableSection from './TableSection';

const EventHistoryList = () => {
  const { branchId } = useParams();
  const parsedBranchId = intIdSchema.safeParse(branchId);

  if (!parsedBranchId.success) return <NotFoundContent />;

  return (
    <Wrapper>
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

export default EventHistoryList;
