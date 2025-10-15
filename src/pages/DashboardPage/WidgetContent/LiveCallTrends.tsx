import styled, { useTheme } from 'styled-components';
import LoadingSpinner from '@/components/LoadingSpinner';
import TagLabel from '@/components/TagLabel';
import VerticalBarChart from '@/components/charts/VerticalBarChart';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useWidgetHeightContext } from '@/features/dashboardPage/widget-height/use-widget-height-context';
import { useGetLiveCallTrendsDataQuery } from '@/services/api/dashboard';
import { LiveCallTrendsWidgetData } from '@/types/api/dashboard';
import { LiveCallType } from '@/types/enum';
import LiveCallTrendBarChart from '@/components/charts/LiveCallTrendBarChart';

interface Props {
  data: LiveCallTrendsWidgetData;
}
const LEGEND_HEIGHT = 22;
const LiveCallTrends = ({ data }: Props) => {
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetLiveCallTrendsDataQuery(
    {
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
    },
    {
      pollingInterval: data.options.updateInterval * 1000,
    },
  );
  const theme = useTheme();

  const { getChartHeightByH } = useWidgetHeightContext();

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  const { callTypes } = data.options;
  const dataset = {
    dimensions: callTypes.map(el => LiveCallType[el]),
    source: [
      ...(callTypes.includes(LiveCallType.전체)
        ? [
            {
              name: LiveCallType[LiveCallType.전체] as string,
              value: widgetData.total,
            },
          ]
        : []),
      ...(callTypes.includes(LiveCallType['SIP통화'])
        ? [
            {
              name: LiveCallType[LiveCallType['SIP통화']] as string,
              value: widgetData.sip,
            },
          ]
        : []),
      // ...(callTypes.includes(LiveCallType['국선발신(사업자)'])
      //   ? [
      //       {
      //         name: LiveCallType[LiveCallType['국선발신(사업자)']] as string,
      //         value: widgetData.regSendOut,
      //       },
      //     ]
      //   : []),
      // ...(callTypes.includes(LiveCallType['국선착신(사업자)'])
      //   ? [
      //       {
      //         name: LiveCallType[LiveCallType['국선착신(사업자)']] as string,
      //         value: widgetData.regSendIn,
      //       },
      //     ]
      //   : []),
      ...(callTypes.includes(LiveCallType['GW발신'])
        ? [
            {
              name: LiveCallType[LiveCallType['GW발신']] as string,
              value: widgetData.regRecvOut,
            },
          ]
        : []),
      ...(callTypes.includes(LiveCallType['GW착신'])
        ? [
            {
              name: LiveCallType[LiveCallType['GW착신']] as string,
              value: widgetData.regRecvIn,
            },
          ]
        : []),
      ...(callTypes.includes(LiveCallType['SIP 발신'])
        ? [
            {
              name: LiveCallType[LiveCallType['SIP 발신']] as string,
              value: widgetData.regOptOut,
            },
          ]
        : []),
      ...(callTypes.includes(LiveCallType['SIP 착신'])
        ? [
            {
              name: LiveCallType[LiveCallType['SIP 착신']] as string,
              value: widgetData.regOptIn,
            },
          ]
        : []),
    ],
  };

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper>
        <div className="date-label">
          <TagLabel>{widgetData.collectDateTime}</TagLabel>
        </div>
        <LiveCallTrendBarChart
          dataset={dataset}
          colors={theme.colors.series}
          height={`${getChartHeightByH(data.dimension.h) - LEGEND_HEIGHT}px`}
          minHeight={`${getChartHeightByH(data.dimension.h) - LEGEND_HEIGHT}px`}
        />
      </Wrapper>
    </LoadingSpinner>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  .date-label {
    display: grid;
    place-items: center;
  }

  .legends {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

export default LiveCallTrends;
