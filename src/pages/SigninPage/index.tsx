import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { InfoCircleOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import { useAppSelector } from '@/app/hooks';
import LogoSignin from '@/assets/logo-login.svg?react';
import LogoSigninDark from '@/assets/logo-login__dark.svg?react';
import SigninForm from './SigninForm';

const SigninPage = () => {
  const { user, isDarkMode } = useAppSelector(store => store.global);
  const navigate = useNavigate();

  // 로그인 상태일 경우 메인 페이지로 이동
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <div className="container">
        <div className="header">
          <div className="logo-wrapper">
          {isDarkMode ? (
              <LogoSigninDark className="logo" />
            ) : (
              <LogoSignin className="logo" />
            )}
          </div>
          {/* <h4 className="title">Enterprise Management System</h4> */}
        </div>
        <SigninForm />
        <div className="info">
          <InfoCircleOutlined style={{color: '#B7B7B7'}}/>
          <p style={{color: '#B7B7B7'}}>
            본 어플리케이션은 <b>1920x1080</b>해상도와 <b>크롬</b>브라우저에
            최적화되어 있습니다.
          </p>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section<{ $isDarkMode: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  background-color: ${themeGet('colors.bgSignin')};
  background-image: ${({ $isDarkMode }) =>
    `url('assets/images/logo__bg${$isDarkMode ? '__dark' : ''}.svg')`};
  background-position: right bottom;
  background-repeat: no-repeat;

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;

    max-width: 80rem;
    width: 100%;
    max-height: 50rem;
    height: 100%;
    padding: 4rem;
    background: ${themeGet('colors.bgSection')};
    border: 1px solid #E2E2E2;
    //box-shadow: ${themeGet('shadows.normal')};
    border-radius: ${themeGet('borderRadius.normal')};

    .header {
      align-self: center;
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;

      .logo-wrapper {
        text-align: center;

        .logo {
          color: ${({ $isDarkMode }) =>
            $isDarkMode
              ? themeGet('colors.white')
              : themeGet('colors.primary')};
          max-width: 30rem;
          width: 100%;
        }
      }

      .title {
        font-size: ${themeGet('fontSizes.s6')};
        font-weight: ${themeGet('fontWeights.light')};
        /* color: ${themeGet('colors.palette.gray7')}; */
      }
    }

    .ant-form-item {
      margin-bottom: 16px;


      button {
        margin-top: 14px;
      }
    }

    .info {
      align-self: center;
      display: flex;
      gap: 6px;
    }
  }
`;

export default SigninPage;
