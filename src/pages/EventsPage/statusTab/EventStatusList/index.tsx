import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import ChartSection from './ChartSection';
import TableSection from './TableSection';

// FIXME: 테이블 필터조건 변경시 위 차트들이 다시 그려짐. 값 같아도.
const EventStatusList = () => (
  <Wrapper>
    <ChartSection />
    <TableSection />
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeGet('spacing.s4')};
`;

export default EventStatusList;
