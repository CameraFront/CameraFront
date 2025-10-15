import { useCallback } from 'react';
import { Divider, Progress } from 'antd';
import styled, { useTheme } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useGetEnvironmentalFactorsDataQuery } from '@/services/api/dashboard';
import { EnvironmentalFactorsWidgetData } from '@/types/api/dashboard';

type Props = {
  data: EnvironmentalFactorsWidgetData;
};

const EnvironmentalFactors = ({ data }: Props) => {
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetEnvironmentalFactorsDataQuery(
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

  const valueFormat = useCallback(
    (value: number, unit: string) => (
      <div>
        <span className="value">{value || 0}</span>
        <span className="unit">{unit}</span>
      </div>
    ),
    [],
  );

  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper>
        <div className="col">
          <div className="title">온도</div>
          <Progress
            size={95}
            type="circle"
            percent={widgetData?.temperatureData.temperature}
            format={percent => valueFormat(percent || 0, '℃')}
            strokeColor={theme.colors.temperature}
          />
        </div>
        <Divider type="vertical" className="divider" />
        <div className="col">
          <div className="title">습도</div>
          <Progress
            size={95}
            type="circle"
            percent={widgetData?.temperatureData.humidity}
            format={percent => valueFormat(percent || 0, '%')}
            strokeColor={theme.colors.humidity}
          />
        </div>
      </Wrapper>
    </LoadingSpinner>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  .title {
    margin-bottom: 4px;
    text-align: center;
    font-size: ${themeGet('fontSizes.s4')};
    /* font-weight: ${themeGet('fontWeights.medium')}; */
  }

  .divider {
    height: 60%;
  }

  .value {
    font-size: ${themeGet('fontSizes.s7')};
    font-weight: ${themeGet('fontWeights.bold')};
  }
`;

export default EnvironmentalFactors;
