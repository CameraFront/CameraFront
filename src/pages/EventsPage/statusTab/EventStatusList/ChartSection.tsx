import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import styled, { useTheme } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import DoughnutChart from '@/components/charts/DoughnutChart';
import HorizontalBarChart from '@/components/charts/HorizontalBarChart';
import HourlyEventsChart from '@/components/charts/HourlyEventsChart';
import Legend from '@/components/charts/Legend';
import {
  useGetDeviceRankingsByUnresolvedEventQuery,
  useGetNumOfUnresolvedEventsQuery,
  useGetTodayHourlyUnresolvedEventCountsQuery,
} from '@/services/api/events';
import { intIdSchema } from '@/services/validation/common';
import { eventsSearchParamsSchema } from '@/services/validation/events';
import { DATE_SHORT_FORMAT } from '@/config';

const ChartSection = () => {
  const [searchParams] = useSearchParams();
  // const { deviceType, eventTypes } = eventsSearchParamsSchema.parse(
  //   Object.fromEntries(searchParams),
  // );
  const { branchId } = useParams();
  const parsedBranchId = intIdSchema.safeParse(branchId);

  const { data: numOfEvents, isLoading: isNumOfEventsLoading } =
    useGetNumOfUnresolvedEventsQuery(
      {
        branchId: parsedBranchId.data,
      },
      {
        skip: !parsedBranchId.success,
      },
    );
  const { data: hourlyEventCounts, isLoading: isHourlyEventCountsLoading } =
    useGetTodayHourlyUnresolvedEventCountsQuery(
      {
        branchId: parsedBranchId.data,
      },
      {
        skip: !parsedBranchId.success,
      },
    );
  const { data: deviceRankings, isLoading: isDeviceRankingsLoading } =
    useGetDeviceRankingsByUnresolvedEventQuery(
      {
        branchId: parsedBranchId.data,
        // deviceType,
        // eventTypes,
      },
      {
        skip: !parsedBranchId.success,
      },
    );

  const theme = useTheme();

  const eventColors = [
    theme.colors.urgent,
    theme.colors.important,
    theme.colors.minor,
  ];

  const numOfEventsDataset = useMemo(
    () => ({
      dimensions: ['name', 'value'],
      source: [
        {
          name: '긴급',
          value: numOfEvents?.urgent || 0,
        },
        {
          name: '중요',
          value: numOfEvents?.important || 0,
        },
        {
          name: '일반',
          value: numOfEvents?.minor || 0,
        },
      ],
    }),
    [numOfEvents],
  );

  const eventTrendsDataset = useMemo(
    () => ({
      dimensions: ['시', '긴급', '중요', '일반', '전체'],
      source:
        hourlyEventCounts?.map(d => {
          const total = d.urgent + d.important + d.minor;
          return {
            시: d.Hour.toString(),
            긴급: d.urgent,
            중요: d.important,
            일반: d.minor,
            전체: total,
          };
        }) || [],
    }),
    [hourlyEventCounts],
  );

  const deviceEventRankingsSource = useMemo(
    () =>
      deviceRankings
        ?.map(el => ({
          name: el.deviceNm,
          value: el.total || 0,
        }))
        .reverse() || [],
    [deviceRankings],
  );

  return (
    <Wrapper className="row charts-row">
      <div className="col pie-chart">
        {numOfEvents && (
          <>
            <div className="title">등급별 미처리 장애 건수</div>
            <div className="chart-wrapper">
              <DoughnutChart
                centerText={numOfEvents.total.toString()}
                dataset={numOfEventsDataset}
                minHeight="130px"
                colors={eventColors}
                size="small"
              />
              <div className="legends">
                {numOfEventsDataset.source.map((item, i) => (
                  <Legend
                    key={item.name}
                    name={item.name}
                    color={eventColors[i]}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="col mixed-chart">
        {eventTrendsDataset && (
          <HourlyEventsChart
            title="당일 시간별 미처리 장애 발생 추이"
            minHeight="160px"
            dataset={eventTrendsDataset}
          />
        )}
      </div>
      <div className="col hbar-chart">
        {deviceEventRankingsSource && (
          <>
            <div className="title">미처리 장애 발생 장비 TOP5</div>
            <div className="chart-wrapper">
              <HorizontalBarChart
                // name="장애발생 장비 TOP5"
                // allowFloat={false}
                dataset={{
                  dimensions: ['name', 'value'],
                  source: deviceEventRankingsSource,
                }}
                minHeight="130px"
                colors={theme.colors.series.slice(0, 5).reverse()}
              />
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 22.5% 1fr 30%;
  column-gap: 1rem;

  .col {
    background-color: ${themeGet('colors.bgDescriptionsContent')};
    border-radius: ${themeGet('borderRadius.normal')};
    padding: 1rem;

    &.pie-chart {
      .title {
        font-size: ${themeGet('fontSizes.s4')};
        font-weight: ${themeGet('fontWeights.medium')};
        text-align: center;
        margin-bottom: 8px;
      }

      .chart-wrapper {
        display: grid;
        grid-template-columns: 70% 30%;
        align-items: center;

        .legends {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
      }
    }

    &.hbar-chart {
      .title {
        font-size: ${themeGet('fontSizes.s4')};
        font-weight: ${themeGet('fontWeights.medium')};
        text-align: center;
        margin-bottom: 8px;
      }
    }
  }
`;

export default ChartSection;
