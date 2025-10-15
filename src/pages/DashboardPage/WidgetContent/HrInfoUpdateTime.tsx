import dayjs from 'dayjs';
import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useGetHrInfoUpdateTimeDataQuery } from '@/services/api/dashboard';
import { HrInfoUpdateTimeWidgetData } from '@/types/api/dashboard';

interface Props {
  data: HrInfoUpdateTimeWidgetData;
}

const HrInfoUpdateTime = ({ data }: Props) => {
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetHrInfoUpdateTimeDataQuery(
    {
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
    },
    {
      pollingInterval: data.options.updateInterval * 1000,
    },
  );

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper>
        <div className='time-wrapper'>
          <span>정보업데이트</span>
          <span>{widgetData.hrUpdateTimeData.hrUpdateDateTime}</span>
        </div>
        <div className='time-wrapper'>
          <span>프리미엄CID</span>
         {widgetData.ezUpdateTimeData.ezUpdateDateTime}
        </div>
      </Wrapper>
    </LoadingSpinner>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 2.2rem;
  font-weight: ${themeGet('fontWeights.medium')};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .time-wrapper {
    display: flex;
    gap: 10px;
  }
`;

export default HrInfoUpdateTime;
