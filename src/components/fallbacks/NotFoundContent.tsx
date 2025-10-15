import { Typography } from 'antd';
import styled from 'styled-components';

const NotFoundContent = () => (
  <Wrapper>
    <div style={{ width: 'fit-content' }}>
      <Typography.Title level={4}>[404] NOT FOUND</Typography.Title>
      <Typography.Text style={{ color: '#999' }}>
        존재하지 않는 경로입니다.
      </Typography.Text>
    </div>
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  padding: 24px;
  border-radius: 8px;
`;

export default NotFoundContent;
