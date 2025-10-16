import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Space } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAppSelector } from '@/app/hooks';
import { CriticalEvent, EventMessageData } from '@/types/common';
import { ROUTES } from '@/config/routes';
import EventDot from './EventDot';

interface Props {
  data: EventMessageData | undefined;
  onCloseModal: () => void;
}

const CriticalEventModal = ({ data, onCloseModal }: Props) => {
  const { isLoading } = useAppSelector(store => store.settings);
  const { isDarkMode, user } = useAppSelector(store => store.global);

  const [eventDatas, setEventDatas] = useState<CriticalEvent[]>([]);
  const navigate = useNavigate();

  const handleClose = (index: number) => {
    setEventDatas(prevEventDatas => {
      const updatedEventDatas = prevEventDatas.filter((_, i) => i !== index);

      if (updatedEventDatas.length === 0) {
        onCloseModal();
      }

      return updatedEventDatas;
    });
  };

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (eventDatas.length === 0) {
      onCloseModal();
    }
  }, [eventDatas, onCloseModal]);

  useEffect(() => {
    if (data) {
      if (
        eventDatas.length === 0 &&
        data.topicType !== user?.global.topicType
      ) {
        onCloseModal();
      }
    }
  }, [data, eventDatas, onCloseModal]);

  useEffect(() => {
    if (data) {
      if (
        user?.global.topicType == 0 ||
        data.topicType == user?.global.topicType
      ) {
        const newEvent = { ...data, id: Date.now() };
        setEventDatas(d => [newEvent, ...d]);

        const timeoutId = setTimeout(() => {
          setTimeout(() => {
            setEventDatas(data =>
              data.filter(event => event.id !== newEvent.id),
            );
          }, 300000);
        });

        return () => clearTimeout(timeoutId);
      }
    }
  }, [data]);

  return (
    <Wrapper>
      <LoadingSpinner spinning={isLoading}>
        <div className="header">
          <div className="title">긴급 장애 발생 현황</div>
        </div>
        <div
          className="event-body"
          style={{ overflow: 'auto', maxHeight: '460px' }}
        >
          {eventDatas.length > 0 ? (
            eventDatas.map((event, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="event" key={i}>
                <Flex justify="space-between" align="center">
                  <Space className="event-title">
                    <div className="dot-wrapper">
                      <EventDot type="urgent" size="xLarge" isInverted />
                    </div>
                    <span className="event-title__text">{event.deviceNm}</span>
                  </Space>
                  <img
                    src={`/assets/images/close-btn-icon${isDarkMode ? '__dark' : ''}.png`}
                    alt="button"
                    onClick={() => {
                      handleClose(i);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </Flex>
                <Flex justify="space-between" align="center">
                  <span className="event-oc-date">
                    {/* ({dayjs(event.ocDate).fromNow()}) */}
                    {event.eventCdNm}
                  </span>
                  <div
                    className="btn-more"
                    onClick={() => {
                      navigate(ROUTES.EVENTS);
                    }}
                  >
                    <span>자세히 보기</span>
                    <img
                      src="/assets/images/arrow-next-icon.png"
                      alt="button"
                    />
                  </div>
                </Flex>
              </div>
            ))
          ) : (
            <p>알람이 없습니다.</p>
          )}
        </div>
      </LoadingSpinner>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .header {
    .title {
      font-size: ${themeGet('fontSizes.s9')};
      font-weight: ${themeGet('fontWeights.medium')};
      padding-left: 0.5rem;
    }
  }

  .event-body {
    width: 100%;
    height: 100%;
    overflow: auto;

    .event {
      margin: 3rem 1.5rem;
      padding: 2rem 5rem 2.7rem 4rem;
      border: 3px solid ${themeGet('colors.urgent')};
      border-radius: 14px;
      background-color: ${themeGet('colors.bgCriticalEvent')};

      .event-title {
        padding-bottom: 1rem;

        .event-title__text {
          font-size: ${themeGet('fontSizes.s10')};
          color: ${themeGet('colors.urgent')};
          font-weight: 700;
          padding-left: 3rem;
        }
      }

      .event-oc-date {
        font-size: 30px;
        color: ${themeGet('colors.textDescriptionsContent')};
        padding: 1.5rem 0 0 6rem;
      }

      .btn-more {
        padding: 1.5rem 0 0 0;
        font-size: 30px;
        cursor: pointer;
        span {
          color: ${themeGet('colors.textMore')};
          padding-right: 2rem;
        }
      }
      img {
        padding-bottom: 0.5rem;
      }
    }
  }
`;

export default CriticalEventModal;
