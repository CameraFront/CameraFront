import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd';
import 'antd/dist/reset.css';
import ko_KR from 'antd/locale/ko_KR';
import { ThemeProvider } from 'styled-components';
import { useAppSelector } from '@/app/hooks';
import { GlobalStyle } from '@/css/GlobalStyle';
import { dark, light } from '@/css/theme';

const StyleProvider = ({ children }: { children: React.ReactNode }) => {
  const { isDarkMode } = useAppSelector(store => store.global);
  const { defaultAlgorithm, darkAlgorithm } = antdTheme;

  return (
    <ConfigProvider
      locale={ko_KR}
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          fontFamily: light.default.fontFamily,
          fontWeightStrong: light.fontWeights.medium,
          colorPrimary: isDarkMode ? dark.colors.primary : light.colors.primary,
          ...(isDarkMode && { colorBgBase: dark.colors.bgBody }),
        },
        components: {
          Cascader: {
            dropdownHeight: 240,
          },
          Layout: {
            headerHeight: 40,
            siderBg: light.colors.white,
            triggerBg: light.colors.white,
            triggerColor: light.colors.gray600,
          },
          Menu: {
            itemBg: 'transparent',
            darkItemBg: 'transparent',
            itemSelectedBg: 'transparent',
            itemSelectedColor: light.colors.primary,
            itemColor: light.colors.gray500,
          },
          Button: {
            ...(isDarkMode && { colorBgContainer: '#54617aa6' }),
          },
        },
      }}
    >
      <ThemeProvider theme={isDarkMode ? dark : light}>
        <AntdApp style={{ height: '100%' }}>
          <GlobalStyle />
          {children}
        </AntdApp>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default StyleProvider;
