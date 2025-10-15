import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { useGetLatestTemperatureDataQuery } from '@/services/api/common';
import { YEAR_DATE_TIME_FORMAT } from '@/config';

const NmsStatus = () => {
  const { data: temperatureData, isLoading } = useGetLatestTemperatureDataQuery(
    undefined,
    {
      pollingInterval: 5 * 60 * 1000,
    },
  );

  const [time, setTime] = useState(() => dayjs().format(YEAR_DATE_TIME_FORMAT));

  useEffect(() => {
    const updateClock = () => {
      setTime(dayjs().format(YEAR_DATE_TIME_FORMAT));
    };

    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) return null;

  return (
    <Wrapper>
      <div className="time" style={{ fontWeight: '500' }}>
        <span>{time}</span>
      </div>
      <div className="location">
        <span>서버실</span>
      </div>
      <div className="temp-hum" style={{ marginRight: '0' }}>
        <span>
          온도 :&nbsp;
          <p style={{ color: '#F7941D' }}>
            {temperatureData?.temperatureData.temperature}
          </p>
          °C 습도 :&nbsp;
          <p style={{ color: '#1CB0E7' }}>
            {temperatureData?.temperatureData.humidity}
          </p>
          %
        </span>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  .time,
  .location,
  .temp-hum {
    background-color: ${themeGet('colors.bgWidget')};
    border-radius: 4px;
    border: 1px solid ${themeGet('colors.borderWidget')};
    font-size: 18px;
    padding: 6px 8px;
    line-height: 1;
    margin-right: 12px;
    white-space: nowrap;
    
    span {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

`;

export default NmsStatus;
