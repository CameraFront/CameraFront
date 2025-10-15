import { Typography } from 'antd';
import styled from 'styled-components';

const NotSelectedContent = () => (
  <Wrapper>
    <div>
      <Typography.Title level={4}>조회할 대상이 없습니다.</Typography.Title>
      <Typography.Text style={{ color: '#999' }}>
        왼쪽 트리에서 조회할 대상을 선택하세요.
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
  text-align: center;
`;

export default NotSelectedContent;
