import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';

interface Props {
  children: React.ReactNode;
}
const TagLabel = ({ children }: Props) => <Wrapper>{children}</Wrapper>;

const Wrapper = styled.span`
  background: ${themeGet('colors.bgTag')};
  border: 1px solid ${themeGet('colors.borderSection')};
  border-radius: ${themeGet('borderRadius.normal')};
  padding: 2px 8px;
  font-weight: ${themeGet('fontWeights.medium')};
  font-size: ${themeGet('fontSizes.s2')};
`;
export default TagLabel;
