import { ReactNode } from 'react';
import { Spin, SpinProps } from 'antd';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';

interface Props extends SpinProps {
  children: ReactNode;
  spinning: boolean;
  wrapperClassName?: string;
  message?: string;
}

const LoadingSpinner = ({
  children,
  spinning,
  wrapperClassName,
  message,
  ...props
}: Props) => (
  <Wrapper
    spinning={spinning}
    indicator={<LoadingOutlined style={{ fontSize: '2.4rem' }} spin />}
    wrapperClassName={wrapperClassName}
    tip={message}
    {...props}
  >
    {children}
  </Wrapper>
);

const Wrapper = styled(Spin)`
  width: 100%;
  height: 100%;
`;

export default LoadingSpinner;
