import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import GlobalHeader from '@/components/layouts/GlobalHeader';
import MenuSider from '@/components/layouts/MenuSider';
import { useAppSelector } from '@/app/hooks';

const { Content } = Layout;

const App = () => {
  const { isDarkMode } = useAppSelector(store => store.global);

  return (
    <Wrapper hasSider style={{ minHeight: '100vh' }} $isDarkMode={isDarkMode}>
      <MenuSider />
      <Layout style={{ minWidth: '1530px' }}>
        <GlobalHeader />
        <Content style={{ maxHeight: 'calc(100vh - 40px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Wrapper>
  );
};

const Wrapper = styled(Layout)<{ $isDarkMode: boolean }>`
  .ant-layout {
    // background: linear-gradient(to bottom right, red, yellow);
    background: ${({ $isDarkMode }) =>
      $isDarkMode ? 'linear-gradient(to bottom right, #0B103A, #171F6A)' : ''};
  }
  .ant-layout-header {
    background-color: transparent;
  }

  .ant-layout-sider,
  .ant-layout-sider-trigger {
    border-inline-end: 1px solid rgba(5, 5, 5, 0.06);
    background: ${themeGet('colors.bgBody')};
  }

  .react-flow__controls {
    box-shadow: ${({ $isDarkMode }) =>
      $isDarkMode
        ? '0 0 2px 1px rgba(255, 255, 255, 0.08)'
        : '0 0 2px 1px rgba(0, 0, 0, 0.08)'};

    .react-flow__controls-button {
      background: ${themeGet('colors.bgSection')};
      border-bottom: 1px solid ${themeGet('colors.borderHeader')};
      svg {
        fill: ${themeGet('colors.textMain')};
      }
    }
  }

  .react-flow__minimap {
    background: ${themeGet('colors.bgSection')};

    .react-flow__minimap-mask {
      fill: ${({ $isDarkMode }) =>
        $isDarkMode ? 'rgb(240, 240, 240, 0.1)' : 'rgb(240, 240, 240, 0.6)'};
    }
  }
`;

export default App;
