import { createGlobalStyle, css } from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import SpoqaHanSansNeoBoldWoff from '/assets/fonts/SpoqaHanSansNeo-Bold.woff';
import SpoqaHanSansNeoBoldWoff2 from '/assets/fonts/SpoqaHanSansNeo-Bold.woff2';
import SpoqaHanSansNeoLightWoff from '/assets/fonts/SpoqaHanSansNeo-Light.woff';
import SpoqaHanSansNeoLightWoff2 from '/assets/fonts/SpoqaHanSansNeo-Light.woff2';
import SpoqaHanSansNeoMediumWoff from '/assets/fonts/SpoqaHanSansNeo-Medium.woff';
import SpoqaHanSansNeoMediumWoff2 from '/assets/fonts/SpoqaHanSansNeo-Medium.woff2';
import SpoqaHanSansNeoRegularWoff from '/assets/fonts/SpoqaHanSansNeo-Regular.woff';
import SpoqaHanSansNeoRegularWoff2 from '/assets/fonts/SpoqaHanSansNeo-Regular.woff2';
import SpoqaHanSansNeoThinWoff from '/assets/fonts/SpoqaHanSansNeo-Thin.woff';
import SpoqaHanSansNeoThinWoff2 from '/assets/fonts/SpoqaHanSansNeo-Thin.woff2';
import NotoSansKR300Woff from '/assets/fonts/noto-sans-kr-v27-latin_korean-300.woff';
import NotoSansKR300Woff2 from '/assets/fonts/noto-sans-kr-v27-latin_korean-300.woff2';
import NotoSansKR500Woff from '/assets/fonts/noto-sans-kr-v27-latin_korean-500.woff';
import NotoSansKR500Woff2 from '/assets/fonts/noto-sans-kr-v27-latin_korean-500.woff2';
import NotoSansKR700Woff from '/assets/fonts/noto-sans-kr-v27-latin_korean-700.woff';
import NotoSansKR700Woff2 from '/assets/fonts/noto-sans-kr-v27-latin_korean-700.woff2';
import NotoSansKR400Woff from '/assets/fonts/noto-sans-kr-v27-latin_korean-regular.woff';
import NotoSansKR400Woff2 from '/assets/fonts/noto-sans-kr-v27-latin_korean-regular.woff2';

export const GlobalStyle = createGlobalStyle`${css`
  /* ::selection {
        background: ${themeGet('colors.primary')};
        color: ${themeGet('colors.textInv')};
    } */

  /* noto-sans-kr-300 - latin_korean */

  h1 {
    font-size: ${themeGet('fontSizes.s14')};
    margin-bottom: 0;
  }

  h2 {
    font-size: ${themeGet('fontSizes.s12')};
    margin-bottom: 0;
  }

  h3 {
    font-size: ${themeGet('fontSizes.s10')};
    line-height: ${themeGet('lineHeights.tight')};
    margin-bottom: 0;
  }

  h4 {
    font-size: ${themeGet('fontSizes.s8')};
    margin-bottom: 0;
  }

  h5 {
    font-size: ${themeGet('fontSizes.s6')};
    margin-bottom: 0;
  }

  h6 {
    font-size: ${themeGet('fontSizes.s4')};
    margin-bottom: 0;
  }

  p {
    margin: 0;
    color: back;
  }

  .color-success {
    color: ${themeGet('colors.textSuccess')};
  }

  .color-warning {
    color: ${themeGet('colors.textWarning')};
  }

  .color-danger {
    color: ${themeGet('colors.textDanger')};
  }

  .bg-success {
    background-color: ${themeGet('colors.bgSuccess')};
  }

  .bg-warning {
    background-color: ${themeGet('colors.bgWarning')};
  }

  .bg-danger {
    background-color: ${themeGet('colors.bgDanger')};
  }

  &.urgent {
    color: ${themeGet('colors.textInv')};
    background-color: ${themeGet('colors.bg.urgent')};
  }

  &.important {
    color: ${themeGet('colors.textInv')};
    background-color: ${themeGet('colors.bg.important')};
  }

  &.minor {
    color: ${themeGet('colors.text.minor')};
    background-color: ${themeGet('colors.bg.minor')};
  }

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ant-spin-nested-loading {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;

    .ant-spin-container {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }

  .event-modal {
    .ant-modal-content {
      background-color: ${themeGet('colors.bgCriticalEventModal')};
    }
  }

  .ant-notification .ant-notification-notice-wrapper .ant-notification-notice {
    &.event-notification {
      border-radius: ${themeGet('borderRadius.normal')};
      padding: 1.6rem 2rem;

      &.urgent {
        border: 3px solid ${themeGet(`colors.border.urgent`)};
        background-color: ${themeGet(`colors.bg.urgent`)}20;

        .ant-notification-notice-message {
          color: ${themeGet('colors.text.urgent')};
        }
      }

      &.important {
        border: 3px solid ${themeGet(`colors.border.important`)};
        background-color: ${themeGet(`colors.bg.important`)}20;

        .ant-notification-notice-message {
          color: ${themeGet('colors.text.important')};
        }
      }

      &.minor {
        border: 3px solid ${themeGet(`colors.border.minor`)};
        background-color: ${themeGet(`colors.bg.minor`)}20;

        .ant-notification-notice-message {
          color: ${themeGet('colors.text.minor')};
        }
      }

      .ant-notification-notice-message {
        /* margin-bottom: 4px; */

        .event-title {
          /* &__label {
            color: ${themeGet('colors.bg.urgent')};
            font-size: ${themeGet('fontSizes.s4')};
            background-color: ${themeGet('colors.urgent')};
            border-radius: ${themeGet('borderRadius.normal')};
            padding: 1px 6px;
          } */

          /* &__text {
            margin-inline-start: 2px;
            font-weight: ${themeGet('fontWeights.bold')};
            color: ${themeGet('colors.urgent')};
          } */
        }
      }

      .ant-notification-notice-description {
        font-weight: ${themeGet('fontWeights.light')};

        .btn-more {
          padding: 2px;
          height: auto;
          line-height: ${themeGet('lineHeights.tight')};
          a {
            color: ${themeGet('colors.textMore')};
          }

          .anticon-right {
            margin-inline-start: 2px;
          }
        }
      }
    }
  }

  .node-dropdown {
    .ant-dropdown-menu {
      background-color: ${themeGet('colors.bgPopover')};

      .ant-popover-content .ant-popover-inner {
        background-color: ${themeGet('colors.bgPopover')};
      }
    }
  }

  .custom-popover {
    .ant-popover-content .ant-popover-inner {
      background-color: ${themeGet('colors.bgPopover')};
      box-shadow: 0 0 8px #00010;

      .ant-popover-inner-content {
        .item {
          color: ${themeGet('colors.textDescriptionsContent')};

          .ant-select .ant-select-selector {
            background-color: ${themeGet('colors.bgWIdgetTableHeader')};
            color: ${themeGet('colors.textDescriptionsContent')};
            border: 1px solid ${themeGet('colors.borderInput')};
          }
        }

        button {
          background-color: ${themeGet('colors.bgWIdgetTableHeader')};
          color: ${themeGet('colors.textDescriptionsContent')};
          border: 1px solid ${themeGet('colors.borderInput')};
        }
      }
    }
  }

  .ant-select-dropdown {
    background-color: ${themeGet('colors.bgPopover')};

    .ant-select-item-option {
      color: ${themeGet('colors.textDescriptionsContent')};
    }
    .ant-select-item-option-selected {
      background-color: ${themeGet('colors.bgOptionSelected')} !important;
    }
  }

  .map-custom-popover {
    border: 3px solid red;
    border-radius: 10px;
    color: ${themeGet('colors.textMapPopover')};

    .ant-popover-arrow {
      &::after {
        border: 3px solid red;
        background-color: ${themeGet('colors.bgMapPopover')};
      }
    }

    .ant-popover-content .ant-popover-inner {
      background-color: ${themeGet('colors.bgMapPopover')};
    }
  }

  html {
    font-size: 62.5%; // 1rem = 10px
  }

  body {
    height: 100vh;
    background-color: ${themeGet('colors.bgBody')};
    background-image: ${themeGet('colors.bgImageBody')};
    font-size: ${themeGet('default.fontSize')};
    font-weight: ${themeGet('default.fontWeight')};
    line-height: ${themeGet('default.lineHeight')};
    letter-spacing: ${themeGet('default.lineSpacing')};
    color: ${themeGet('default.color')};
    font-family: ${themeGet('default.fontFamily')};
  }

  #root {
    height: 100%;
  }

  @font-face {
    font-display: block;
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 300;
    src:
      url(${NotoSansKR300Woff2}) format('woff2'),
      url(${NotoSansKR300Woff}) format('woff');
  }

  @font-face {
    font-display: block;
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 400;
    src:
      url(${NotoSansKR400Woff2}) format('woff2'),
      url(${NotoSansKR400Woff}) format('woff');
  }

  @font-face {
    font-display: block;
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 500;
    src:
      url(${NotoSansKR500Woff2}) format('woff2'),
      url(${NotoSansKR500Woff}) format('woff');
  }

  @font-face {
    font-display: block;
    font-family: 'Noto Sans KR';
    font-style: normal;
    font-weight: 700;
    src:
      url(${NotoSansKR700Woff2}) format('woff2'),
      url(${NotoSansKR700Woff}) format('woff');
  }

  @font-face {
    font-display: block;
    font-family: 'Spoqa Han Sans Neo';
    font-weight: 700;
    src:
      url(${SpoqaHanSansNeoBoldWoff2}) format('woff2'),
      url(${SpoqaHanSansNeoBoldWoff}) format('woff');
  }

  @font-face {
    font-display: block;
    font-family: 'Spoqa Han Sans Neo';
    font-weight: 500;
    src:
      url(${SpoqaHanSansNeoMediumWoff2}) format('woff2'),
      url(${SpoqaHanSansNeoMediumWoff}) format('woff');
  }

  @font-face {
    font-display: block;
    font-family: 'Spoqa Han Sans Neo';
    font-weight: 400;
    src:
      url(${SpoqaHanSansNeoRegularWoff2}) format('woff2'),
      url(${SpoqaHanSansNeoRegularWoff}) format('woff');
  }

  @font-face {
    font-display: block;
    font-family: 'Spoqa Han Sans Neo';
    font-weight: 300;
    src:
      url(${SpoqaHanSansNeoLightWoff2}) format('woff2'),
      url(${SpoqaHanSansNeoLightWoff}) format('woff');
  }

  @font-face {
    font-display: block;
    font-family: 'Spoqa Han Sans Neo';
    font-weight: 100;
    src:
      url(${SpoqaHanSansNeoThinWoff2}) format('woff2'),
      url(${SpoqaHanSansNeoThinWoff}) format('woff');
  }
`}`;
