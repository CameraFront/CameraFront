import { App } from 'antd';
import styled, { useTheme } from 'styled-components';
import SyncButton from '@/components/buttons/SyncButton';
import SingleTrendLinChart from '@/components/charts/SingleTrendLinChart';
import { useGetCallPeakTrendQuery } from '@/services/api/telephoneExchange';

const CallPeakTab = () => {
  const { message } = App.useApp();
  const theme = useTheme();
  const {
    data: callPeakTrend,
    isLoading,
    refetch,
  } = useGetCallPeakTrendQuery();

  const onSync = async () => {
    await refetch();
    message.success('최신 데이터로 업데이트되었습니다.');
  };

  return (
    <Wrapper>
      <div className="header">
        <SyncButton
          isLoading={isLoading}
          disabled={isLoading}
          onClick={onSync}
        />
      </div>
      <div className="charts">
        <SingleTrendLinChart
          source={
            callPeakTrend?.callPeakTrend.map(item => ({
              label: item.collectDateTime,
              value: item.total,
            })) || []
          }
          xAxisLabel="일시"
          yAxisLabel="전체"
          color={theme.colors.series[0]}
        />
        <SingleTrendLinChart
          source={
            callPeakTrend?.callPeakTrend.map(item => ({
              label: item.collectDateTime,
              value: item.outbound,
            })) || []
          }
          xAxisLabel="일시"
          yAxisLabel="발신"
          color={theme.colors.series[1]}
        />
        <SingleTrendLinChart
          source={
            callPeakTrend?.callPeakTrend.map(item => ({
              label: item.collectDateTime,
              value: item.inbound,
            })) || []
          }
          xAxisLabel="일시"
          yAxisLabel="수신"
          color={theme.colors.series[2]}
        />
        <SingleTrendLinChart
          source={
            callPeakTrend?.callPeakTrend.map(item => ({
              label: item.collectDateTime,
              value: item.tandem,
            })) || []
          }
          xAxisLabel="일시"
          yAxisLabel="중계"
          color={theme.colors.series[3]}
        />
        <SingleTrendLinChart
          source={
            callPeakTrend?.callPeakTrend.map(item => ({
              label: item.collectDateTime,
              value: item.internal,
            })) || []
          }
          xAxisLabel="일시"
          yAxisLabel="내선"
          color={theme.colors.series[4]}
        />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1.6rem;

    margin-bottom: 8px;
  }

  .charts {
    /* margin-top: 1.6rem; */
  }
`;

export default CallPeakTab;
