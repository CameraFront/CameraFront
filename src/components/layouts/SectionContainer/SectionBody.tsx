import { ReactNode } from 'react';
import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

export interface IPropsSectionBody {
  children?: ReactNode;
  paddingX?: [string, string];
  paddingY?: [string, string];
}

const SectionBody = ({
  children,
  paddingX = ['3rem', '3rem'],
  paddingY = ['3rem', '3rem'],
}: IPropsSectionBody) => {
  return (
    <Wrapper paddingX={paddingX} paddingY={paddingY}>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<IPropsSectionBody>`
  flex: 1;
  display: flex;
  flex-direction: column;

  background-color: ${themeGet('colors.bgSection')};
  padding-top: ${({ paddingY }) => (paddingY ? paddingY[0] : 0)};
  padding-bottom: ${({ paddingY }) => (paddingY ? paddingY[1] : 0)};
  padding-left: ${({ paddingX }) => (paddingX ? paddingX[0] : 0)};
  padding-right: ${({ paddingX }) => (paddingX ? paddingX[1] : 0)};
`;

export default SectionBody;
