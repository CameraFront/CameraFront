import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { App, Button, Flex, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { CloseOutlined, RightOutlined } from '@ant-design/icons';
import CriticalEventModal from '@/components/CriticalEventModal';
import EventDot from '@/components/EventDot';
import { EventMessageData } from '@/types/common';
import { EventLv } from '@/types/enum';
import soundImportant from '@/assets/audios/mixkit-sci-fi-error-alert-898.wav';
import soundMinor from '@/assets/audios/mixkit-shaker-bell-alert-599.mp3';
import soundUrgent from '@/assets/audios/mixkit-synth-mechanical-notification-or-alert-650.wav';
import { MAX_MESSAGES } from '@/config/constants';
import { ROUTES } from '@/config/routes';
import { useAppSelector } from '@/app/hooks';

const cleanupAudio = (audio: HTMLAudioElement | null) => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};

interface UseWebSocketAlertProps {
  isAlarmOn: boolean;
  isAudibleOn: boolean;
  isDarkMode: boolean;
  isAlarmPopupOn: boolean;
  onMessage?: (message: EventMessageData) => void;
}

export const useWebSocketAlert = ({
  isAlarmOn,
  isAudibleOn,
  isDarkMode,
  isAlarmPopupOn = false,
  onMessage,
}: UseWebSocketAlertProps) => {  
  const { user } = useAppSelector(store => store.global);
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<EventMessageData[]>([]);

  // 메시지 초기화 콜백 메모이제이션
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // 마지막 메시지 메모이제이션
  const lastMessage = useMemo(() => messages[messages.length - 1], [messages]);
  
const filteredMessage = useMemo(() => {
  if (!lastMessage) return null;

  if (user?.global.topicType == 0 || lastMessage.topicType == user?.global.topicType) {
    return lastMessage; // 조건에 맞는 메시지 반환
  }

  // 조건에 맞지 않으면 null 또는 다른 처리
  return null;
}, [lastMessage, user?.global?.topicType]);
  
  // 웹소켓 옵션 메모이제이션
  const webSocketOptions = useMemo(
    () => ({
      onOpen: () => {
        console.info('WebSocket connection established.');
      },
      shouldReconnect: () => isAlarmOn || isAlarmPopupOn,
    }),
    [isAlarmOn, isAlarmPopupOn],
  );

  // 웹소켓 연결
  const { lastJsonMessage } = useWebSocket<EventMessageData>(
    import.meta.env.VITE_APP_API_WS,
    webSocketOptions,
  );

  // 알림 컨텐츠 생성
  const getNotificationContent = useCallback(
    (message: EventMessageData) => {
      const eventType =
        message.eventLevel === EventLv.Urgent
          ? 'urgent'
          : message.eventLevel === EventLv.Important
            ? 'important'
            : 'minor';

      return {
        message: (
          <Space className="event-title">
            <EventDot type={eventType} isInverted={!isDarkMode} />
            <span className="event-title__text">{message.deviceNm}</span>
          </Space>
        ),
        description: (
          <Flex justify="space-between" align="center">
            {/* <span>{message.eventCdNm}({dayjs(message.ocDate).fromNow()})</span> */}
            <Button
              type="text"
              className="btn-more"
              onClick={() => navigate(ROUTES.EVENTS)}
            >
              <Typography.Link>
                <span>자세히 보기</span>
                <RightOutlined />
              </Typography.Link>
            </Button>
          </Flex>
        ),
      };
    },
    [isDarkMode, navigate],
  );

  // 긴급장애 모달 렌더링
  const renderCriticalEventModal = useCallback(() => {
    if (!isAlarmPopupOn || !lastMessage?.popup) return null;

    return (
      <Modal
        centered
        width={1100}
        open={!!lastMessage.popup}
        onCancel={clearMessages}
        footer={null}
        destroyOnClose
        styles={{ body: { height: '480px', overflow: 'hidden' } }}
        className="event-modal"
        closeIcon={<CloseOutlined style={{ fontSize: 24 }} />}
      >
        <CriticalEventModal data={lastMessage} onCloseModal={clearMessages} />
      </Modal>
    );
  }, [lastMessage, isAlarmPopupOn, clearMessages]);

  // 알림 처리 (디바운스된 메시지 업데이트 포함)
  useEffect(() => {
    if (!lastMessage
        || (user?.global.topicType !== 0 && lastMessage.topicType !== user?.global.topicType)
    ) return;

    // 알림음 설정
    const alertSound =
      lastMessage.eventLevel === EventLv.Urgent
        ? soundUrgent
        : lastMessage.eventLevel === EventLv.Important
          ? soundImportant
          : soundMinor;
    const alertAudio = new Audio(alertSound);

    // 가청 알람이 켜져있으면 소리 재생
    if ((isAlarmOn || isAlarmPopupOn) && isAudibleOn) alertAudio.play();

    // 알람이 켜져있으면 알림 표시
    if (isAlarmOn) {
      const notificationContent = getNotificationContent(lastMessage);
      const eventType =
        lastMessage.eventLevel === EventLv.Urgent
          ? 'urgent'
          : lastMessage.eventLevel === EventLv.Important
            ? 'important'
            : 'minor';
      notification.open({
        duration: 10,
        placement: 'bottomRight',
        className: `event-notification ${eventType}`,
        onClose: () => {
          alertAudio.pause();
        },
        ...notificationContent,
      });
    }

    // 메시지 콜백 실행
    onMessage?.(lastMessage);
    // 클린업: 오디오 정지
    return () => {
      cleanupAudio(alertAudio);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lastMessage,
    isAlarmOn,
    isAudibleOn,
    getNotificationContent,
    notification,
    isAlarmPopupOn,
  ]);

  // 웹소켓 메시지 저장 (디바운스 적용)
  useEffect(() => {
    if (!lastJsonMessage) return;

    const timeoutId = setTimeout(() => {
      setMessages(prev => {
        const newMessages = [...prev, lastJsonMessage];
        // 최대 메시지 수 제한
        return newMessages.slice(-MAX_MESSAGES);
      });
    }, 100); // 빠른 업데이트 방지를 위한 디바운스

    return () => clearTimeout(timeoutId);
  }, [lastJsonMessage]);

  useEffect(() => {
    setMessages([]);
  }, [isAlarmPopupOn, isAlarmOn]);

  return {
    messages,
    lastMessage,
    clearMessages,
    renderCriticalEventModal,
  };
};
