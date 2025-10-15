import { useNavigate } from 'react-router-dom';
import { Button, Flex } from 'antd';
import { styled } from 'styled-components';
import { ArrowLeftOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';

const UnknownErrorContent = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <h2 className="title">[500] UNKNOWN ERROR</h2>
      <p className="message">
        데이터 처리 중 알수 없는 오류가 발생했습니다. <br />
        문제가 지속될 경우 관리자에게 문의바랍니다.
      </p>
      <Flex gap={16}>
        <Button block onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
          뒤로가기
        </Button>
      </Flex>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  place-content: center;
  gap: 1.6rem;
  width: 100%;
  height: 100%;

  .title {
    font-weight: ${themeGet('fontWeights.bold')};
    /* border-radius: ${themeGet('borderRadius.large')}; */
    /* border: 1px solid ${themeGet('colors.borderDark')}; */
    padding: 0 16px;
    /* background-color: ${themeGet('colors.bgTag')}; */
  }

  .message {
    text-align: center;
    color: ${themeGet('colors.textSub')};
    font-weight: ${themeGet('fontWeights.medium')};
    font-size: ${themeGet('fontSizes.s4')};
  }
`;

export default UnknownErrorContent;
