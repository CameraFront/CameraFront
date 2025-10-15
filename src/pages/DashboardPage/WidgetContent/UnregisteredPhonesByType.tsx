import styled from 'styled-components';
import themeGet from '@styled-system/theme-get';
import LoadingSpinner from '@/components/LoadingSpinner';
import GaugeChart from '@/components/charts/GaugeChart';
import ErrorMessage from '@/components/fallbacks/ErrorMessage';
import { useGetUnregisteredPhonesByTypeDataQuery } from '@/services/api/dashboard';
import { UnregisteredPhonesByTypeWidgetData } from '@/types/api/dashboard';
import { NONE_SELECTED } from '@/config';

interface Props {
  data: UnregisteredPhonesByTypeWidgetData;
}

const UnregisteredPhonesByType = ({ data }: Props) => {
  const {
    data: widgetData,
    isLoading,
    isError,
  } = useGetUnregisteredPhonesByTypeDataQuery(
    {
      apiUrl: data.apiUrl,
      type: data.type,
      id: data.id,
      phoneType: data.options.phoneType,
    },
    {
      skip: data.options.phoneType === NONE_SELECTED,
    },
  );

  if (data.options.phoneType === NONE_SELECTED)
    return <ErrorMessage>전화기 종류가 선택되지 않았습니다.</ErrorMessage>;
  if (isError) return <ErrorMessage />;
  if (!widgetData) return null;

  return (
    <LoadingSpinner spinning={isLoading}>
      <Wrapper>
        {/* <div className="title">{widgetData.phoneTypeNm}</div> */}
        <GaugeChart
          value={widgetData.unRegCount}
          max={widgetData?.managedCnt}
          minHeight="130px"
        />
      </Wrapper>
    </LoadingSpinner>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  .title {
    position: absolute;
    font-size: ${themeGet('fontSizes.s4')};
    font-weight: ${themeGet('fontWeights.medium')};
  }
`;

export default UnregisteredPhonesByType;
