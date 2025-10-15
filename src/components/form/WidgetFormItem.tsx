import { Form, FormItemProps } from 'antd';
import styled from 'styled-components';

export const WidgetFormItem = ({ children, ...props }: FormItemProps) => (
  <Wrapper {...props}>{children}</Wrapper>
);

const Wrapper = styled(Form.Item)`
  margin-bottom: 8px;
`;
