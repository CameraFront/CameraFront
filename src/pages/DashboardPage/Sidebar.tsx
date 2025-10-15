import SimpleBar from 'simplebar-react';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';
import themeGet from '@styled-system/theme-get';
import { useAppDispatch } from '@/app/hooks';
import { setDroppingItem } from '@/features/dashboardPage/dashboardSlice';
import { useGetDefaultWidgetListQuery } from '@/services/api/dashboard';
import { WidgetGroup, WidgetType } from '@/types/enum';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { data: defaultWidgets } = useGetDefaultWidgetListQuery();

  if (!defaultWidgets) return null;

  return (
    <Wrapper>
      <div className="header">
        <div className="title">위젯 추가하기</div>
      </div>
      <div className="content">
        <div className="widget-group">
          <div className="group-label">장애</div>
          <div className="items">
            {defaultWidgets.map(widget => {
              if (widget.group !== WidgetGroup.Issue) return null;
              return (
                <div
                  key={widget.title}
                  className="item droppable-element"
                  draggable
                  // eslint-disable-next-line react/no-unknown-property
                  unselectable="on"
                  onDragStart={e => {
                    e.dataTransfer.setData('text/plain', '');
                    dispatch(
                      setDroppingItem({
                        i: widget.title,
                        ...widget.dimension,
                      }),
                    );
                  }}
                >
                  <PlusOutlined className="icon-plus" />
                  <span>{widget.title}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="widget-group">
          <div className="group-label">운영</div>
          <div className="items">
            {defaultWidgets.map(widget => {
              if (widget.group !== WidgetGroup.Operation) return null;

              return (
                <div
                  key={widget.title}
                  className="item droppable-element"
                  draggable
                  // eslint-disable-next-line react/no-unknown-property
                  unselectable="on"
                  onDragStart={e => {
                    e.dataTransfer.setData('text/plain', '');
                    dispatch(
                      setDroppingItem({
                        i: widget.title,
                        ...widget.dimension,
                      }),
                    );
                  }}
                >
                  <PlusOutlined className="icon-plus" />
                  <span>{widget.title}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="widget-group">
          <div className="group-label">성능</div>
          <div className="items">
            {defaultWidgets.map(widget => {
              if (widget.group !== WidgetGroup.Performance) return null;

              return (
                <div
                  key={widget.title}
                  className="item droppable-element"
                  draggable
                  // eslint-disable-next-line react/no-unknown-property
                  unselectable="on"
                  onDragStart={e => {
                    e.dataTransfer.setData('text/plain', '');
                    dispatch(
                      setDroppingItem({
                        i: widget.title,
                        ...widget.dimension,
                      }),
                    );
                  }}
                >
                  <PlusOutlined className="icon-plus" />
                  <span>{widget.title}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* <div className="widget-group">
          <div className="group-label">교환기</div>
          <div className="items">
            {defaultWidgets.map(widget => {
              if (widget.group !== WidgetGroup.TelephoneExchange) return null;

              return (
                <div
                  key={widget.title}
                  className="item droppable-element"
                  draggable
                  // eslint-disable-next-line react/no-unknown-property
                  unselectable="on"
                  onDragStart={e => {
                    e.dataTransfer.setData('text/plain', '');
                    dispatch(
                      setDroppingItem({
                        i: widget.title,
                        ...widget.dimension,
                      }),
                    );
                  }}
                >
                  <PlusOutlined className="icon-plus" />
                  <span>{widget.title}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="widget-group">
          <div className="group-label">기타</div>
          <div className="items">
            {defaultWidgets.map(widget => {
              if (widget.group !== WidgetGroup.Etc) return null;

              return (
                <div
                  key={widget.title}
                  className="item droppable-element"
                  draggable
                  // eslint-disable-next-line react/no-unknown-property
                  unselectable="on"
                  onDragStart={e => {
                    e.dataTransfer.setData('text/plain', '');
                    dispatch(
                      setDroppingItem({
                        i: widget.title,
                        ...widget.dimension,
                      }),
                    );
                  }}
                >
                  <PlusOutlined className="icon-plus"/>
                  <span>{widget.title}</span>
                </div>
              );
            })}
          </div>
        </div> */}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled(SimpleBar)`
  align-self: flex-start;
  flex: 0 0 20rem;

  .header {
    padding: 0.4rem 0.8rem;
    margin-bottom: 0rem;

    .title {
      font-size: ${themeGet('fontSizes.s4')};
      font-weight: ${themeGet('fontWeights.medium')};
    }
  }

  .content {
    .widget-group {
      margin: 0.8rem 0;

      .group-label {
        font-size: ${themeGet('fontSizes.s2')};
        color: ${themeGet('colors.textSub')};
        margin-bottom: 4px;
        padding-left: 1rem;
      }

      .items {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .item {
          display: flex;
          align-items: center;
          gap: 4px;

          padding-left: 0.8rem;
          height: 35px;
          border-radius: ${themeGet('borderRadius.normal')};
          
          background-color: ${themeGet('colors.bgSection')};

          .anticon {
            color: ${themeGet('colors.textTableDevice')};
          }
          &:hover {
            background-color: ${themeGet('colors.bgTreeItemSelected')};
            color: ${themeGet('colors.bgItemSelected')};
            cursor: move;
            cursor: grab;
          }

          &:active {
            cursor: grabbing;
          }

          .icon-plus {
            font-size: ${themeGet('fontSizes.s2')};
          }
        }
      }
    }
  }
`;

export default Sidebar;
