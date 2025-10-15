import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'simplebar-react/dist/simplebar.min.css';
import GlobalStateProvider from './globalState';
import RouterProvider from './router';
import StyleProvider from './style';

dayjs.locale('ko');
dayjs.extend(relativeTime);

const Providers = () => (
  <GlobalStateProvider>
    <StyleProvider>
      <RouterProvider />
    </StyleProvider>
  </GlobalStateProvider>
);

export default Providers;
