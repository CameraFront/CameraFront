import { CSSProperties, ReactNode } from 'react';
import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import SectionHeader, { IPropsSectionHeader } from './SectionHeader';
import SectionBody, { IPropsSectionBody } from './SectionBody';

interface Props extends IPropsSectionHeader, IPropsSectionBody {
  children?: ReactNode;
  maxWidth?: string;
  style?: CSSProperties;
}

const SectionContainer = ({
  title,
  leftContent = null,
  middleContent = null,
  rightContent = null,
  className,
  children,
  maxWidth = 'none',
  paddingX = ['3rem', '3rem'],
  paddingY = ['3rem', '3rem'],
  borderBottom = true,
  style,
}: Props) => {
  const addAllClasses = ['section-container'];

  if (className) {
    addAllClasses.push(className);
  }

  return (
    <Wrapper className={addAllClasses.join(' ')} style={{ maxWidth, ...style }}>
      <SectionHeader
        title={title}
        leftContent={leftContent}
        middleContent={middleContent}
        rightContent={rightContent}
        paddingX={paddingX}
        borderBottom={borderBottom}
      />
      <SectionBody paddingX={paddingX} paddingY={paddingY}>
        {children}
      </SectionBody>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;

  /* box-shadow: ${themeGet('shadows.section')}; */
  background-color: #fff;
  border: 1px solid ${themeGet('colors.borderSection')};
  border-radius: ${themeGet('borderRadius.large')};
  overflow: hidden;

  width: 100%;
`;

export default SectionContainer;
