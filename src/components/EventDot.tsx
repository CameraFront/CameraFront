import { useMemo } from 'react';
import { Badge } from 'antd';
import styled, { useTheme } from 'styled-components';
import { EventTypeEn } from '@/types/common';
import { eventTypeMap } from '@/types/mappers';

interface Props {
  type: EventTypeEn;
  size?: 'small' | 'medium' | 'large' | 'xLarge';
  active?: boolean;
  hasText?: boolean;
  isInverted?: boolean;
}
const EventDot = ({
  type,
  active = true,
  size = 'medium',
  hasText = false,
  isInverted = false,
}: Props) => {
  const theme = useTheme();

  const sizeValue = useMemo(() => {
    switch (size) {
      case 'small':
        return 6;
      case 'medium':
        return 8;
      case 'large':
        return 12;
      case 'xLarge':
        return 22;
      default:
        return 6;
    }
  }, [size]);

  return (
    <CustomBadge
      color={theme.colors[type]}
      status={active && type !== 'minor' ? 'processing' : undefined}
      text={hasText ? eventTypeMap[type] : undefined}
      title={hasText ? eventTypeMap[type] : undefined}
      $sizeValue={sizeValue}
    />
  );
};

const CustomBadge = styled(Badge)<{ $sizeValue: number }>`
  &.ant-badge.ant-badge-status .ant-badge-status-dot {
    width: ${({ $sizeValue: sizeValue }) => `${sizeValue}px`};
    height: ${({ $sizeValue: sizeValue }) => `${sizeValue}px`};
  }
`;

export default EventDot;
