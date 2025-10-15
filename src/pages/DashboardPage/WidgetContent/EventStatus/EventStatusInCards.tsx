import { useCallback, useEffect, useMemo } from 'react';
import { Carousel, Skeleton, Typography } from 'antd';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import EventDot from '@/components/EventDot';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useAppSelector } from '@/app/hooks';
import { useLazyGetEventStatusDataQuery } from '@/services/api/dashboard';
import { EventStatusWidgetData } from '@/types/api/dashboard';
import { EventTypeEn } from '@/types/common';

const { Text } = Typography;

type Props = {
  data: EventStatusWidgetData;
};

interface SourceItem {
  id: string;
  eventType: EventTypeEn;
  title: string;
  subTitle: string;
  details: string;
  dateTime: string;
}

const EventStatusInCards = ({ data }: Props) => {
  const { isFullScreenMode } = useAppSelector(store => store.dashboard);

  const [getEventStatusData, { data: widgetData, isError, isLoading }] =
    useLazyGetEventStatusDataQuery({
      pollingInterval: data.options.updateInterval * 1000,
    });

  useEffect(() => {
    getEventStatusData({
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
      deviceTypes: data.options.deviceTypes,
      eventTypes: data.options.eventTypes,
    });
  }, [
    data.apiUrl,
    data.id,
    data.type,
    getEventStatusData,
    data.options.deviceTypes,
    data.options.eventTypes,
  ]);

  const dataSource: SourceItem[] = useMemo(() => {
    if (!widgetData) return [];

    return widgetData.faultList.map(el => ({
      id: el.eventKey.toString(),
      eventType: el.eventNm,
      title: el.deviceNm,
      subTitle: el.pstnNm ?? '',
      details: el.eventMsg,
      dateTime: el.ocDate,
    }));
  }, [widgetData]);

  const handleSwipe = useCallback(
    (current: number) => {
      getEventStatusData({
        apiUrl: data.apiUrl,
        type: data.type,
        id: data.id,
        deviceTypes: data.options.deviceTypes,
        eventTypes: data.options.eventTypes,
        page: current + 1,
      });
    },
    [
      data.apiUrl,
      data.id,
      data.type,
      getEventStatusData,
      data.options.deviceTypes,
      data.options.eventTypes,
    ],
  );

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  return (
    <Wrapper $isFullScreenMode={isFullScreenMode}>
      {!dataSource.length ? (
        <ErrorMessage>현재 미처리 장애가 존재하지 않습니다.</ErrorMessage>
      ) : (
        <Carousel afterChange={handleSwipe} autoplay autoplaySpeed={5000}>
          {Array(widgetData.page.totalPage)
            .fill(null)
            .map((_el, i) =>
              i + 1 === widgetData.page.page ? (
                // eslint-disable-next-line react/no-array-index-key
                <div className="slide" key={`slide${i}`}>
                  {dataSource.map(item => (
                    <Item
                      className="item"
                      key={item.id}
                      $eventType={item.eventType}
                      $isFullScreenMode={isFullScreenMode}
                    >
                      <div className="dot-wrapper">
                        <EventDot
                          size="medium"
                          type={item.eventType}
                          isInverted
                        />
                      </div>
                      <div className="blank" />
                      <Text ellipsis className="title" title={item.title}>
                        {item.title}
                      </Text>
                      {/* <Text ellipsis className="subTitle" title={item.subTitle}>
                        {item.subTitle}
                      </Text> */}
                      <Text className="details" ellipsis title={item.details}>
                        {item.details}
                      </Text>
                      {/* <Text ellipsis className="dateTime" title={item.dateTime}>
                        {dayjs(item.dateTime).fromNow()}
                      </Text> */}
                    </Item>
                  ))}
                </div>
              ) : (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`slide${i}`}>
                  {Array(widgetData.page.rows)
                    .fill(null)
                    .map((el, i) => (
                      <Skeleton.Button
                        active={isLoading}
                        // eslint-disable-next-line react/no-array-index-key
                        key={`slide${i}`}
                        shape="square"
                        block
                        size="large"
                        style={{
                          height: isFullScreenMode ? 72.3 : 56.85,
                          marginBottom: isFullScreenMode ? 10 : 6,
                        }}
                      />
                    ))}
                </div>
              ),
            )}
        </Carousel>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $isFullScreenMode: boolean }>`
  width: 100%;
  height: 100%;
  padding: 8px 6px;

  .slide {
    display: flex !important;
    flex-direction: column;
    gap: ${({ $isFullScreenMode }) => ($isFullScreenMode ? '10px' : '6px')};
  }

  .slick-dots {
    li {
      width: 1rem;
      margin: 0 4px;

      button {
        background-color: ${themeGet('colors.primary')};
        height: 1rem;
        border-radius: 5px;
      }

      &.slick-active button {
        background-color: ${themeGet('colors.primary')};
        width: 100%;
      }
    }
  }

  .slick-dots-bottom {
    position: relative;
    margin: ${({ $isFullScreenMode }) => ($isFullScreenMode ? '30px' : '10px')}
      auto 1rem;
    bottom: 0;
  }
`;

const Item = styled.div<{ $eventType: string; $isFullScreenMode: boolean }>`
  display: grid;
  grid-template-columns: 5% 95%;
  grid-template-rows: 1fr 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;

  border: 1px solid
    ${({ $eventType }) => themeGet(`colors.border.${$eventType}`)};
  border-radius: ${themeGet('borderRadius.normal')};
  background-color: ${({ $eventType }) =>
    themeGet(`colors.bg.${$eventType}`)}40;
  padding: ${({ $isFullScreenMode }) =>
    $isFullScreenMode ? '1rem 1.6rem' : '0.6rem 1.6rem'};
  /* margin-bottom: 6px; */
  /* min-height: 20%; */

  .dot-wrapper {
    grid-area: 1 / 1 / 2 / 2;

    .dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;

      background-color: ${({ $eventType }) =>
        themeGet(`colors.darker.${$eventType}`)};
    }
  }
  .blank {
    grid-area: 2 / 1 / 3 / 2;
    line-height: 1.5;
  }

  .title {
    grid-area: 1 / 2 / 2 / 2;

    color: ${themeGet('colors.textMain')};
    font-weight: 500;
    font-size: ${({ $isFullScreenMode }) =>
      $isFullScreenMode ? '1.6rem' : '1.4rem'};

    padding: 0 0.5rem;
  }
  .subTitle {
    grid-area: 2 / 2 / 3 / 3;

    font-size: ${({ $isFullScreenMode }) =>
      $isFullScreenMode ? '1.4rem' : '1.2rem'};
  }

  .details {
    /* justify-self: end; */
    grid-area: 2 / 2 / 2 / 2;

    color: ${themeGet('colors.textMain')};
    font-weight: 300;
    font-size: ${({ $isFullScreenMode }) =>
      $isFullScreenMode ? '1.4rem' : '1.2rem'};

    padding: 0 0.5rem;
  }

  .dateTime {
    justify-self: end;
    grid-area: 2 / 3 / 3 / 4;

    color: ${themeGet('colors.textSub')};
    font-size: ${({ $isFullScreenMode }) =>
      $isFullScreenMode ? '1.4rem' : '1.2rem'};
  }
`;

export default EventStatusInCards;
