import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { light } from '@/css/theme';

interface Props {
  status: 'green' | 'red' | 'yellow' | 'gray' | 'inactive';
  size?: 'small' | 'medium' | 'large';
  flickering?: boolean;
}

const GlowingCircle = ({
  status,
  flickering = false,
  size = 'medium',
}: Props) => {
  const sizeValue = useMemo(() => {
    switch (size) {
      case 'small':
        return 6;
      case 'medium':
        return 8;
      case 'large':
        return 12;
      default:
        return 6;
    }
  }, [size]);

  return (
    <Wrapper
      $status={status}
      $color={light.colors[status]}
      $size={sizeValue}
      $flickering={flickering}
    />
  );
};

const Wrapper = styled.div<{
  $status: Props['status'];
  $size: number;
  $color: string;
  $flickering: boolean;
}>`
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border-radius: 50%;
  filter: brightness(1.5);

  @keyframes flickering {
    50% {
      opacity: 0.2;
    }
  }

  ${({ $flickering }) =>
    $flickering &&
    css`
      animation: flickering 1s infinite;
    `}

  ${({ $color }) => css`
    background: repeating-linear-gradient(${$color}, ${`${$color}e6`} 1px);
  `}
    

  ${({ $status, $size, $color }) =>
    $status !== 'inactive' &&
    css`
      box-shadow: 0 0 ${`${$size * 0.7}px`} ${$color}};
    `}
`;
export default GlowingCircle;
