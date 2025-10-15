import { ReactNode } from 'react';
import { Button, ButtonProps, Tooltip } from 'antd';
import styled from 'styled-components';

interface Props extends ButtonProps {
  title: string;
  icon: ReactNode;
}

const IconButton = ({ title, icon, ...props }: Props) => (
  <Tooltip title={title}>
    <Wrapper icon={icon} {...props} />
  </Tooltip>
);

const Wrapper = styled(Button)`
  display: grid;
  place-content: center;
`;

export default IconButton;
