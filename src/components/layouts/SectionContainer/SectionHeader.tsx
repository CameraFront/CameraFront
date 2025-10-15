import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { themeGet } from '@styled-system/theme-get';

export interface IPropsSectionHeader {
  title?: string;
  leftContent?: ReactNode | null;
  middleContent?: ReactNode | null;
  rightContent?: ReactNode | null;
  className?: string;
  paddingX?: [string, string];
  borderBottom?: boolean;
}

const SectionHeader = ({
  title,
  leftContent,
  middleContent,
  rightContent,
  paddingX,
  borderBottom,
}: IPropsSectionHeader) => {
  return (
    <Wrapper paddingX={paddingX} borderBottom={borderBottom}>
      {leftContent ? (
        <div className="left-wrapper">
          <h4 className="title">{title}</h4>
          {leftContent}
        </div>
      ) : (
        <h4 className="title">{title}</h4>
      )}
      {middleContent ? (
        <div className="middle-wrapper">{middleContent}</div>
      ) : null}
      {rightContent ? (
        <div className="right-wrapper">{rightContent}</div>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div<IPropsSectionHeader>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-left: ${({ paddingX }) => (paddingX ? paddingX[0] : 0)};
  padding-right: ${({ paddingX }) => (paddingX ? paddingX[1] : 0)};
  border-bottom: ${({ borderBottom }) =>
    borderBottom
      ? css`1px solid ${themeGet('colors.borderHeader')}`
      : css`1px solid transparent`};

  background-color: ${themeGet('colors.bgHeader')};
  min-height: 60px;
  height: 60px;

  .title {
    font-size: ${themeGet('fontSizes.s4')};
    font-weight: ${themeGet('fontWeights.medium')};
  }

  .left-wrapper {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
`;
export default SectionHeader;
