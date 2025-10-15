import { ComponentProps } from 'react';
import styled, { useTheme } from 'styled-components';

const ErrorMessage = ({
  children = '서버에서 데이터를 가져오는데 실패했습니다.',
  style,
}: ComponentProps<'div'>) => {
  const theme = useTheme();

  return (
    <Wrapper style={{ color: theme.colors.gray, ...style }}>
      <div>{children}</div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  place-items: center;
  height: 100%;
`;
export default ErrorMessage;
