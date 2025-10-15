import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { EventTypeEn } from '@/types/common';
import { eventTypeMap } from '@/types/mappers';

interface Props {
  type: EventTypeEn;
}
const EventTag = ({ type }: Props) => (
  <Wrapper className={type}>{eventTypeMap[type]}</Wrapper>
);

const Wrapper = styled.span`
  padding: 2px 4px;
  border-radius: 6px;
  font-weight: ${themeGet('fontWeights.medium')};
`;
export default EventTag;
