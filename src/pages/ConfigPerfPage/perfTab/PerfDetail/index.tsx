import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import Header from './Header';
import Content from './content';

const PerfDetail = () => (
  <Wrapper>
    <Header />
    <Content />
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeGet('spacing.s5')};
`;

export default PerfDetail;
