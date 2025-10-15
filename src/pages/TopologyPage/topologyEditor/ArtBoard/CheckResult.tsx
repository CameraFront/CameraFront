import { CheckCircleFilled } from '@ant-design/icons';
import { theme, Typography } from 'antd';
import styled from 'styled-components';

const { Paragraph, Text } = Typography;
const { useToken } = theme;

interface Props {
  command: string;
  result: string;
}

const CheckResult = ({ command, result }: Props) => {
  const { token } = useToken();

  return (
    <Wrapper>
      <div className="title-wrapper">
        <CheckCircleFilled style={{ color: token.colorSuccess }} />
        <span className="title">정상적인 응답을 받았습니다.</span>
      </div>
      {command && (
        <Paragraph className="paragraph">
          <Text code strong>
            {command}
          </Text>
        </Paragraph>
      )}
      {result && (
        <Paragraph className="paragraph">
          <pre>{result}</pre>
        </Paragraph>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .title-wrapper {
    display: flex;
    gap: 0.8rem;

    margin-bottom: 1.6rem;
  }

  .paragraph {
    margin-bottom: 0;
  }
`;

export default CheckResult;
