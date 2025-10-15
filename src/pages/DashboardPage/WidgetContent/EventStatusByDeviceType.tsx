import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import GaugeChart from '@/components/charts/GaugeChart';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useGetEventStatusByDeviceTypeDataQuery } from '@/services/api/dashboard';
import { EventStatusByDeviceTypeWidgetData } from '@/types/api/dashboard';
import { NONE_SELECTED } from '@/config';
import EventDot from '@/components/EventDot';
import { Flex } from 'antd';

interface Props {
  data: EventStatusByDeviceTypeWidgetData;
}

const EventStatusByDeviceType = ({ data }: Props) => {
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetEventStatusByDeviceTypeDataQuery(
    {
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
      deviceType: data.options.deviceType,
      eventTypes: data.options.eventTypes,
    },
    {
      skip: data.options.deviceType === NONE_SELECTED,
    },
  );

  if (data.options.deviceType === NONE_SELECTED)
    return <ErrorMessage>장비 종류가 선택되지 않았습니다.</ErrorMessage>;
  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper>
        <div className='widget-header'>
          {/* <div className="title">{widgetData.deviceKindNm}</div>
          <div className="event-dot" style={{ display: 'flex', gap: '1rem'}}>
            {data.options.eventTypes.length < 3 && 
              data.options.eventTypes.map((event, i) => {
                if (event === 1)
                  return <EventDot key={i} type="urgent" size="large" hasText />;
                else if (event === 2)
                  return <EventDot key={i} type="important" size="large" hasText />;
                return <EventDot key={i} type="minor" size="large" hasText />;
              })
            }
          </div> */}
        </div>
        <GaugeChart
          value={widgetData.total}
          max={widgetData.managedDeviceCount}
          minHeight="130px"
        />
      </Wrapper>
    </LoadingSpinner>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  .widget-header {
    padding: 0;
    //margin-bottom: -2rem;
    display: flex;
    justify-content: space-between;
  }
`;

export default EventStatusByDeviceType;
