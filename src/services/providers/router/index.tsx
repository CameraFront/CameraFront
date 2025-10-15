import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ConfigPerfPage from '@/pages/ConfigPerfPage';
import ConfigDetail from '@/pages/ConfigPerfPage/configTab/ConfigDetail';
import ConfigList from '@/pages/ConfigPerfPage/configTab/ConfigList';
import PerfDetail from '@/pages/ConfigPerfPage/perfTab/PerfDetail';
import PerfList from '@/pages/ConfigPerfPage/perfTab/PerfList';
import ProcessDetail from '@/pages/ConfigPerfPage/processTab/ProcessDetail';
import ProcessList from '@/pages/ConfigPerfPage/processTab/ProcessList';
import DashboardPage from '@/pages/DashboardPage';
import EventsPage from '@/pages/EventsPage';
import EventHistoryDetail from '@/pages/EventsPage/historyTab/EventHistoryDetail';
import EventHistoryList from '@/pages/EventsPage/historyTab/EventHistoryList';
import EventRepeatedDetail from '@/pages/EventsPage/repeatedTab/EventRepeatedDetail';
import EventsRepeatedList from '@/pages/EventsPage/repeatedTab/EventsRepeatedList';
import EventStatusDetail from '@/pages/EventsPage/statusTab/EventStatusDetail';
import StatusList from '@/pages/EventsPage/statusTab/EventStatusList';
import MapViewPage from '@/pages/MapViewPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProtectedRoute from '@/pages/ProtectedRoute';
import RackLayoutPage from '@/pages/RackLayoutPage';
import SigninPage from '@/pages/SigninPage';
import TelephoneExchangePage from '@/pages/TelephoneExchangePage';
import CallPeakTab from '@/pages/TelephoneExchangePage/callPeakTab';
import CurrentCallTab from '@/pages/TelephoneExchangePage/currentCallTab';
import PhoneStatisticsTab from '@/pages/TelephoneExchangePage/statisticsTab';
import UnregisteredDetail from '@/pages/TelephoneExchangePage/unregisteredTab/UnregisteredDetail';
import UnregisteredList from '@/pages/TelephoneExchangePage/unregisteredTab/UnregisteredList';
import TopologyPage from '@/pages/TopologyPage';
import InfrastructureReportPage from '@/pages/reports/InfrastructureReportPage';
import EventStatisticsTab from '@/pages/reports/InfrastructureReportPage/EventStatisticsTab';
import FacilityStatusTab from '@/pages/reports/InfrastructureReportPage/FacilityStatusTab';
import PerformanceStatisticsTab from '@/pages/reports/InfrastructureReportPage/PerformanceStatisticsTab';
import UnknownErrorContent from '@/components/fallbacks/UnknownErrorContent';
import WidgetHeightProvider from '@/features/dashboardPage/widget-height';
import { ROOT_KEY } from '@/config/constants';
import { ROUTES } from '@/config/routes';
import App from '@/App';

const RouterProvider = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
        errorElement={<UnknownErrorContent />}
      >
        <Route index element={<Navigate replace to={ROUTES.DASHBOARD} />} />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <WidgetHeightProvider>
              <DashboardPage />
            </WidgetHeightProvider>
          }
        />
        <Route path={ROUTES.TOPOLOGY} element={<TopologyPage />} />
        <Route path={ROUTES.CONFIG_PERF} element={<ConfigPerfPage />}>
          <Route
            index
            element={<Navigate replace to={`${ROUTES.CONFIG_PERF_CONFIG}`} />}
          />
          <Route path="config">
            <Route
              index
              element={
                <Navigate
                  replace
                  to={`${ROUTES.CONFIG_PERF_CONFIG}/${ROOT_KEY}`}
                />
              }
            />
            <Route path=":branchId" element={<ConfigList />} />
            <Route path=":branchId/:deviceId" element={<ConfigDetail />} />
          </Route>
          <Route path="perf">
            <Route
              index
              element={
                <Navigate
                  replace
                  to={`${ROUTES.CONFIG_PERF_PERF}/${ROOT_KEY}`}
                />
              }
            />
            <Route path=":branchId" element={<PerfList />} />
            <Route path=":branchId/:deviceId" element={<PerfDetail />} />
          </Route>
          <Route path="process">
            <Route
              index
              element={
                <Navigate
                  replace
                  to={`${ROUTES.CONFIG_PERF_PROCESS}/${ROOT_KEY}`}
                />
              }
            />
            <Route path=":branchId" element={<ProcessList />} />
            <Route path=":branchId/:deviceKey" element={<ProcessDetail />} />
          </Route>
        </Route>
        <Route path={ROUTES.EVENTS} element={<EventsPage />}>
          <Route
            index
            element={<Navigate replace to={`${ROUTES.EVENTS_STATUS}`} />}
          />
          <Route path="status">
            <Route
              index
              element={
                <Navigate replace to={`${ROUTES.EVENTS_STATUS}/${ROOT_KEY}`} />
              }
            />
            <Route path=":branchId" element={<StatusList />} />
            <Route path=":branchId/:deviceId" element={<EventStatusDetail />} />
          </Route>
          <Route path="history">
            <Route
              index
              element={
                <Navigate replace to={`${ROUTES.EVENTS_HISTORY}/${ROOT_KEY}`} />
              }
            />
            <Route path=":branchId" element={<EventHistoryList />} />
            <Route
              path=":branchId/:deviceId"
              element={<EventHistoryDetail />}
            />
          </Route>
          <Route path="repeated">
            <Route
              index
              element={
                <Navigate
                  replace
                  to={`${ROUTES.EVENTS_REPEATED}/${ROOT_KEY}`}
                />
              }
            />
            <Route path=":branchId" element={<EventsRepeatedList />} />
            <Route
              path=":branchId/:deviceId"
              element={<EventRepeatedDetail />}
            />
          </Route>
        </Route>
        <Route
          path={ROUTES.TELEPHONE_EXCHANGE}
          element={<TelephoneExchangePage />}
        >
          <Route
            index
            element={
              <Navigate
                replace
                to={`${ROUTES.TELEPHONE_EXCHANGE_UNREGISTERED}`}
              />
            }
          />
          <Route path="unregistered">
            <Route
              index
              element={
                <Navigate
                  replace
                  to={`${ROUTES.TELEPHONE_EXCHANGE_UNREGISTERED}/${ROOT_KEY}`}
                />
              }
            />
            <Route path=":branchId" element={<UnregisteredList />} />
            <Route
              path=":branchId/:deviceId"
              element={<UnregisteredDetail />}
            />
          </Route>
          <Route path="statistics">
            <Route
              index
              element={
                <Navigate
                  replace
                  to={`${ROUTES.TELEPHONE_EXCHANGE_STATISTICS}/${ROOT_KEY}`}
                />
              }
            />
            <Route path=":branchId" element={<PhoneStatisticsTab />} />
          </Route>
          <Route path="current-call-trend" element={<CurrentCallTab />} />
          <Route path="call-peak-trend" element={<CallPeakTab />} />
        </Route>
        <Route path={ROUTES.RACK_LAYOUT} element={<RackLayoutPage />} />
        <Route path={ROUTES.MAP_VIEW} element={<MapViewPage />} />
        <Route
          path={ROUTES.INFRASTRUCTURE_REPORT}
          element={<InfrastructureReportPage />}
        >
          <Route
            index
            element={
              <Navigate
                replace
                to={`${ROUTES.INFRASTRUCTURE_REPORT_FACILITY_STATUS}`}
              />
            }
          />
          <Route path="facility-status">
            <Route index element={<FacilityStatusTab />} />
            <Route path=":branchId" element={<FacilityStatusTab />} />
          </Route>
          <Route path="event-statistics">
            <Route index element={<EventStatisticsTab />} />
            <Route path=":branchId" element={<EventStatisticsTab />} />
          </Route>
          <Route path="performance-statistics">
            <Route index element={<PerformanceStatisticsTab />} />
            <Route path=":branchId" element={<PerformanceStatisticsTab />} />
          </Route>
        </Route>
      </Route>
      <Route path={ROUTES.SIGNIN} element={<SigninPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default RouterProvider;
