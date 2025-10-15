import { useAppSelector } from '@/app/hooks';
import { InfoCircleOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import { Popover, theme as antdTheme } from 'antd';
import styled, { useTheme } from 'styled-components';

const { useToken } = antdTheme;

const KeyTooltip = () => {
  const { isDarkMode } = useAppSelector(store => store.global);
  const { token } = useToken();
  const theme = useTheme();

  return (
    <Popover
      color={isDarkMode ? token.colorBgBase : theme.colors.textMain}
      content={
        <Wrapper $isDarkMode={isDarkMode}>
          <div className="row">
            <div className="label">삭제:</div>
            <div className="content">
              <span className="key-tag">Delete</span>
            </div>
          </div>
          <div className="row">
            <div className="label">다중선택:</div>
            <div className="content">
              <span className="key-tag">Shift</span> + 드래그
            </div>
          </div>
        </Wrapper>
      }
    >
      <InfoCircleOutlined size={20} color={theme.colors.textSub} />
    </Popover>
  );
};

const Wrapper = styled.div<{ $isDarkMode: boolean }>`
  color: ${({ $isDarkMode }) =>
    $isDarkMode ? themeGet('colors.textMain') : themeGet('colors.textInv')};

  .row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 4px;

    .key-tag {
      border: 1px solid
        ${({ $isDarkMode }) =>
          $isDarkMode
            ? themeGet('colors.textMain')
            : themeGet('colors.textInv')};
      padding: 0 4px;
      border-radius: ${themeGet('borderRadius.normal')};
      font-size: 0.8em;
    }
  }
`;

export default KeyTooltip;
