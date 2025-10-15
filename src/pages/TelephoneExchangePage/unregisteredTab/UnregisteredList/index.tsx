import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import TableSection from './TableSection';

const UnregisteredList = () => (
  <Wrapper>
    <TableSection />
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeGet('spacing.s4')};
`;

export default UnregisteredList;
