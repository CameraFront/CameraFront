import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import styled, { useTheme } from 'styled-components';
import themeGet from '@styled-system/theme-get';
import DailyEventsChart from '@/components/charts/DailyEventsChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import HourlyEventsChart from '@/components/charts/HourlyEventsChart';
import Legend from '@/components/charts/Legend';
import {
  useGetDailyEventCountsByDateRangeQuery,
  useGetNumOfEventsQuery,
  useGetTodayHourlyEventCountsQuery,
} from '@/services/api/events';
import { intIdSchema } from '@/services/validation/common';
import { eventsSearchParamsSchema } from '@/services/validation/events';
import { DATE_SHORT_FORMAT } from '@/config';

const ChartSection = () => {
  const [searchParams] = useSearchParams();
  const { fromDate, toDate } = eventsSearchParamsSchema.parse(
    Object.fromEntries(searchParams),
  );
  const { deviceId } = useParams();
  const parsedDeviceId = intIdSchema.safeParse(deviceId);
  const { data: numOfEvents, isLoading: isNumOfEventsLoading } =
    useGetNumOfEventsQuery(
      {
        deviceId: parsedDeviceId.data,
      },
      {
        skip: !parsedDeviceId.success,
      },
    );
  const { data: hourlyEventCounts, isLoading: isHourlyEventCountsLoading } =
    useGetTodayHourlyEventCountsQuery(
      {
        deviceId: parsedDeviceId.data,
      },
      {
        skip: !parsedDeviceId.success,
      },
    );

  const { data: dailyEventCounts, isLoading: isDailyEventCountsLoading } =
    useGetDailyEventCountsByDateRangeQuery(
      {
        deviceId: parsedDeviceId.data,
        fromDate,
        toDate,
      },
      {
        skip: !parsedDeviceId.success,
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

  const hourlyEventTrendsDataset = useMemo(
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

  const dailyEventTrendsDataset = useMemo(
    () => ({
      dimensions: ['일자', '긴급', '중요', '일반', '전체'],
      source:
        dailyEventCounts?.map(d => {
          const total = d.urgent + d.important + d.minor;
          return {
            일자: dayjs(d.Day).format(DATE_SHORT_FORMAT),
            긴급: d.urgent,
            중요: d.important,
            일반: d.minor,
            전체: total,
          };
        }) || [],
    }),
    [dailyEventCounts],
  );

  return (
    <Wrapper className="row charts-row">
      <div className="col pie-chart">
        {numOfEvents && (
          <>
            <div className="title">등급별 장애 건수</div>
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
        {hourlyEventTrendsDataset && (
          <HourlyEventsChart
            title="당일 시간별 장애 발생 추이"
            minHeight="160px"
            dataset={hourlyEventTrendsDataset}
          />
        )}
      </div>
      <div className="col mixed-chart">
        {dailyEventTrendsDataset && (
          <DailyEventsChart
            title="최근 장애 발생 추이"
            minHeight="160px"
            dataset={dailyEventTrendsDataset}
          />
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 22.5% 1fr 1fr;
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
  }
`;

export default ChartSection;
