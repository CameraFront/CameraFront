import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Tooltip } from 'antd';
import { styled } from 'styled-components';
import { CloseOutlined, EditOutlined, HolderOutlined } from '@ant-design/icons';
import { createNextState } from '@reduxjs/toolkit';
import themeGet from '@styled-system/theme-get';
import { useAppSelector } from '@/app/hooks';
import { LayoutItemWithId } from '@/features/dashboardPage/types';
import { useUpdateWidgetLayoutsMutation } from '@/services/api/dashboard';
import { WIDGET_CONFIG, WIDGET_LINK } from '@/config';
import WidgetContent from './WidgetContent';
import WidgetOptionsContent from './WidgetOptionsContent';

interface Props {
  data: LayoutItemWithId['data'];
  id: string;
  w: number;
  h: number;
  className?: string;
}

const WidgetCard = ({ data, className, id, w, h }: Props) => {
  const { isFullScreenMode, isEditMode, layoutItems } = useAppSelector(
    store => store.dashboard,
  );
  const { isDarkMode } = useAppSelector(store => store.global);
  const [title, setTitle] = useState<string>(data.title);
  const [titleOnEdit, setTitleOnEdit] = useState<boolean>(false);
  const [updateWidgetLayouts] = useUpdateWidgetLayoutsMutation();

  const handleRemoveItem = useCallback(() => {
    updateWidgetLayouts(layoutItems.filter(item => item.i !== id));
  }, [layoutItems, id, updateWidgetLayouts]);

  const handleSubmitTitle = useCallback(() => {
    const newLayoutItems = layoutItems.map(item => {
      if (item.i === id) {
        return createNextState(item, item => {
          item.data.title = title;
        });
      }

      return item;
    });

    updateWidgetLayouts(newLayoutItems);
    setTitleOnEdit(false);
  }, [title, layoutItems, id, updateWidgetLayouts]);

  useEffect(() => {
    if (w === 1 && title.length > 10) {
      setTitle(`${title.substring(0, 9)}..`);
    }
  }, [w, title]);

  return (
    <Wrapper className={className} key={id} $titleOnEdit={titleOnEdit}>
      <div className="header">
        <div className="left-wrapper">
          {isEditMode && (
            <HolderOutlined
              style={{ marginRight: 8 }}
              className="draggable-handle"
            />
          )}
          {isEditMode && titleOnEdit ? (
            <Input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={handleSubmitTitle}
              onPressEnter={handleSubmitTitle}
            />
          ) : (
            <>
              <span className="title">{title}</span>
              {isEditMode && (
                <Button
                  type="text"
                  className="btn-icon"
                  style={{ marginLeft: '4px' }}
                  onClick={() => setTitleOnEdit(true)}
                >
                  <EditOutlined />
                </Button>
              )}
            </>
          )}
        </div>
        <div className="right-wrapper">
          {isEditMode ? (
            <Button type="text" className="btn-icon" onClick={handleRemoveItem}>
              <CloseOutlined />
            </Button>
          ) : isFullScreenMode ? null : (
            <>
              <div className="wrap" />
              <Tooltip
                title={`"${WIDGET_LINK[data.type].linkTitle}" 페이지로 이동하기`}
              >
                <Link to={WIDGET_LINK[data.type].link}>
                  <Button type="text" className="btn-icon">
                    <img
                      src={`/assets/images/btn-icon${isDarkMode ? '__dark' : ''}.png`}
                      alt="button"
                    />
                  </Button>
                </Link>
              </Tooltip>
            </>
          )}
        </div>
      </div>
      <div className="content">
        {isEditMode ? (
          <WidgetOptionsContent data={data} id={id} />
        ) : (
          <WidgetContent data={data} />
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $titleOnEdit: boolean }>`
  display: flex;
  flex-direction: column;

  background: ${themeGet('colors.bgImageWidget')};
  border: 1px solid ${themeGet('colors.borderWidget')};
  border-radius: 12px;
  box-shadow: ${themeGet('shadows.section')};
  overflow: hidden;
  height: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    background: ${themeGet('colors.bgWidgetHeader')};
    border-bottom: 1px solid ${themeGet('colors.borderWidget')};
    padding: ${({ $titleOnEdit }) =>
      $titleOnEdit ? '.4rem 1rem .4rem 1.6rem' : '.8rem 1rem .8rem 2rem'};
    height: ${WIDGET_CONFIG.headerHeight}px;

    .left-wrapper {
      display: inline-flex;
      align-items: center;

      .title {
        flex-shrink: 0;
        font-size: ${themeGet('fontSizes.s5')};
      }
    }

    .right-wrapper {
      display: flex;
      align-items: center;
      gap: 6px;

      .wrap {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: ${themeGet('colors.bgWidgetHeaderWrap')};
        width: 80px;
        height: ${WIDGET_CONFIG.headerHeight}px;
        // box-shadow: -5px -3px 0px 3px ${themeGet('colors.bgWidgetHeader')};
        // border: 2px solid ${themeGet('colors.borderWidget')};
        border-radius: 8px 0 0 0;
        transform: skew(-23deg) translate(73px, 0px);
      }
    }
  }

  .content {
    position: relative;
    flex-grow: 1;
    padding: 6px ${WIDGET_CONFIG.contentPadding / 2}px;
    min-height: 1px;
    height: 100%;
    overflow: auto;

    .simplebar-content {
      height: 100%;
    }

    .thumbnail-wrapper {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    .widget-size {
      color: #b7b7b7;
      padding: 0 2rem;
      font-size: 16px;
    }
  }
`;

export default WidgetCard;
