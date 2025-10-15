import { App } from 'antd';
import styled, { useTheme } from 'styled-components';
import SyncButton from '@/components/buttons/SyncButton';
import SingleTrendLinChart from '@/components/charts/SingleTrendLinChart';
import { useGetCurrentCallTrendQuery } from '@/services/api/telephoneExchange';

const CurrentCallTab = () => {
  const { message } = App.useApp();
  const theme = useTheme();
  const {
    data: currentCallTrend,
    isLoading,
    refetch,
  } = useGetCurrentCallTrendQuery();

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
            currentCallTrend?.liveCallTrend.map(item => ({
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
            currentCallTrend?.liveCallTrend.map(item => ({
              label: item.collectDateTime,
              value: item.sip,
            })) || []
          }
          xAxisLabel="일시"
          yAxisLabel="SIP간 전체"
          color={theme.colors.series[1]}
        />
        <SingleTrendLinChart
          source={
            currentCallTrend?.liveCallTrend.map(item => ({
              label: item.collectDateTime,
              value: item.regSendOut,
            })) || []
          }
          xAxisLabel="일시"
          yAxisLabel="국선발신(사업자)"
          color={theme.colors.series[2]}
        />
        <SingleTrendLinChart
          source={
            currentCallTrend?.liveCallTrend.map(item => ({
              label: item.collectDateTime,
              value: item.regSendIn,
            })) || []
          }
          xAxisLabel="일시"
          yAxisLabel="국선착신(사업자)"
          color={theme.colors.series[3]}
        />
        <SingleTrendLinChart
          source={
            currentCallTrend?.liveCallTrend.map(item => ({
              label: item.collectDateTime,
              value: item.regRecvOut,
            })) || []
          }
          xAxisLabel="일시"
          yAxisLabel="국선발신(GW연결)"
          color={theme.colors.series[4]}
        />
        <SingleTrendLinChart
          source={
            currentCallTrend?.liveCallTrend.map(item => ({
              label: item.collectDateTime,
              value: item.regRecvIn,
            })) || []
          }
          xAxisLabel="일시"
          yAxisLabel="국선착신(GW연결)"
          color={theme.colors.series[5]}
        />
        <SingleTrendLinChart
          source={
            currentCallTrend?.liveCallTrend.map(item => ({
              label: item.collectDateTime,
              value: item.regOptOut,
            })) || []
          }
          xAxisLabel="일시"
          yAxisLabel="국선발신(기타)"
          color={theme.colors.series[6]}
        />
        <SingleTrendLinChart
          source={
            currentCallTrend?.liveCallTrend.map(item => ({
              label: item.collectDateTime,
              value: item.regOptIn,
            })) || []
          }
          xAxisLabel="일시"
          yAxisLabel="국선착신(기타)"
          color={theme.colors.series[7]}
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

export default CurrentCallTab;
