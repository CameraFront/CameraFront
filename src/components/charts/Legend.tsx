import styled from 'styled-components';

type Props = {
  color: string;
  name: string;
};

const Legend = ({ color, name }: Props) => (
  <Wrapper $legendColor={color}>
    <span className="rect" />
    <span className="label">{name}</span>
  </Wrapper>
);

const Wrapper = styled.div<{ $legendColor: string }>`
  display: flex;
  align-items: center;
  gap: 4px;

  padding-right: 2.9rem;

  .rect {
    width: 16px;
    height: 16px;
    background-color: ${({ $legendColor }) => $legendColor};
    border-radius: 4px;
  }

  .label {
    padding-left: 5px;
  }
`;

export default Legend;
